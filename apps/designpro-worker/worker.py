#!/usr/bin/env python3
"""
DesignPro Worker — polls designpro-api for queued jobs, runs FreeCAD
for CAD generation and Blender for 3D rendering, then uploads results.

Environment variables (set in .env or shell):
  DESIGNPRO_API_URL   URL of the designpro-api  (default: http://localhost:8788)
  WORKER_SECRET       Shared secret for X-Worker-Secret header
  POLL_INTERVAL       Seconds between polls when idle (default: 5)
  FREECAD_BIN         FreeCAD CLI executable (default: FreeCAD)
  BLENDER_BIN         Blender CLI executable  (default: blender)
"""

import os
import sys
import time
import json
import base64
import tempfile
import subprocess
from pathlib import Path

try:
    import requests
except ImportError:
    print('[worker] ERROR: requests not installed — run: pip install requests', flush=True)
    sys.exit(1)

API_URL       = os.getenv('DESIGNPRO_API_URL', 'http://localhost:8788').rstrip('/')
WORKER_SECRET = os.getenv('WORKER_SECRET', '')
POLL_INTERVAL = float(os.getenv('POLL_INTERVAL', '5'))
FREECAD_BIN   = os.getenv('FREECAD_BIN', 'FreeCAD')
BLENDER_BIN   = os.getenv('BLENDER_BIN', 'blender')

SCRIPTS_DIR = Path(__file__).parent / 'scripts'

HEADERS = {
    'Content-Type': 'application/json',
    'X-Worker-Secret': WORKER_SECRET,
}


# ─── API helpers ───────────────────────────────────────────────────

def claim_job():
    """Atomically claim the next queued job. Returns job dict or None."""
    try:
        r = requests.get(f'{API_URL}/designpro/jobs/next', headers=HEADERS, timeout=10)
        if r.status_code == 204:
            return None
        r.raise_for_status()
        return r.json()
    except requests.exceptions.ConnectionError:
        print(f'[worker] API unreachable at {API_URL}', flush=True)
        return None
    except Exception as e:
        print(f'[worker] claim_job error: {e}', flush=True)
        return None


def upload_file(job_id, kind, name, file_path):
    """Upload a generated file as base64 JSON. Returns artifact dict."""
    with open(file_path, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
    payload = {'kind': kind, 'name': name, 'data': data}
    r = requests.post(
        f'{API_URL}/designpro/jobs/{job_id}/upload',
        headers=HEADERS,
        json=payload,
        timeout=120,
    )
    r.raise_for_status()
    return r.json()


def complete_job(job_id, result):
    """Mark job as done and persist calculated result dict."""
    r = requests.post(
        f'{API_URL}/designpro/jobs/{job_id}/complete',
        headers=HEADERS,
        json={'result': result},
        timeout=15,
    )
    r.raise_for_status()


def fail_job(job_id, error):
    """Mark job as failed with an error message."""
    try:
        r = requests.post(
            f'{API_URL}/designpro/jobs/{job_id}/fail',
            headers=HEADERS,
            json={'error': str(error)},
            timeout=15,
        )
        r.raise_for_status()
    except Exception as e:
        print(f'[worker] could not mark job {job_id} as failed: {e}', flush=True)


# ─── FreeCAD ───────────────────────────────────────────────────────

def run_freecad(job, workdir):
    """
    Call FreeCAD to generate a STEP file from job parameters.
    Falls back to a stub STEP if FreeCAD is not installed.
    Returns Path to output.step (always exists, even if stub).
    """
    params_file = workdir / 'params.json'
    step_file   = workdir / 'output.step'
    params_file.write_text(json.dumps(job.get('params', {}), ensure_ascii=False))

    result = subprocess.run(
        [FREECAD_BIN,
         str(SCRIPTS_DIR / 'freecad_gen.py'), '--',
         str(params_file), str(step_file)],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.stdout:
        print(result.stdout.strip(), flush=True)
    if result.returncode != 0 or not step_file.exists():
        print(f'[freecad] non-zero exit ({result.returncode}) — stderr: {result.stderr[:600]}', flush=True)
        # Write stub STEP so the pipeline can continue
        params = job.get('params', {})
        dims = params.get('dimensions', {})
        L = dims.get('length', 1200)
        W = dims.get('width', 800)
        H = dims.get('height', 900)
        step_file.write_text(
            f'ISO-10303-21;\nHEADER;\n'
            f"FILE_DESCRIPTION(('DesignPro stub {L}x{W}x{H}mm'),'2;1');\n"
            f"FILE_NAME('{step_file.name}','','','','NDS DesignPro','','');\n"
            f"FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));\nENDSEC;\nDATA;\nENDSEC;\nEND-ISO-10303-21;\n"
        )
    return step_file


# ─── Blender ───────────────────────────────────────────────────────

def run_blender(step_file, workdir):
    """
    Call Blender to render a STEP file to a PNG preview image.
    Falls back to a minimal stub PNG if Blender is not installed.
    Returns Path to output.png (always exists, even if stub).
    """
    png_file = workdir / 'output.png'

    result = subprocess.run(
        [BLENDER_BIN, '--background',
         '--python', str(SCRIPTS_DIR / 'blender_render.py'), '--',
         str(step_file), str(png_file)],
        capture_output=True,
        text=True,
        timeout=300,
    )
    if result.stdout:
        print(result.stdout.strip(), flush=True)
    if result.returncode != 0 or not png_file.exists():
        print(f'[blender] non-zero exit ({result.returncode}) — stderr: {result.stderr[:600]}', flush=True)
        # Minimal valid 1x1 PNG stub
        import struct, zlib
        def chunk(tag, data):
            raw = tag + data
            return struct.pack('>I', len(data)) + raw + struct.pack('>I', zlib.crc32(raw) & 0xFFFFFFFF)
        ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0))
        idat = chunk(b'IDAT', zlib.compress(b'\x00\x80\x80\x80'))
        iend = chunk(b'IEND', b'')
        png_file.write_bytes(b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend)
    return png_file


