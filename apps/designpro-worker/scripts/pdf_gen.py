#!/usr/bin/env python3
"""
PDF report generator for DesignPro jobs.

Produces a branded Norwest PDF with:
  - Isometric render preview
  - Structure description and dimensions
  - Bill of materials (BOM)
  - Cut list with quantities and lengths

Requires: weasyprint
"""

import base64
import json
from datetime import datetime
from pathlib import Path

STRUCTURE_LABELS = {
    'rack-selectivo':  'Rack Selectivo',
    'rack-drivein':    'Rack Drive-In',
    'mezzanine':       'Mezzanine',
    'conveyor-line':   'Conveyor Line',
    'celda-robotica':  'Celda Robótica',
    'estructura-industrial': 'Estructura Industrial',
}

LOAD_LABELS = {
    'light':  'Ligera',
    'medium': 'Media',
    'heavy':  'Pesada',
}

SERIES_LABELS = {
    '30': 'Serie 30 (30×30 mm)',
    '40': 'Serie 40 (40×40 mm)',
    '45': 'Serie 45 (45×45 mm)',
}


# ── Cut list ──────────────────────────────────────────────────────────────────

def calc_cuts(params):
    """Mirror freecad_gen logic to produce the cut list."""
    dims = params.get('dimensions', {})
    opts = params.get('options', {})

    L = float(dims.get('length', 1200))
    W = float(dims.get('width',  800))
    H = float(dims.get('height', 900))
    series = opts.get('profileSeries', '40')
    p = {'45': 45.0, '40': 40.0, '30': 30.0}.get(str(series), 40.0)
    load = opts.get('loadClass', 'medium')

    cuts = []  # (qty, length_mm, description)

    # Bottom frame
    cuts.append((2, L, 'Riel inferior — eje longitudinal'))
    cuts.append((2, W, 'Riel inferior — eje transversal'))

    # Top frame
    cuts.append((2, L, 'Riel superior — eje longitudinal'))
    cuts.append((2, W, 'Riel superior — eje transversal'))

    # Corner columns
    cuts.append((4, H, 'Columna vertical — esquinas'))

    # Mid-span verticals
    n_extra_vert = 0
    if load == 'heavy' or L >= 1200:
        cuts.append((2, H, 'Columna vertical — centro longitudinal'))
        n_extra_vert += 2
    if load == 'heavy' or W >= 900:
        cuts.append((2, H, 'Columna vertical — centro transversal'))
        n_extra_vert += 2

    # Mid-height rails
    if H >= 700 or load == 'heavy':
        cuts.append((2, L, 'Travesaño horizontal — longitudinal, media altura'))
        cuts.append((2, W, 'Travesaño horizontal — transversal, media altura'))

    return cuts


def summarise_cuts(cuts):
    """Group cuts by length for the simplified summary table."""
    grouped = {}
    for qty, length, desc in cuts:
        key = int(round(length))
        if key not in grouped:
            grouped[key] = 0
        grouped[key] += qty
    return sorted(grouped.items())  # [(length_mm, total_qty), ...]


# ── HTML template ─────────────────────────────────────────────────────────────

