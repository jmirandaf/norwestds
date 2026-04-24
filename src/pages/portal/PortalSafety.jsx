import { useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import '../../styles/tools.css'

// ISO 13849-1 PL lookup table
// Key: `${category}_${dc}_${mttfd}` → PL
const PL_TABLE = {
  'B_none_low':    'a',
  'B_none_medium': 'a',
  'B_none_high':   'b',
  '1_none_low':    null,
  '1_none_medium': 'b',
  '1_none_high':   'b',
  '2_low_low':     'b',
  '2_low_medium':  'b',
  '2_low_high':    'c',
  '2_medium_low':  'b',
  '2_medium_medium':'c',
  '2_medium_high': 'c',
  '3_low_low':     'b',
  '3_low_medium':  'c',
  '3_low_high':    'd',
  '3_medium_low':  'c',
  '3_medium_medium':'d',
  '3_medium_high': 'd',
  '4_high_high':   'e',
}

const PL_COLORS = { a: '#64748b', b: '#0284c7', c: '#059669', d: '#d97706', e: '#dc2626' }

const CATEGORIES = ['B', '1', '2', '3', '4']
const DC_LEVELS = [
  { id: 'none',   label: 'None',   range: '< 60%',   desc: 'Sin diagnóstico' },
  { id: 'low',    label: 'Low',    range: '60–90%',   desc: 'Diagnóstico básico' },
  { id: 'medium', label: 'Medium', range: '90–99%',   desc: 'Diagnóstico mejorado' },
  { id: 'high',   label: 'High',   range: '≥ 99%',    desc: 'Diagnóstico exhaustivo' },
]
const MTTFD_LEVELS = [
  { id: 'low',    label: 'Low',    range: '3–10 años',   desc: 'Baja confiabilidad' },
  { id: 'medium', label: 'Medium', range: '10–30 años',  desc: 'Confiabilidad media' },
  { id: 'high',   label: 'High',   range: '30–100 años', desc: 'Alta confiabilidad' },
]

const PL_DESCRIPTIONS = {
  a: 'PL a — Nivel de desempeño mínimo. Adecuado para riesgos muy bajos.',
  b: 'PL b — Nivel básico. Requiere arquitecturas simples con MTTFd medio-alto.',
  c: 'PL c — Nivel medio. Necesario en maquinaria con riesgo moderado de lesión.',
  d: 'PL d — Nivel alto. Exigido cuando existe probabilidad de lesiones graves.',
  e: 'PL e — Nivel máximo. Categoría 4, DC alta, MTTFd alto. Para riesgo de muerte.',
}

const CAT_DESCRIPTIONS = {
  B:  'Categoría B: Componentes seleccionados y aplicados de acuerdo con las especificaciones relevantes.',
  1:  'Categoría 1: Como B, pero con componentes de alta fiabilidad probados.',
  2:  'Categoría 2: La función de seguridad se verifica a intervalos por el sistema de control.',
  3:  'Categoría 3: Un único fallo no provoca la pérdida de la función de seguridad.',
  4:  'Categoría 4: Un único fallo o acumulación de fallos no provoca la pérdida de la función. DC ≥ 99%.',
}

function SelectGroup({ label, options, value, onChange }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">{label}</label>
      <div className="nds-safety-options">
        {options.map((o) => (
          <button
            key={o.id}
            className={`nds-safety-opt${value === o.id ? ' active' : ''}`}
            onClick={() => onChange(o.id)}
            type="button"
          >
            <span className="nds-safety-opt-label">{o.label}</span>
            {o.range && <span className="nds-safety-opt-range">{o.range}</span>}
          </button>
        ))}
      </div>
      {options.find((o) => o.id === value)?.desc && (
        <p className="nds-tool-hint">{options.find((o) => o.id === value).desc}</p>
      )}
    </div>
  )
}

