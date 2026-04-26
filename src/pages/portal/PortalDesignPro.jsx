import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'
import '../../styles/tools.css'
import {
  createDesignProJob,
  getDesignProJob,
  listDesignProJobs,
} from '../../services/designProService'

// ─── Estructura definitions ────────────────────────────────────────
const STRUCTURE_DEFS = [
  {
    id: 'rack-selectivo',
    name: 'Rack Selectivo',
    desc: 'Acceso directo a cada pallet',
    params: ['provider', 'profileSeries', 'loadClass', 'panelType', 'doorType'],
    icon: <><rect x="2" y="4" width="20" height="3" rx="1"/><rect x="2" y="10" width="20" height="3" rx="1"/><rect x="2" y="16" width="20" height="3" rx="1"/><line x1="7" y1="4" x2="7" y2="21" strokeWidth="1"/><line x1="17" y1="4" x2="17" y2="21" strokeWidth="1"/></>,
  },
  {
    id: 'rack-drivein',
    name: 'Rack Drive-In',
    desc: 'Máxima densidad de almacenamiento',
    params: ['provider', 'profileSeries', 'loadClass', 'levels'],
    icon: <><rect x="2" y="2" width="20" height="20" rx="1" strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="22" strokeWidth="1"/><line x1="16" y1="2" x2="16" y2="22" strokeWidth="1"/><line x1="2" y1="8" x2="22" y2="8" strokeWidth="1"/><line x1="2" y1="14" x2="22" y2="14" strokeWidth="1"/></>,
  },
  {
    id: 'mezzanine',
    name: 'Mezzanine',
    desc: 'Plataforma elevada de trabajo',
    params: ['provider', 'profileSeries', 'loadClass', 'floorType', 'handrailType', 'stairType', 'panelType'],
    icon: <><rect x="2" y="13" width="20" height="3" rx="1"/><path d="M6 13V5M18 13V5"/><path d="M2 16v5M22 16v5"/><line x1="6" y1="8" x2="18" y2="8" strokeDasharray="3 2"/></>,
  },
  {
    id: 'conveyor-line',
    name: 'Línea Conveyor',
    desc: 'Transporte automatizado de material',
    params: ['conveyorType', 'beltMaterial', 'driveType', 'loadClass'],
    icon: <><rect x="2" y="9" width="20" height="5" rx="1"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><line x1="5" y1="15.5" x2="5" y2="18"/><line x1="19" y1="15.5" x2="19" y2="18"/></>,
  },
  {
    id: 'mesa-trabajo',
    name: 'Mesa de Trabajo',
    desc: 'Superficie de trabajo industrial',
    params: ['provider', 'profileSeries', 'loadClass', 'tableTop', 'adjustable'],
    icon: <><rect x="2" y="8" width="20" height="3" rx="1"/><path d="M5 11v9M19 11v9"/><line x1="5" y1="17" x2="9" y2="17"/><line x1="19" y1="17" x2="15" y2="17"/></>,
  },
  {
    id: 'celda-robotica',
    name: 'Celda Robótica',
    desc: 'Enclosure para celda de robot industrial',
    params: ['provider', 'profileSeries', 'panelType', 'doorType', 'robotClearance'],
    icon: <><rect x="2" y="2" width="20" height="20" rx="2" strokeWidth="1.5"/><circle cx="12" cy="14" r="3"/><path d="M12 11V7M10 7h4"/><path d="M9.5 16.5L7 19M14.5 16.5L17 19"/></>,
  },
  {
    id: 'guardas-seguridad',
    name: 'Guardas de Seguridad',
    desc: 'Cercado perimetral de seguridad',
    params: ['provider', 'profileSeries', 'panelType', 'doorType', 'plLevel'],
    icon: <><path d="M12 2l8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3z" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" strokeWidth="2"/></>,
  },
  {
    id: 'armario-electrico',
    name: 'Armario Eléctrico',
    desc: 'Gabinete de control y potencia',
    params: ['cabinetType', 'ipRating', 'mountingPlate', 'cooling'],
    icon: <><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="1.5"/><rect x="7" y="5" width="4" height="5" rx="1" strokeWidth="1"/><rect x="13" y="5" width="4" height="5" rx="1" strokeWidth="1"/><line x1="7" y1="14" x2="17" y2="14"/><line x1="7" y1="17" x2="13" y2="17"/></>,
  },
  {
    id: 'estructura-soporte',
    name: 'Estructura de Soporte',
    desc: 'Marco de soporte para equipos',
    params: ['provider', 'profileSeries', 'loadClass', 'mountingType'],
    icon: <><path d="M4 20V8l8-6 8 6v12"/><path d="M9 20v-6h6v6"/><line x1="4" y1="13" x2="20" y2="13" strokeWidth="1"/></>,
  },
  {
    id: 'plataforma-elevacion',
    name: 'Plataforma de Elevación',
    desc: 'Plataforma elevada de acceso',
    params: ['provider', 'profileSeries', 'loadClass', 'handrailType', 'stairType'],
    icon: <><rect x="2" y="10" width="20" height="3" rx="1"/><path d="M2 10L8 4M22 10l-6-6"/><path d="M5 13v7M19 13v7"/><path d="M5 17h14" strokeWidth="1"/></>,
  },
]