def _b64_file(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode()


def build_html(params, result, render_png_path, logo_path):
    dims    = params.get('dimensions', {})
    opts    = params.get('options', {})
    st_id   = params.get('structureType', '')

    L = dims.get('length', 1200)
    W = dims.get('width',  800)
    H = dims.get('height', 900)

    st_label   = STRUCTURE_LABELS.get(st_id, st_id.replace('-', ' ').title())
    load_label = LOAD_LABELS.get(opts.get('loadClass', 'medium'), 'Media')
    series_label = SERIES_LABELS.get(str(opts.get('profileSeries', '40')), '')

    cuts       = calc_cuts(params)
    summary    = summarise_cuts(cuts)

    render_b64 = _b64_file(render_png_path)
    logo_b64   = _b64_file(logo_path)
    logo_ext   = Path(logo_path).suffix.lstrip('.')
    date_str   = datetime.now().strftime('%d/%m/%Y')

    # ── BOM rows ──
    bom_rows = '\n'.join(f'''
        <tr>
          <td>{row[0]}</td>
          <td style="text-align:right">{row[1]}</td>
        </tr>''' for row in [
        ('Perfiles de aluminio extruido',  f'{result["profileCount"]} piezas'),
        ('Longitud total de perfil',        f'{result["totalMeters"]} m'),
        ('Peso estimado',                   f'{result["weightKg"]} kg'),
        ('Costo estimado (material)',       f'${result["estimatedCost"]:,}'),
    ])

    # ── Cut list rows ──
    cut_rows = '\n'.join(f'''
        <tr>
          <td style="text-align:center">{qty}</td>
          <td style="text-align:right">{int(round(length))} mm</td>
          <td>{desc}</td>
        </tr>''' for qty, length, desc in cuts)

    # ── Summary rows ──
    summary_rows = '\n'.join(f'''
        <tr>
          <td style="text-align:center">{qty}</td>
          <td style="text-align:right">{length} mm</td>
          <td style="text-align:right; font-variant-numeric:tabular-nums">{qty * length:,} mm</td>
        </tr>''' for length, qty in summary)

    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @page {{
    size: A4;
    margin: 0;
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #0F172A;
    background: #fff;
  }}

  /* ── Header ── */
  .header {{
    background: #071e30;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .header img {{ height: 38px; }}
  .header-meta {{
    text-align: right;
    color: #8892A0;
    font-size: 8.5pt;
    line-height: 1.6;
  }}
  .header-meta strong {{
    display: block;
    color: #fff;
    font-size: 13pt;
    font-weight: 700;
    margin-bottom: 2px;
  }}

  /* ── Accent bar ── */
  .accent-bar {{
    height: 4px;
    background: linear-gradient(90deg, #007DA6 0%, #12A6CC 100%);
  }}

  /* ── Content wrapper ── */
  .content {{ padding: 24px 32px 0; }}

  /* ── Render image ── */
  .render-wrap {{
    background: #F4F7FB;
    border: 1px solid #DBE3EE;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    text-align: center;
  }}
  .render-wrap img {{ width: 100%; max-height: 280px; object-fit: contain; }}

  /* ── Info cards ── */
  .info-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }}
  .info-card {{
    background: #F4F7FB;
    border: 1px solid #DBE3EE;
    border-radius: 6px;
    padding: 10px 12px;
  }}
  .info-card .label {{
    font-size: 7.5pt;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-bottom: 2px;
  }}
  .info-card .value {{
    font-size: 12pt;
    font-weight: 700;
    color: #007DA6;
  }}
  .info-card .unit {{
    font-size: 8pt;
    color: #64748B;
  }}

  /* ── Section title ── */
  .section-title {{
    font-size: 11pt;
    font-weight: 700;
    color: #004C71;
    border-left: 4px solid #007DA6;
    padding-left: 9px;
    margin: 18px 0 8px;
  }}

  /* ── Tables ── */
  table {{ width: 100%; border-collapse: collapse; font-size: 9pt; }}
  thead th {{
    background: #007DA6;
    color: #fff;
    padding: 7px 10px;
    text-align: left;
    font-weight: 600;
  }}
  tbody td {{ padding: 6px 10px; border-bottom: 1px solid #DBE3EE; }}
  tbody tr:nth-child(even) td {{ background: #F4F7FB; }}

  /* ── Two-column layout for tables ── */
  .two-col {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 4px;
  }}

  /* ── Footer ── */
  .footer {{
    background: #071e30;
    color: #8892A0;
    padding: 10px 32px;
    font-size: 7.5pt;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }}
  .footer span {{ color: #fff; }}
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <img src="data:image/{logo_ext};base64,{logo_b64}" alt="Norwest DS">
  <div class="header-meta">
    <strong>Reporte DesignPro</strong>
    {st_label} &nbsp;·&nbsp; {date_str}
  </div>
</div>
<div class="accent-bar"></div>

<div class="content">

  <!-- Render -->
  <div class="render-wrap">
    <img src="data:image/png;base64,{render_b64}" alt="Render isométrico">
  </div>

  <!-- Info cards -->
  <div class="info-grid">
    <div class="info-card">
      <div class="label">Tipo de estructura</div>
      <div class="value" style="font-size:10pt">{st_label}</div>
    </div>
    <div class="info-card">
      <div class="label">Dimensiones (L × W × H)</div>
      <div class="value" style="font-size:10pt">{int(L)} × {int(W)} × {int(H)} <span class="unit">mm</span></div>
    </div>
    <div class="info-card">
      <div class="label">Perfil</div>
      <div class="value" style="font-size:10pt">{series_label}</div>
    </div>
    <div class="info-card">
      <div class="label">Clase de carga</div>
      <div class="value" style="font-size:10pt">{load_label}</div>
    </div>
  </div>

  <!-- BOM + summary side by side -->
  <div class="two-col">
    <div>
      <div class="section-title">Lista de materiales</div>
      <table>
        <thead><tr><th>Descripción</th><th style="text-align:right">Cantidad</th></tr></thead>
        <tbody>{bom_rows}</tbody>
      </table>
    </div>
    <div>
      <div class="section-title">Resumen de cortes</div>
      <table>
        <thead>
          <tr>
            <th style="text-align:center">Pzas</th>
            <th style="text-align:right">Largo</th>
            <th style="text-align:right">Total lineal</th>
          </tr>
        </thead>
        <tbody>{summary_rows}</tbody>
      </table>
    </div>
  </div>

  <!-- Detailed cut list -->
  <div class="section-title">Lista de cortes detallada</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:center; width:50px">Cant.</th>
        <th style="text-align:right; width:80px">Largo</th>
        <th>Descripción del corte</th>
      </tr>
    </thead>
    <tbody>{cut_rows}</tbody>
  </table>

</div><!-- /content -->

<!-- Footer -->
<div class="footer">
  <div>Norwest DS &nbsp;·&nbsp; DesignPro &nbsp;·&nbsp; <span>norwestds.com</span></div>
  <div>Generado el {date_str} &nbsp;·&nbsp; Este documento es de carácter informativo</div>
</div>

</body>
</html>'''


# ── Entry point ───────────────────────────────────────────────────────────────

def generate_pdf(params, result, render_png_path, output_pdf_path, logo_path):
    from weasyprint import HTML

    html = build_html(params, result, render_png_path, logo_path)
    HTML(string=html).write_pdf(str(output_pdf_path))
    size = Path(output_pdf_path).stat().st_size
    print(f'[pdf_gen] PDF generated: {output_pdf_path} ({size} bytes)', flush=True)
