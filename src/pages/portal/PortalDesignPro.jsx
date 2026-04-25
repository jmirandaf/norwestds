import { useEffect, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import {
  createDesignProJob,
  getDesignProJob,
  listDesignProJobs,
} from '../../services/designProService'

const STRUCTURE_DEFS = [
  {
    id: 'rack-selectivo',
    name: 'Rack Selectivo',
    desc: 'Acceso directo a cada pallet',
    icon: (
      <>
        <rect x="2" y="3" width="20" height="4" rx="1"/>
        <rect x="2" y="10" width="20" height="4" rx="1"/>
        <rect x="2" y="17" width="20" height="4" rx="1"/>
        <line x1="7" y1="3" x2="7" y2="21"/>
        <line x1="17" y1="3" x2="17" y2="21"/>
      </>
    ),
  },
  {
    id: 'rack-drivein',
    name: 'Rack Drive-In',
    desc: 'Máxima densidad de almacenamiento',
    icon: (
      <>
        <path d="M3 3h18v18H3z" strokeWidth="1.5"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1"/>
      </>
    ),
  },
  {
    id: 'mezzanine',
    name: 'Mezzanine',
    desc: 'Plataforma elevada de trabajo',
    icon: (
      <>
        <rect x="2" y="14" width="20" height="3" rx="1"/>
        <path d="M6 14V5M18 14V5"/>
        <path d="M2 17v4M22 17v4"/>
        <line x1="6" y1="8" x2="18" y2="8" strokeDasharray="2 2"/>
      </>
    ),
  },
  {
    id: 'conveyor-line',
    name: 'Línea Conveyor',
    desc: 'Transporte automatizado de material',
    icon: (
      <>
        <rect x="2" y="10" width="20" height="4" rx="1"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <path d="M6 16v-2M18 16v-2"/>
        <path d="M8 7l4-4 4 4" strokeWidth="1.5"/>
      </>
    ),
  },
]

const PROVIDER_LABELS  = { tjsd: 'TJSD', modular: 'Modular', item: 'item' }
const SERIES_LABELS    = { '30': 'Serie 30 (30×30 mm)', '40': 'Serie 40 (40×40 mm)', '45': 'Serie 45 (45×45 mm)' }
const LOAD_LABELS      = { light: 'Ligera (< 50 kg)', medium: 'Media (50–150 kg)', heavy: 'Pesada (> 150 kg)' }
const PANEL_LABELS     = { none: 'Sin panel', mesh: 'Malla metálica', polycarbonate: 'Policarbonato' }
const DOOR_LABELS      = { none: 'Sin puerta', hinged: 'Bisagra', sliding: 'Corredera' }
const STATUS_LABELS    = { queued: 'En cola', processing: 'Procesando', done: 'Completado', failed: 'Error' }

const STEPS = [
  'Tipo de estructura',
  'Dimensiones',
  'Opciones',
  'Resumen',
  'Resultado',
]

const ARTIFACT_ICONS = {
  bom: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>,
  step: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  pdf:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  render: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
}

export default function PortalDesignPro() {
  const { currentUser } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [jobs, setJobs] = useState([])
  const [currentJobId, setCurrentJobId] = useState(null)

  const [form, setForm] = useState({
    structureType: 'rack-selectivo',
    provider: 'tjsd',
    length: 1200,
    width: 800,
    height: 900,
    profileSeries: '40',
    loadClass: 'medium',
    panelType: 'none',
    doorType: 'none',
  })

  useEffect(() => {
    listDesignProJobs({ limit: 20 }).then(setJobs).catch(console.error)
  }, [])

  useEffect(() => {
    if (!currentJobId) return
    const timer = setInterval(async () => {
      try {
        const job = await getDesignProJob(currentJobId)
        setResult(job)
        setJobs(prev => [job, ...prev.filter(j => j.id !== job.id)])
        if (job.status === 'done' || job.status === 'failed') {
          clearInterval(timer)
          setLoading(false)
        }
      } catch (e) {
        console.error(e)
        clearInterval(timer)
        setLoading(false)
      }
    }, 1200)
    return () => clearInterval(timer)
  }, [currentJobId])

  const onChange = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const job = await createDesignProJob({
        type: 'structure_generate',
        priority: 'normal',
        requesterId: currentUser?.uid || 'portal_user',
        source: 'portal',
        projectName: `DesignPro ${new Date().toISOString().slice(0, 10)}`,
        params: {
          structureType: form.structureType,
          provider: form.provider,
          dimensions: {
            length: Number(form.length),
            width: Number(form.width),
            height: Number(form.height),
          },
          options: {
            profileSeries: form.profileSeries,
            loadClass: form.loadClass,
            panelType: form.panelType,
            doorType: form.doorType,
          },
        },
      })
      setCurrentJobId(job.id)
      setResult(job)
      setJobs(prev => [job, ...prev.filter(j => j.id !== job.id)])
      setStep(4)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const activeStruct = STRUCTURE_DEFS.find(s => s.id === form.structureType)

  return (
    <PortalLayout
      title="DesignPro by NDS"
      subtitle="Genera especificaciones técnicas para estructuras industriales"
    >
      <div className="nds-dp-wizard">

        {/* ── Stepper ── */}
        <aside className="nds-dp-stepper">
          {STEPS.map((label, i) => {
            const state = i === step ? 'active' : i < step ? 'done' : 'locked'
            return (
              <button
                key={i}
                className={`nds-dp-step nds-dp-step--${state}`}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
              >
                <span className="nds-dp-step-num">
                  {state === 'done'
                    ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1}
                </span>
                <span className="nds-dp-step-label">{label}</span>
              </button>
            )
          })}
        </aside>

        {/* ── Main panel ── */}
        <section className="nds-dp-panel">

          {step === 0 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">¿Qué tipo de estructura necesitas?</h2>
                <p className="nds-dp-panel-sub">Selecciona el tipo — avanza automáticamente al siguiente paso</p>
              </div>
              <div className="nds-dp-struct-grid">
                {STRUCTURE_DEFS.map(s => (
                  <button
                    key={s.id}
                    className={`nds-dp-struct-btn${form.structureType === s.id ? ' active' : ''}`}
                    onClick={() => { onChange('structureType', s.id); setStep(1) }}
                  >
                    <span className="nds-dp-struct-icon">
                      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        {s.icon}
                      </svg>
                    </span>
                    <strong>{s.name}</strong>
                    <span className="nds-dp-struct-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Dimensiones de la estructura</h2>
                <p className="nds-dp-panel-sub">Ingresa las dimensiones externas en milímetros</p>
              </div>
              <div className="nds-dp-dim-grid">
                <DimField label="Largo" hint="Dimensión frontal" value={form.length} onChange={v => onChange('length', v)} />
                <DimField label="Ancho" hint="Profundidad / lateral" value={form.width} onChange={v => onChange('width', v)} />
                <DimField label="Alto" hint="Dimensión vertical total" value={form.height} onChange={v => onChange('height', v)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Especificaciones técnicas</h2>
                <p className="nds-dp-panel-sub">Configura los materiales y componentes de la estructura</p>
              </div>
              <div className="nds-dp-opts-grid">
                <SelectField label="Proveedor" hint="Sistema de perfiles a utilizar" value={form.provider} onChange={v => onChange('provider', v)} options={PROVIDER_LABELS} />
                <SelectField label="Serie de perfil" hint="Sección transversal del perfil" value={form.profileSeries} onChange={v => onChange('profileSeries', v)} options={SERIES_LABELS} />
                <SelectField label="Clase de carga" hint="Capacidad de carga estructural" value={form.loadClass} onChange={v => onChange('loadClass', v)} options={LOAD_LABELS} />
                <SelectField label="Panel lateral" hint="Tipo de cerramiento" value={form.panelType} onChange={v => onChange('panelType', v)} options={PANEL_LABELS} />
                <SelectField label="Tipo de puerta" hint="Acceso a la estructura" value={form.doorType} onChange={v => onChange('doorType', v)} options={DOOR_LABELS} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Resumen de configuración</h2>
                <p className="nds-dp-panel-sub">Revisa los parámetros antes de generar las especificaciones</p>
              </div>
              <div className="nds-dp-summary-grid">
                <SummaryRow label="Tipo de estructura" value={activeStruct?.name} />
                <SummaryRow label="Proveedor" value={PROVIDER_LABELS[form.provider]} />
                <SummaryRow label="Dimensiones" value={`${form.length} × ${form.width} × ${form.height} mm`} />
                <SummaryRow label="Serie de perfil" value={SERIES_LABELS[form.profileSeries]} />
                <SummaryRow label="Clase de carga" value={LOAD_LABELS[form.loadClass]} />
                <SummaryRow label="Panel lateral" value={PANEL_LABELS[form.panelType]} />
                <SummaryRow label="Tipo de puerta" value={DOOR_LABELS[form.doorType]} />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Especificaciones generadas</h2>
              </div>

              {loading && (
                <div className="nds-dp-loading">
                  <div className="nds-dp-spinner" />
                  <p>Procesando especificaciones…</p>
                  <div className="nds-dp-progress-bar"><div className="nds-dp-progress-fill" /></div>
                </div>
              )}

              {!loading && result?.status === 'done' && (() => {
                const res = result.params?.result || {}
                const dims = result.params?.dimensions || {}
                return (
                  <>
                    <div className="nds-dp-result-kpis">
                      <ResultKpi
                        label="Dimensiones"
                        value={`${dims.length}×${dims.width}×${dims.height}`}
                        unit="mm"
                      />
                      <ResultKpi
                        label="Peso estimado"
                        value={res.weightKg != null ? res.weightKg.toFixed(1) : '—'}
                        unit="kg"
                        accent
                      />
                      <ResultKpi
                        label="Perfiles requeridos"
                        value={res.profileCount ?? '—'}
                        unit="piezas"
                      />
                    </div>
                    <div className="nds-dp-artifact-list">
                      <div className="nds-dp-artifact-header">Archivos generados</div>
                      {(result.artifacts || []).map(a => (
                        <div key={a.id} className="nds-dp-artifact-item">
                          <span className="nds-dp-artifact-icon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              {ARTIFACT_ICONS[a.kind] ?? ARTIFACT_ICONS.bom}
                            </svg>
                          </span>
                          <span className="nds-dp-artifact-name">{a.name}</span>
                          <span className="nds-dp-artifact-kind">{a.kind.toUpperCase()}</span>
                          <button
                            className="nds-dp-artifact-dl"
                            disabled={!a.url}
                            title={a.url ? 'Descargar archivo' : 'Disponible próximamente'}
                            onClick={() => a.url && window.open(a.url)}
                          >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            {a.url ? 'Descargar' : 'Próximamente'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}

              {!loading && result?.status === 'failed' && (
                <div className="nds-dp-error">
                  <p>Ocurrió un error al procesar el job.</p>
                  <button className="nds-btn nds-btn-ghost" onClick={() => setStep(3)}>← Intentar de nuevo</button>
                </div>
              )}

              {!loading && !result && (
                <p className="nds-dp-empty">Presiona "Generar especificaciones" para iniciar.</p>
              )}
            </>
          )}

          {/* ── Actions ── */}
          <div className="nds-dp-actions">
            <button
              className="nds-btn nds-btn-ghost"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0 || step === 4}
            >
              ← Atrás
            </button>
            {step < 3 && (
              <button className="nds-btn nds-btn-primary" onClick={() => setStep(s => s + 1)}>
                Siguiente →
              </button>
            )}
            {step === 3 && (
              <button className="nds-btn nds-btn-primary" onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generando…' : 'Generar especificaciones →'}
              </button>
            )}
          </div>
        </section>

        {/* ── Right panel ── */}
        <aside className="nds-dp-side">
          <div className="nds-dp-side-summary">
            <div className="nds-dp-side-title">Configuración actual</div>
            <div className="nds-dp-side-row"><span>Tipo</span><strong>{activeStruct?.name}</strong></div>
            <div className="nds-dp-side-row"><span>Proveedor</span><strong>{PROVIDER_LABELS[form.provider]}</strong></div>
            <div className="nds-dp-side-row"><span>Perfil</span><strong>Serie {form.profileSeries}</strong></div>
            <div className="nds-dp-side-row"><span>Dims</span><strong>{form.length}×{form.width}×{form.height} mm</strong></div>
            <div className="nds-dp-side-row"><span>Carga</span><strong>{LOAD_LABELS[form.loadClass]}</strong></div>
          </div>

          <div className="nds-dp-side-section">
            <div className="nds-dp-side-title">Jobs recientes</div>
            {jobs.length === 0 && <p className="nds-dp-side-empty">Sin jobs aún</p>}
            {jobs.slice(0, 8).map(j => (
              <button
                key={j.id}
                className="nds-dp-job-item"
                onClick={() => { setCurrentJobId(j.id); setResult(j); setStep(4) }}
              >
                <div className="nds-dp-job-name">{j.projectName || j.type}</div>
                <div className="nds-dp-job-meta">
                  <span>{String(j.createdAt || '').slice(0, 10)}</span>
                  <span className={`nds-dp-badge nds-dp-badge--${j.status}`}>
                    {STATUS_LABELS[j.status] || j.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

      </div>
    </PortalLayout>
  )
}

function DimField({ label, hint, value, onChange }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">
        {label}
        <span className="nds-tool-hint">{hint}</span>
      </label>
      <div className="nds-tool-input-wrap">
        <input
          type="number"
          className="nds-tool-input"
          value={value}
          min={1}
          onChange={e => onChange(e.target.value)}
        />
        <span className="nds-tool-unit nds-tool-unit--post">mm</span>
      </div>
    </div>
  )
}

function SelectField({ label, hint, value, onChange, options }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">
        {label}
        <span className="nds-tool-hint">{hint}</span>
      </label>
      <div className="nds-tool-input-wrap">
        <select
          className="nds-tool-input"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {Object.entries(options).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="nds-dp-summary-row">
      <span className="nds-dp-summary-label">{label}</span>
      <span className="nds-dp-summary-value">{value}</span>
    </div>
  )
}

function ResultKpi({ label, value, unit, accent }) {
  return (
    <div className={`nds-roi-kpi${accent ? ' nds-roi-kpi--accent' : ''}`}>
      <div className="nds-roi-kpi-val">{value}</div>
      <div className="nds-roi-kpi-lbl">{label}</div>
      <div className="nds-roi-kpi-sub">{unit}</div>
    </div>
  )
}
