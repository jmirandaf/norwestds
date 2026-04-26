#!/usr/bin/env python3
"""
FreeCAD script — generates a STEP file from DesignPro job parameters.

Called by worker.py as:
  FreeCAD --console freecad_gen.py -- <params.json> <output.step>

Builds a parametric aluminum-profile frame: individual square-section beams
along all edges plus cross-members, matching the selected profile series and
load class.  Also exports an STL for Blender (native import, no add-on needed).
Falls back to a stub STEP header when FreeCAD is not available.
"""

import sys
import json
from pathlib import Path


def parse_args():
    argv = sys.argv
    sep = argv.index('--') if '--' in argv else len(argv)
    args = argv[sep + 1:]
    if len(args) < 2:
        print('Usage: freecad_gen.py -- params.json output.step')
        sys.exit(1)
    return Path(args[0]), Path(args[1])


def build_model_freecad(params, output_path):
    """Build a parametric aluminum-profile frame structure."""
    import FreeCAD
    import Part
    import Mesh

    dims = params.get('dimensions', {})
    opts = params.get('options', {})

    L = float(dims.get('length', 1200))
    W = float(dims.get('width',  800))
    H = float(dims.get('height', 900))

    series = opts.get('profileSeries', '40')
    p = {'45': 45.0, '40': 40.0, '30': 30.0}.get(str(series), 40.0)  # profile size mm

    load = opts.get('loadClass', 'medium')

    members = []

    def bx(x0, y0, z0, length):
        return Part.makeBox(length, p, p, FreeCAD.Vector(x0, y0, z0))

    def by(x0, y0, z0, length):
        return Part.makeBox(p, length, p, FreeCAD.Vector(x0, y0, z0))

    def bz(x0, y0, z0, length):
        return Part.makeBox(p, p, length, FreeCAD.Vector(x0, y0, z0))

    # ── Bottom frame ──────────────────────────────────────────────────
    members += [
        bx(0,   0,   0, L),   # front-bottom X
        bx(0,   W-p, 0, L),   # back-bottom X
        by(0,   0,   0, W),   # left-bottom Y
        by(L-p, 0,   0, W),   # right-bottom Y
    ]

    # ── Top frame ─────────────────────────────────────────────────────
    members += [
        bx(0,   0,   H-p, L),  # front-top X
        bx(0,   W-p, H-p, L),  # back-top X
        by(0,   0,   H-p, W),  # left-top Y
        by(L-p, 0,   H-p, W),  # right-top Y
    ]

    # ── Corner verticals ──────────────────────────────────────────────
    members += [
        bz(0,   0,   0, H),
        bz(L-p, 0,   0, H),
        bz(0,   W-p, 0, H),
        bz(L-p, W-p, 0, H),
    ]

    # ── Mid-span verticals (heavy load or wide structure) ─────────────
    if load == 'heavy' or L >= 1200:
        mx = L / 2 - p / 2
        members += [bz(mx, 0, 0, H), bz(mx, W-p, 0, H)]
    if load == 'heavy' or W >= 900:
        my = W / 2 - p / 2
        members += [bz(0, my, 0, H), bz(L-p, my, 0, H)]

    # ── Horizontal cross-members at mid-height ────────────────────────
    if H >= 700 or load == 'heavy':
        mz = H / 2 - p / 2
        members += [
            bx(0,   0,   mz, L),
            bx(0,   W-p, mz, L),
            by(0,   0,   mz, W),
            by(L-p, 0,   mz, W),
        ]

    frame = Part.makeCompound(members)

    # Export STEP (for download)
    Part.export([frame], str(output_path))
    print(f'[freecad_gen] exported STEP: {output_path} ({output_path.stat().st_size} bytes)', flush=True)

    # Export STL (for Blender — native import, no add-on needed)
    stl_path = output_path.with_suffix('.stl')
    mesh = Mesh.Mesh()
    for member in members:
        mesh.addMesh(Mesh.Mesh(member.tessellate(0.5)))
    mesh.write(str(stl_path))
    print(f'[freecad_gen] exported STL: {stl_path} ({stl_path.stat().st_size} bytes)', flush=True)


def write_stub_step(params, output_path):
    dims = params.get('dimensions', {})
    L = dims.get('length', 1200)
    W = dims.get('width',  800)
    H = dims.get('height', 900)
    structure = params.get('structureType', 'unknown')

    output_path.write_text(
        'ISO-10303-21;\n'
        'HEADER;\n'
        f"FILE_DESCRIPTION(('NDS DesignPro — {structure} {L}x{W}x{H}mm'),'2;1');\n"
        f"FILE_NAME('{output_path.name}','','','','NDS DesignPro Worker','','');\n"
        "FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));\n"
        'ENDSEC;\n'
        'DATA;\n'
        '/* Stub output — FreeCAD not available */\n'
        'ENDSEC;\n'
        'END-ISO-10303-21;\n'
    )
    print('[freecad_gen] stub STEP written (FreeCAD not available)', flush=True)


def main():
    params_path, output_path = parse_args()

    with open(params_path) as f:
        params = json.load(f)

    try:
        build_model_freecad(params, output_path)
    except ImportError:
        write_stub_step(params, output_path)
    except Exception as e:
        print(f'[freecad_gen] error during model build: {e}', flush=True)
        write_stub_step(params, output_path)


if __name__ == '__main__':
    main()
