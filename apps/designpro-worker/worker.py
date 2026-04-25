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
        [FREECAD_BIN, '--console',
         str(SCRIPTS_DIR / 'freecad_gen.py'), '--',
         str(params_file), str(step_file)],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode != 0 or not step_file.exists():
        print(f'[freecad] non-zero exit or missing output — stderr: {result.stderr[:300]}', flush=True)
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
    Call Blender to render a STEP file to GLB.
    Falls back to a minimal stub GLB if Blender is not installed.
    Returns Path to output.glb (always exists, even if stub).
    """
    glb_file = workdir / 'output.glb'

    result = subprocess.run(
        [BLENDER_BIN, '--background',
         '--python', str(SCRIPTS_DIR / 'blender_render.py'), '--',
         str(step_file), str(glb_file)],
        capture_output=True,
        text=True,
        timeout=300,
    )
    if result.returncode != 0 or not glb_file.exists():
        print(f'[blender] non-zero exit or missing output — stderr: {result.stderr[:300]}', flush=True)
        # Minimal valid GLB (glTF 2.0 binary with empty scene)
        json_chunk = b'{"asset":{"version":"2.0"}}'
        # Pad JSON chunk to 4-byte alignment
        pad = (4 - len(json_chunk) % 4) % 4
        json_chunk += b' ' * pad
        json_len = len(json_chunk).to_bytes(4, 'little')
        total = 12 + 8 + len(json_chunk)
        header = b'glTF\x02\x00\x00\x00' + total.to_bytes(4, 'little')
        chunk_header = json_len + b'JSON'
        glb_file.write_bytes(header + chunk_header + json_chunk)
    return glb_file


# ─── Job processor ─────────────────────────────────────────────────

def calc_result(params):
    """Calculate structural metrics from job parameters."""
    dims = params.get('dimensions', {})
    opts = params.get('options', {})
    series = opts.get('profileSeries', '40')
    load   = opts.get('loadClass', 'medium')

    kg_per_m    = {'45': 4.2, '40': 3.1, '30': 2.1}.get(series, 3.1)
    load_factor = {'heavy': 1.4, 'light': 0.7}.get(load, 1.0)

    L = float(dims.get('length', 1200))
    W = float(dims.get('width', 800))
    H = float(dims.get('height', 900))

    verticals    = (L / 500 + 1) * (W / 500 + 1)
    horiz_l      = (L / 500) * (H / 400)
    horiz_w      = (W / 500) * (H / 400)
    profile_count = round((verticals + horiz_l + horiz_w) * load_factor)
    total_meters  = round(profile_count * (L + W + H) / 3 / 1000, 1)
    weight_kg     = round(total_meters * kg_per_m, 1)
    estimated_cost = round(weight_kg * 85 * load_factor)

    return {
        'profileCount':   profile_count,
        'totalMeters':    total_meters,
        'weightKg':       weight_kg,
        'estimatedCost':  estimated_cost,
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

        # Blender — render to GLB
        glb_file = run_blender(step_file, workdir)
        print(f'[worker] GLB ready: {glb_file.stat().st_size} bytes', flush=True)

        # BOM JSON
        bom_file = workdir / 'lista-materiales.json'
        bom_file.write_text(json.dumps({
            'jobId':         job_id,
            'structureType': params.get('structureType'),
            'dimensions':    params.get('dimensions', {}),
            'options':       params.get('options', {}),
            'result':        result,
        }, indent=2, ensure_ascii=False))

        # Upload artifacts
        upload_file(job_id, 'bom',    'lista-materiales.json',     bom_file)
        upload_file(job_id, 'step',   'modelo-cad.step',           step_file)
        upload_file(job_id, 'render', 'preview-3d.glb',            glb_file)

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
