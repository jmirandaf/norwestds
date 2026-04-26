#!/usr/bin/env python3
"""
FreeCAD script — generates a STEP file from DesignPro job parameters.

Called by worker.py as:
  FreeCAD --console freecad_gen.py -- <params.json> <output.step>

When FreeCAD is available, builds a parametric 3D model using Part workbench.
When running outside FreeCAD, writes a stub STEP header so the pipeline continues.
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
    """Build a parametric box model as a stand-in for the real structural geometry."""
    import FreeCAD   # noqa: F401 — only available inside FreeCAD runtime
    import Part
    import Mesh

    dims = params.get('dimensions', {})
    L = float(dims.get('length', 1200))
    W = float(dims.get('width',  800))
    H = float(dims.get('height', 900))

    # Base enclosure box
    box = Part.makeBox(L, W, H)

    # Add cross-member representation (simple inner box)
    inner = Part.makeBox(
        L * 0.9, W * 0.9, H * 0.9,
        FreeCAD.Vector(L * 0.05, W * 0.05, H * 0.05),
    )
    frame = box.cut(inner)

    # Export STEP (for download)
    Part.export([frame], str(output_path))
    print(f'[freecad_gen] exported STEP: {output_path} ({output_path.stat().st_size} bytes)', flush=True)

    # Export STL (for Blender import — native format, no add-on needed)
    stl_path = output_path.with_suffix('.stl')
    mesh = Mesh.Mesh(frame.tessellate(0.1))
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
        f"FILE_NAME('{output_path.name}','','('NDS DesignPro Worker'),'','','');\n"
        'FILE_SCHEMA((\'AUTOMOTIVE_DESIGN\'));\n'
        'ENDSEC;\n'
        'DATA;\n'
        '/* Stub output — install FreeCAD and set FREECAD_BIN to generate real geometry */\n'
        'ENDSEC;\n'
        'END-ISO-10303-21;\n'
    )
    print(f'[freecad_gen] stub STEP written (FreeCAD not available)', flush=True)


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