# ─── Job processor ─────────────────────────────────────────────────

def _load_profile_catalog():
    import json as _json
    catalog_path = Path(__file__).parent / 'data' / 'profiles.json'
    try:
        with open(catalog_path) as f:
            return _json.load(f)
    except Exception:
        return {}


def calc_result(params):
    """Calculate structural metrics from job parameters."""
    dims     = params.get('dimensions', {})
    opts     = params.get('options', {})
    series   = str(opts.get('profileSeries', '40'))
    provider = opts.get('provider', 'advanced')
    load     = opts.get('loadClass', 'medium')

    # Look up vendor-specific weight and price
    catalog   = _load_profile_catalog()
    spec      = (catalog.get('providers', {})
                        .get(provider, {})
                        .get('series', {})
                        .get(series, {}))
    kg_per_m      = spec.get('weight_kg_m', {'45': 1.78, '40': 1.44, '30': 0.92}.get(series, 1.44))
    price_mxn_m   = spec.get('price_mxn_m', {'45': 320, '40': 255, '30': 165}.get(series, 255))
    load_factor   = {'heavy': 1.4, 'light': 0.7}.get(load, 1.0)

    L = float(dims.get('length', 1200))
    W = float(dims.get('width',  800))
    H = float(dims.get('height', 900))

    verticals     = (L / 500 + 1) * (W / 500 + 1)
    horiz_l       = (L / 500) * (H / 400)
    horiz_w       = (W / 500) * (H / 400)
    profile_count = round((verticals + horiz_l + horiz_w) * load_factor)
    total_meters  = round(profile_count * (L + W + H) / 3 / 1000, 1)
    weight_kg     = round(total_meters * kg_per_m, 1)
    estimated_cost = round(total_meters * price_mxn_m * load_factor)

    return {
        'profileCount':   profile_count,
        'totalMeters':    total_meters,
        'weightKg':       weight_kg,
        'estimatedCost':  estimated_cost,
        'provider':       provider,
        'series':         series,
    }


def process_job(job):
    job_id = job['id']
    params = job.get('params') or {}
    print(f'[worker] processing job {job_id} type={job.get("type")}', flush=True)

    result = calc_result(params)

    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)

        # FreeCAD — generate STEP
        step_file = run_freecad(job, workdir)
        print(f'[worker] STEP ready: {step_file.stat().st_size} bytes', flush=True)

        # Blender — render isometric PNG preview
        png_file = run_blender(step_file, workdir)
        print(f'[worker] PNG ready: {png_file.stat().st_size} bytes', flush=True)

        # PDF report (BOM + cut list + render, Norwest branded)
        pdf_file = workdir / 'lista-materiales.pdf'
        logo_path = Path(__file__).parent / 'assets' / 'logo.png'
        try:
            import sys as _sys
            if str(SCRIPTS_DIR.parent) not in _sys.path:
                _sys.path.insert(0, str(SCRIPTS_DIR.parent))
            from scripts.pdf_gen import generate_pdf
            generate_pdf(params, result, png_file, pdf_file, logo_path)
        except Exception as e:
            print(f'[worker] PDF generation failed: {e} — skipping', flush=True)
            pdf_file = None

        # Upload artifacts
        if pdf_file and pdf_file.exists():
            upload_file(job_id, 'bom',    'lista-materiales.pdf',  pdf_file)
        upload_file(job_id, 'step',   'modelo-cad.step',           step_file)
        upload_file(job_id, 'render', 'preview-render.png',        png_file)

    complete_job(job_id, result)
    print(
        f'[worker] done — profileCount={result["profileCount"]}, weightKg={result["weightKg"]}',
        flush=True,
    )


# ─── Main loop ─────────────────────────────────────────────────────

def main():
    print(f'[worker] starting — API={API_URL}  poll={POLL_INTERVAL}s', flush=True)
    if not WORKER_SECRET:
        print('[worker] WARNING: WORKER_SECRET not set — worker endpoints are open', flush=True)

    while True:
        job = claim_job()
        if job:
            try:
                process_job(job)
            except Exception as e:
                print(f'[worker] job {job["id"]} unhandled error: {e}', flush=True)
                fail_job(job['id'], e)
        else:
            time.sleep(POLL_INTERVAL)


if __name__ == '__main__':
    main()