// ─── Param definitions ─────────────────────────────────────────────
const PARAM_DEFS = {
  provider:       { label: 'Proveedor',          hint: 'Sistema de perfiles',          options: { advanced: 'Advanced', modular: 'Modular', item: 'Item' },                                               default: 'advanced' },
  profileSeries:  { label: 'Serie de perfil',    hint: 'Sección transversal',          options: { '30': 'Serie 30 (30×30 mm)', '40': 'Serie 40 (40×40 mm)', '45': 'Serie 45 (45×45 mm)' },                      default: '40' },
  loadClass:      { label: 'Clase de carga',     hint: 'Capacidad estructural',        options: { light: 'Ligera (< 50 kg)', medium: 'Media (50–150 kg)', heavy: 'Pesada (> 150 kg)' },                          default: 'medium' },
  panelType:      { label: 'Panel lateral',      hint: 'Tipo de cerramiento',          options: { none: 'Sin panel', mesh: 'Malla metálica', polycarbonate: 'Policarbonato', solid: 'Chapa sólida' },            default: 'none' },
  doorType:       { label: 'Puerta de acceso',   hint: 'Tipo de acceso',               options: { none: 'Sin puerta', hinged: 'Bisagra', sliding: 'Corredera', swinging: 'Vaivén' },                             default: 'none' },
  levels:         { label: 'Niveles',            hint: 'Número de niveles de almacenamiento', options: { '2': '2 niveles', '3': '3 niveles', '4': '4 niveles', '5': '5 niveles' },                               default: '3' },
  floorType:      { label: 'Piso',               hint: 'Material de superficie de piso',      options: { grating: 'Rejilla metálica', chequerplate: 'Antideslizante', plywood: 'Madera contrachapada' },         default: 'grating' },
  handrailType:   { label: 'Barandal',           hint: 'Tipo de protección lateral',   options: { none: 'Sin barandal', single: 'Simple', double: 'Doble' },                                                     default: 'single' },
  stairType:      { label: 'Escalera',           hint: 'Tipo de escalera de acceso',   options: { none: 'Sin escalera', straight: 'Recta', alternating: 'Alternante' },                                          default: 'straight' },
  conveyorType:   { label: 'Tipo de conveyor',   hint: 'Sistema de transporte',        options: { belt: 'Banda', roller: 'Rodillos', chain: 'Cadena', slat: 'Tablillas' },                                        default: 'belt' },
  beltMaterial:   { label: 'Material de banda',  hint: 'Superficie de transporte',     options: { pvc: 'PVC', rubber: 'Hule', modular: 'Modular plástico', stainless: 'Acero inoxidable' },                      default: 'pvc' },
  driveType:      { label: 'Accionamiento',      hint: 'Sistema de motor y transmisión', options: { gearmotor: 'Motorreductor', vfd: 'Variador + motor', servo: 'Servomotor' },                                  default: 'gearmotor' },
  tableTop:       { label: 'Superficie',         hint: 'Material de la superficie de trabajo', options: { steel: 'Acero inoxidable', esd: 'Anti-estático (ESD)', wood: 'MDF', granite: 'Granito' },              default: 'steel' },
  adjustable:     { label: 'Altura',             hint: 'Mecanismo de ajuste de altura', options: { fixed: 'Fija', manual: 'Ajuste manual', electric: 'Eléctrico' },                                              default: 'fixed' },
  robotClearance: { label: 'Holgura de robot',   hint: 'Espacio libre sobre el robot', options: { '300': '300 mm (compacto)', '500': '500 mm (estándar)', '800': '800 mm (amplio)' },                            default: '500' },
  plLevel:        { label: 'Nivel PL requerido', hint: 'Seguridad ISO 13849',          options: { c: 'PL c', d: 'PL d', e: 'PL e' },                                                                             default: 'd' },
  cabinetType:    { label: 'Tipo de armario',    hint: 'Configuración del gabinete',   options: { floor: 'Piso (freestanding)', wall: 'Pared', desktop: 'Sobremesa' },                                           default: 'floor' },
  ipRating:       { label: 'Grado IP',           hint: 'Protección polvo / agua',      options: { ip54: 'IP54', ip65: 'IP65', ip66: 'IP66', ip67: 'IP67' },                                                      default: 'ip65' },
  mountingPlate:  { label: 'Placa de montaje',   hint: 'Configuración interna',        options: { single: 'Simple', double: 'Doble', din: 'Rieles DIN' },                                                        default: 'single' },
  cooling:        { label: 'Climatización',      hint: 'Control de temperatura',       options: { none: 'Sin climatización', fan: 'Ventilador', ac: 'Aire acondicionado', heatExchanger: 'Intercambiador' },     default: 'fan' },
  mountingType:   { label: 'Anclaje',            hint: 'Método de fijación',           options: { floor: 'Piso', wall: 'Pared', ceiling: 'Techo', freestanding: 'Independiente' },                               default: 'floor' },
}

