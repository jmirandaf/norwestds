#!/usr/bin/env python3
"""
Blender script — imports a STEP file and renders an isometric PNG preview.

Called by worker.py as:
  blender --background --python blender_render.py -- <input.step> <output.png>

When running inside Blender's Python environment, performs a real render.
When running standalone, writes a minimal valid PNG stub so the pipeline continues.
"""

import sys
from pathlib import Path


def parse_args():
    argv = sys.argv
    sep = argv.index('--') if '--' in argv else len(argv)
    args = argv[sep + 1:]
    if len(args) < 2:
        print('Usage: blender_render.py -- input.step output.png')
        sys.exit(1)
    return Path(args[0]), Path(args[1])


def render_with_blender(input_step, output_png):
    import bpy
    import mathutils

    # Empty scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Import STEP — requires CAD add-on; fall back to cube placeholder
    try:
        bpy.ops.import_scene.step(filepath=str(input_step))
    except AttributeError:
        bpy.ops.mesh.primitive_cube_add(size=1)

    # Select all mesh objects
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if meshes:
        # Apply a neutral gray material
        mat = bpy.data.materials.new(name='Structure')
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get('Principled BSDF')
        if bsdf:
            bsdf.inputs['Base Color'].default_value = (0.55, 0.65, 0.75, 1.0)
            bsdf.inputs['Metallic'].default_value = 0.3
            bsdf.inputs['Roughness'].default_value = 0.5
        for o in meshes:
            o.select_set(True)
            if o.data.materials:
                o.data.materials[0] = mat
            else:
                o.data.materials.append(mat)

    # Isometric camera at 45° elevation, 45° azimuth
    cam_data = bpy.data.cameras.new('Camera')
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = 4.0
    cam_obj = bpy.data.objects.new('Camera', cam_data)
    bpy.context.collection.objects.link(cam_obj)
    cam_obj.location = (4, -4, 4)
    direction = mathutils.Vector((0, 0, 0)) - cam_obj.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam_obj.rotation_euler = rot_quat.to_euler()
    bpy.context.scene.camera = cam_obj

    # Three-point lighting
    for loc, energy in [((6, -4, 8), 5.0), ((-4, -6, 4), 2.0), ((0, 8, 4), 1.5)]:
        bpy.ops.object.light_add(type='AREA', location=loc)
        bpy.context.active_object.data.energy = energy

    # Render settings — EEVEE for fast headless render
    scene = bpy.context.scene
    for engine in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            scene.render.engine = engine
            break
        except Exception:
            pass

    scene.render.resolution_x = 1280
    scene.render.resolution_y = 960
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.film_transparent = True
    scene.render.filepath = str(output_png)

    bpy.ops.render.render(write_still=True)
    print(f'[blender_render] PNG rendered: {output_png} ({output_png.stat().st_size} bytes)', flush=True)


def write_stub_png(output_png):
    """Write the smallest valid PNG (1x1 gray pixel) as fallback."""
    import struct
    import zlib

    def chunk(tag, data):
        raw = tag + data
        return struct.pack('>I', len(data)) + raw + struct.pack('>I', zlib.crc32(raw) & 0xFFFFFFFF)

    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0))
    idat = chunk(b'IDAT', zlib.compress(b'\x00\x80\x80\x80'))
    iend = chunk(b'IEND', b'')
    output_png.write_bytes(b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend)
    print('[blender_render] stub PNG written (Blender not available)', flush=True)


def main():
    input_step, output_png = parse_args()

    try:
        render_with_blender(input_step, output_png)
    except ImportError:
        write_stub_png(output_png)
    except Exception as e:
        print(f'[blender_render] render error: {e}', flush=True)
        write_stub_png(output_png)


if __name__ == '__main__':
    main()