export default function PortalSafety() {
  const [category, setCategory] = useState('3')
  const [dc, setDc] = useState('medium')
  const [mttfd, setMttfd] = useState('medium')

  const pl = useMemo(() => {
    return PL_TABLE[`${category}_${dc}_${mttfd}`] ?? null
  }, [category, dc, mttfd])

  const plColor = pl ? PL_COLORS[pl] : '#94a3b8'

  // Determine valid combinations for category 4
  const catConstraint = category === '4'
    ? 'Categoría 4 requiere DC = High y MTTFd = High.'
    : null

  return (
    <PortalLayout
      title="Calculadora Safety / PL"
      subtitle="Determinación del Performance Level según ISO 13849-1"
    >
      <div className="nds-tool-grid nds-tool-grid--safety">
        {/* ── Inputs ── */}
        <div className="nds-tool-panel">
          <div className="nds-tool-section-title">Parámetros de la función de seguridad</div>

          {/* Category */}
          <div className="nds-tool-field">
            <label className="nds-tool-label">Categoría</label>
            <div className="nds-safety-options">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`nds-safety-opt${category === c ? ' active' : ''}`}
                  onClick={() => setCategory(c)}
                  type="button"
                >
                  <span className="nds-safety-opt-label">Cat. {c}</span>
                </button>
              ))}
            </div>
            <p className="nds-tool-hint">{CAT_DESCRIPTIONS[category]}</p>
          </div>

          <SelectGroup
            label="Cobertura de diagnóstico (DC)"
            options={DC_LEVELS}
            value={dc}
            onChange={setDc}
          />

          <SelectGroup
            label="Tiempo medio hasta fallo peligroso (MTTFd)"
            options={MTTFD_LEVELS}
            value={mttfd}
            onChange={setMttfd}
          />

          {catConstraint && (
            <div className="nds-tool-info-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {catConstraint}
            </div>
          )}
        </div>

        {/* ── Result ── */}
        <div className="nds-tool-results">
          {/* PL badge */}
          <div className="nds-safety-result">
            {pl ? (
              <>
                <div className="nds-safety-pl-badge" style={{ background: plColor }}>
                  PL {pl.toUpperCase()}
                </div>
                <p className="nds-safety-pl-desc">{PL_DESCRIPTIONS[pl]}</p>
              </>
            ) : (
              <>
                <div className="nds-safety-pl-badge nds-safety-pl-badge--none">—</div>
                <p className="nds-safety-pl-desc">
                  Esta combinación no produce un PL válido según ISO 13849-1. Revisa los parámetros.
                </p>
              </>
            )}
          </div>

          {/* Reference table */}
          <div className="nds-safety-table-wrap">
            <h3 className="nds-roi-breakdown-title">Tabla de referencia ISO 13849-1</h3>
            <div className="nds-safety-table-scroll">
              <table className="nds-safety-table">
                <thead>
                  <tr>
                    <th>Cat.</th>
                    <th>DC</th>
                    <th>MTTFd</th>
                    <th>PL</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(PL_TABLE).map(([key, val]) => {
                    const [cat, dcK, mttfdK] = key.split('_')
                    if (!val) return null
                    const isActive = cat === category && dcK === dc && mttfdK === mttfd
                    return (
                      <tr key={key} className={isActive ? 'nds-safety-table-row--active' : ''}>
                        <td>{cat}</td>
                        <td className="nds-safety-td-cap">{dcK}</td>
                        <td className="nds-safety-td-cap">{mttfdK}</td>
                        <td>
                          <span
                            className="nds-safety-pl-chip"
                            style={{ background: PL_COLORS[val] }}
                          >
                            {val.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="nds-safety-norm-note">
            <strong>Nota normativa:</strong> Esta herramienta es de referencia rápida. Para validación
            oficial de la función de seguridad, consultar la norma ISO 13849-1:2015 y utilizar software
            certificado (SISTEMA, PAScal, etc.) con los parámetros reales del fabricante.
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