const STATUS_LABELS = { queued: 'En cola', processing: 'Procesando', done: 'Completado', failed: 'Error' }

const STEPS = ['Tipo de estructura', 'Dimensiones', 'Opciones', 'Resumen', 'Resultado']

const ARTIFACT_ICONS = {
  bom:    <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>,
  step:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  pdf:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  render: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
}

function getDefaultOptions(structureId) {
  const struct = STRUCTURE_DEFS.find(s => s.id === structureId)
  const opts = {}
  for (const p of struct?.params || []) {
    opts[p] = PARAM_DEFS[p]?.default ?? ''
  }
  return opts
}

export default function PortalDesignPro() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]           = useState(0)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [result, setResult]       = useState(null)
  const [jobs, setJobs]           = useState([])
  const [currentJobId, setCurrentJobId] = useState(null)
  const [structureType, setStructureType] = useState('rack-selectivo')
  const [dimensions, setDimensions] = useState({ length: 1200, width: 800, height: 900 })
  const [options, setOptions]     = useState(getDefaultOptions('rack-selectivo'))
  const [quoteModal, setQuoteModal] = useState(false)

  useEffect(() => {
    listDesignProJobs({ limit: 20 }).then(setJobs).catch(() => {})
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
        setError('Error al obtener el estado del job. Verifica que el servicio esté activo.')
      }
    }, 1200)
    return () => clearInterval(timer)
  }, [currentJobId])

  const onStructureChange = (id) => {
    setStructureType(id)
    setOptions(getDefaultOptions(id))
    setStep(1)
  }

  const onDim = (k, v) => setDimensions(p => ({ ...p, [k]: Number(v) || 0 }))
  const onOpt = (k, v) => setOptions(p => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const job = await createDesignProJob({
        type: 'structure_generate',
        priority: 'normal',
        requesterId: currentUser?.uid || 'portal_user',
        source: 'portal',
        projectName: `${STRUCTURE_DEFS.find(s => s.id === structureType)?.name} ${new Date().toISOString().slice(0, 10)}`,
        params: { structureType, dimensions, options },
      })
      setCurrentJobId(job.id)
      setResult(job)
      setJobs(prev => [job, ...prev.filter(j => j.id !== job.id)])
      setStep(4)
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError('No se pudo conectar con el servicio DesignPro. Verifica que el worker esté activo.')
    }
  }

  const activeStruct = STRUCTURE_DEFS.find(s => s.id === structureType)
  const activeParams = activeStruct?.params || []

  return (
    <>
    <PortalLayout
      title="DesignPro by NDS"
      subtitle="Genera especificaciones técnicas y renders 3D para estructuras industriales"
    >
      {error && (
        <div className="nds-dp-error-banner">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
          <button className="nds-dp-error-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

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

          {/* Step 0 — Tipo */}
          {step === 0 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">¿Qué tipo de estructura necesitas?</h2>
                <p className="nds-dp-panel-sub">Selecciona el tipo — los parámetros se adaptan automáticamente</p>
              </div>
              <div className="nds-dp-struct-grid nds-dp-struct-grid--5col">
                {STRUCTURE_DEFS.map(s => (
                  <button
                    key={s.id}
                    className={`nds-dp-struct-btn${structureType === s.id ? ' active' : ''}`}
                    onClick={() => onStructureChange(s.id)}
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

          {/* Step 1 — Dimensiones */}
          {step === 1 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Dimensiones — {activeStruct?.name}</h2>
                <p className="nds-dp-panel-sub">Dimensiones externas en milímetros</p>
              </div>
              <div className="nds-dp-dim-grid">
                <DimField label="Largo" hint="Dimensión frontal" value={dimensions.length} onChange={v => onDim('length', v)} />
                <DimField label="Ancho" hint="Profundidad / lateral" value={dimensions.width} onChange={v => onDim('width', v)} />
                <DimField label="Alto" hint="Dimensión vertical total" value={dimensions.height} onChange={v => onDim('height', v)} />
              </div>
            </>
          )}

          {/* Step 2 — Opciones (parametros dependientes del tipo) */}
          {step === 2 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Especificaciones — {activeStruct?.name}</h2>
                <p className="nds-dp-panel-sub">{activeParams.length} parámetros para este tipo de estructura</p>
              </div>
              <div className="nds-dp-opts-grid">
                {activeParams.map(paramId => {
                  const def = PARAM_DEFS[paramId]
                  if (!def) return null
                  return (
                    <SelectField
                      key={paramId}
                      label={def.label}
                      hint={def.hint}
                      value={options[paramId] ?? def.default}
                      onChange={v => onOpt(paramId, v)}
                      options={def.options}
                    />
                  )
                })}
              </div>
            </>
          )}

          {/* Step 3 — Resumen */}
          {step === 3 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Resumen de configuración</h2>
                <p className="nds-dp-panel-sub">Revisa los parámetros antes de enviar al worker</p>
              </div>
              <div className="nds-dp-summary-grid">
                <SummaryRow label="Tipo de estructura" value={activeStruct?.name} />
                <SummaryRow label="Dimensiones" value={`${dimensions.length} × ${dimensions.width} × ${dimensions.height} mm`} />
                {activeParams.map(paramId => {
                  const def = PARAM_DEFS[paramId]
                  if (!def) return null
                  const val = options[paramId]
                  return <SummaryRow key={paramId} label={def.label} value={def.options[val] ?? val} />
                })}
              </div>
            </>
          )}

          {/* Step 4 — Resultado */}
          {step === 4 && (
            <>
              <div className="nds-dp-panel-header">
                <h2 className="nds-dp-panel-title">Resultado</h2>
              </div>

              {loading && (
                <div className="nds-dp-loading">
                  <div className="nds-dp-spinner" />
                  <p>Worker procesando — FreeCAD generando modelo…</p>
                  <div className="nds-dp-progress-bar"><div className="nds-dp-progress-fill" /></div>
                  <span className="nds-dp-loading-hint">El worker en la VM está procesando la solicitud</span>
                </div>
              )}

              {!loading && result?.status === 'done' && (() => {
                const res = result.params?.result || {}
                const dims = result.params?.dimensions || {}
                return (
                  <>
                    <div className="nds-dp-result-kpis">
                      <ResultKpi label="Dimensiones" value={`${dims.length}×${dims.width}×${dims.height}`} unit="mm" />
                      <ResultKpi label="Peso estimado" value={res.weightKg != null ? res.weightKg.toFixed(1) : '—'} unit="kg" accent />
                      <ResultKpi label="Perfiles requeridos" value={res.profileCount ?? '—'} unit="piezas" />
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
                            title={a.url ? 'Descargar archivo' : 'Disponible cuando el worker complete el render'}
                            onClick={() => a.url && window.open(`${import.meta.env.VITE_DESIGNPRO_API_BASE}${a.url}`)}
                          >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            {a.url ? 'Descargar' : 'Pendiente'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="nds-btn nds-btn-primary" onClick={() => setQuoteModal(true)}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                          <path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4"/>
                          <rect x="9" y="3" width="6" height="11" rx="1"/>
                          <path d="M9 14l3 3 3-3"/>
                        </svg>
                        Solicitar cotización
                      </button>
                    </div>
                  </>
                )
              })()}

              {!loading && result?.status === 'failed' && (
                <div className="nds-dp-error">
                  <p>{result.error || 'El worker reportó un error al procesar el job.'}</p>
                  <button className="nds-btn nds-btn-ghost" onClick={() => setStep(3)}>← Intentar de nuevo</button>
                </div>
              )}

              {!loading && result?.status === 'processing' && (
                <div className="nds-dp-loading">
                  <div className="nds-dp-spinner" />
                  <p>El worker está procesando este job…</p>
                </div>
              )}

              {!loading && result?.status === 'queued' && (
                <div className="nds-dp-loading">
                  <div className="nds-dp-spinner" style={{ borderTopColor: '#f59e0b' }} />
                  <p>Job en cola — esperando worker disponible</p>
                </div>
              )}

              {!loading && !result && (
                <p className="nds-dp-empty">Presiona "Enviar al worker" para iniciar la generación.</p>
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
                {loading ? 'Enviando…' : 'Enviar al worker →'}
              </button>
            )}
          </div>
        </section>

        {/* ── Right panel ── */}
        <aside className="nds-dp-side">
          <div className="nds-dp-side-summary">
            <div className="nds-dp-side-title">Configuración actual</div>
            <div className="nds-dp-side-row"><span>Tipo</span><strong>{activeStruct?.name}</strong></div>
            <div className="nds-dp-side-row"><span>Dims</span><strong>{dimensions.length}×{dimensions.width}×{dimensions.height} mm</strong></div>
            {activeParams.slice(0, 3).map(paramId => {
              const def = PARAM_DEFS[paramId]
              if (!def) return null
              return (
                <div key={paramId} className="nds-dp-side-row">
                  <span>{def.label}</span>
                  <strong>{def.options[options[paramId]] ?? options[paramId]}</strong>
                </div>
              )
            })}
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
                  <span className={`nds-dp-badge nds-dp-badge--${j.status}`}>{STATUS_LABELS[j.status] || j.status}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

      </div>
    </PortalLayout>

    {quoteModal && result?.status === 'done' && (
      <QuoteModal
        jobId={result.id}
        jobResult={result.params?.result || {}}
        onClose={() => setQuoteModal(false)}
        onSuccess={() => { setQuoteModal(false); navigate('/portal/cotizaciones') }}
      />
    )}
    </>
  )
}

// ─── QuoteModal ────────────────────────────────────────────────────

function QuoteModal({ jobId, jobResult, onClose, onSuccess }) {
  const { getToken } = useAuth()
  const [materials, setMaterials]     = useState([])
  const [selected, setSelected]       = useState({})   // { [materialId]: qty }
  const [notes, setNotes]             = useState('')
  const [generating, setGenerating]   = useState(false)
  const [loadingMats, setLoadingMats] = useState(true)
  const [err, setErr]                 = useState('')

  useEffect(() => {
    fetch(`${API}/api/materials`)
      .then(r => r.json())
      .then(d => setMaterials(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingMats(false))
  }, [])

  function toggleMaterial(id) {
    setSelected(s => {
      if (s[id] != null) { const n = { ...s }; delete n[id]; return n }
      return { ...s, [id]: 1 }
    })
  }
  function setQty(id, val) {
    setSelected(s => ({ ...s, [id]: Math.max(1, Number(val) || 1) }))
  }

  async function generate() {
    setGenerating(true); setErr('')
    try {
      const token = await getToken()
      const extraMaterials = Object.entries(selected).map(([id, qty]) => ({ id, qty }))
      const r = await fetch(`${API}/api/quotes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ jobId, extraMaterials, notes }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`)
      onSuccess()
    } catch (e) {
      setErr(e.message || 'Error al generar cotización')
    } finally { setGenerating(false) }
  }

  const byCategory = materials.reduce((acc, m) => {
    ;(acc[m.category] = acc[m.category] || []).push(m)
    return acc
  }, {})

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="portal-card" style={{ width: 520, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 4, color: 'var(--nds-teal-deep)' }}>Solicitar cotización</h3>
        <p style={{ color: 'var(--nds-muted)', fontSize: '0.85rem', marginBottom: 18 }}>
          Se generará una cotización preliminar con los costos estimados de la estructura.
        </p>

        {/* Resumen del job */}
        <div style={{ background: 'var(--nds-bg)', borderRadius: 8, padding: '12px 14px', marginBottom: 18,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--nds-muted)', fontSize: '0.75rem', marginBottom: 2 }}>Perfiles totales</div>
            <div style={{ fontWeight: 700 }}>{jobResult.totalMeters?.toFixed(1) ?? '—'} m</div>
          </div>
          <div>
            <div style={{ color: 'var(--nds-muted)', fontSize: '0.75rem', marginBottom: 2 }}>Piezas</div>
            <div style={{ fontWeight: 700 }}>{jobResult.profileCount ?? '—'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--nds-muted)', fontSize: '0.75rem', marginBottom: 2 }}>Proveedor / Serie</div>
            <div style={{ fontWeight: 700 }}>{jobResult.provider ?? '—'} / {jobResult.series ?? '—'}</div>
          </div>
        </div>

        {/* Materiales adicionales */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 10 }}>
            Materiales adicionales <span style={{ fontWeight: 400, color: 'var(--nds-muted)', fontSize: '0.82rem' }}>(opcional)</span>
          </div>
          {loadingMats && <p style={{ color: 'var(--nds-muted)', fontSize: '0.85rem' }}>Cargando…</p>}
          {!loadingMats && materials.length === 0 && (
            <p style={{ color: 'var(--nds-muted)', fontSize: '0.85rem' }}>No hay materiales adicionales configurados.</p>
          )}
          {Object.entries(byCategory).map(([cat, mats]) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--nds-muted)', fontWeight: 600, marginBottom: 6 }}>
                {cat}
              </div>
              {mats.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <input type="checkbox" id={`mat-${m.id}`}
                    checked={selected[m.id] != null}
                    onChange={() => toggleMaterial(m.id)} />
                  <label htmlFor={`mat-${m.id}`} style={{ flex: 1, fontSize: '0.85rem', cursor: 'pointer' }}>
                    {m.name}
                    <span style={{ color: 'var(--nds-muted)', marginLeft: 6 }}>${m.priceMxn.toLocaleString('es-MX', { minimumFractionDigits: 2 })} / {m.unit}</span>
                  </label>
                  {selected[m.id] != null && (
                    <input type="number" min="1" value={selected[m.id]}
                      onChange={e => setQty(m.id, e.target.value)}
                      style={{ width: 60, padding: '3px 6px', border: '1px solid var(--nds-border)', borderRadius: 6, fontSize: '0.85rem', textAlign: 'center' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Notas */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--nds-muted)', display: 'block', marginBottom: 4 }}>
            Notas adicionales
          </label>
          <textarea className="dp-input" rows={2} style={{ resize: 'vertical', fontSize: '0.85rem' }}
            placeholder="Requerimientos especiales, acabados, plazos…"
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {err && <p className="portal-error" style={{ marginBottom: 12 }}>{err}</p>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose} disabled={generating}>Cancelar</button>
          <button className="btn-primary" onClick={generate} disabled={generating}>
            {generating ? 'Generando…' : 'Generar cotización'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────
function DimField({ label, hint, value, onChange }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">{label}<span className="nds-tool-hint">{hint}</span></label>
      <div className="nds-tool-input-wrap">
        <input type="number" className="nds-tool-input" value={value} min={1} onChange={e => onChange(e.target.value)} />
        <span className="nds-tool-unit nds-tool-unit--post">mm</span>
      </div>
    </div>
  )
}

function SelectField({ label, hint, value, onChange, options }) {
  return (
    <div className="nds-tool-field">
      <label className="nds-tool-label">{label}<span className="nds-tool-hint">{hint}</span></label>
      <div className="nds-tool-input-wrap">
        <select className="nds-tool-input" value={value} onChange={e => onChange(e.target.value)}>
          {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
