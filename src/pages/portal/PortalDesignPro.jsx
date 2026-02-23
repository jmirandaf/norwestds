import { useEffect, useMemo, useState } from 'react'
import {
  createDesignProJob,
  fetchDesignProCatalogs,
  getDesignProJob,
  getDesignProJobResult,
  listDesignProJobs,
} from '../../services/designProService'

const STRUCTURES = [
  { id: 'rack-selectivo', name: 'Rack selectivo' },
  { id: 'rack-drivein', name: 'Rack drive-in' },
  { id: 'mezzanine', name: 'Mezzanine' },
  { id: 'conveyor-line', name: 'Conveyor line' },
]

const STEPS = ['Tipo', 'Dimensiones', 'Opciones', 'Resumen', 'Generar']

export default function PortalDesignPro() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [jobs, setJobs] = useState([])
  const [currentJobId, setCurrentJobId] = useState(null)
  const [catalogs, setCatalogs] = useState(null)

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
    const load = async () => {
      try {
        const [cats, rows] = await Promise.all([
          fetchDesignProCatalogs(),
          listDesignProJobs({ limit: 20 }),
        ])
        setCatalogs(cats)
        setJobs(rows)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!currentJobId) return

    const timer = setInterval(async () => {
      try {
        const job = await getDesignProJob(currentJobId)
        setResult(job)
        setJobs((prev) => {
          const rest = prev.filter((j) => j.id !== job.id)
          return [job, ...rest]
        })

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

  const payload = useMemo(() => ({
    type: 'structure_generate',
    priority: 'normal',
    requesterId: 'portal_user_demo',
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
  }), [form])

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const job = await createDesignProJob(payload)
      setCurrentJobId(job.id)
      setResult(job)
      setJobs((prev) => [job, ...prev.filter((j) => j.id !== job.id)])
      setStep(4)
    } catch (err) {
      console.error(err)
      setResult({ ok: false, error: err?.response?.data || err?.message })
      setLoading(false)
    }
  }

  const refreshResult = async () => {
    if (!currentJobId) return
    try {
      const data = await getDesignProJobResult(currentJobId)
      setResult((prev) => ({ ...prev, resultData: data }))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='portal-shell'>
      <div className='portal-header'>
        <h1>Design Pro by NDS</h1>
        <p>Backend de jobs activo (stub). Flujo listo para conectar worker real.</p>
      </div>

      <div className='dp-grid'>
        <aside className='portal-card'>
          <h3>Pasos</h3>
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`dp-step-btn ${i === step ? 'active' : ''}`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </aside>

        <section className='portal-card'>
          {step === 0 && (
            <section>
              <h3>Tipo de estructura</h3>
              <div className='dp-structure-grid'>
                {STRUCTURES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onChange('structureType', s.id)}
                    className={`dp-structure-btn ${form.structureType === s.id ? 'active' : ''}`}
                  >
                    <strong>{s.name}</strong>
                    <div className='dp-id'>{s.id}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h3>Dimensiones</h3>
              <Field label='Largo (mm)' value={form.length} onChange={(v) => onChange('length', v)} type='number' />
              <Field label='Ancho (mm)' value={form.width} onChange={(v) => onChange('width', v)} type='number' />
              <Field label='Alto (mm)' value={form.height} onChange={(v) => onChange('height', v)} type='number' />
            </section>
          )}

          {step === 2 && (
            <section>
              <h3>Opciones</h3>
              <Select label='Proveedor' value={form.provider} onChange={(v) => onChange('provider', v)} options={['tjsd', 'modular', 'item']} />
              <Select label='Serie perfil' value={form.profileSeries} onChange={(v) => onChange('profileSeries', v)} options={['30', '40', '45']} />
              <Select label='Clase de carga' value={form.loadClass} onChange={(v) => onChange('loadClass', v)} options={['light', 'medium', 'heavy']} />
              <Select label='Panel' value={form.panelType} onChange={(v) => onChange('panelType', v)} options={['none', 'mesh', 'polycarbonate']} />
              <Select label='Puerta' value={form.doorType} onChange={(v) => onChange('doorType', v)} options={['none', 'hinged', 'sliding']} />
            </section>
          )}

          {step === 3 && (
            <section>
              <h3>Resumen de configuración</h3>
              <pre className='dp-pre'>{JSON.stringify(payload, null, 2)}</pre>
            </section>
          )}

          {step === 4 && (
            <section>
              <h3>Resultado</h3>
              {!result && <p>Presiona generar para crear un job.</p>}
              {result?.id && (
                <div className='portal-stack'>
                  <div><strong>Job ID:</strong> {result.id}</div>
                  <div><strong>Estatus:</strong> {result.status}</div>
                  <div><strong>Creado:</strong> {String(result.createdAt || '').slice(0, 19).replace('T', ' ')}</div>
                  {result.status === 'done' && (
                    <button className='btn-ghost' onClick={refreshResult}>Ver payload de resultado</button>
                  )}
                  {result.resultData && <pre className='dp-pre'>{JSON.stringify(result.resultData, null, 2)}</pre>}
                </div>
              )}
              {result && !result.id && (
                <pre className='dp-pre'>{JSON.stringify(result, null, 2)}</pre>
              )}
            </section>
          )}

          <div className='dp-actions'>
            <button className='btn-ghost' onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Atrás</button>
            <button className='btn-ghost' onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={step === 4}>Siguiente</button>
            <button className='btn-primary' onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generando...' : 'Generar Job'}
            </button>
          </div>
        </section>

        <aside className='portal-card'>
          <h3>Jobs recientes</h3>
          {!jobs.length && <p>Sin jobs aún.</p>}
          <div className='portal-stack'>
            {jobs.slice(0, 8).map((j) => (
              <button key={j.id} className='portal-link-button' onClick={() => { setCurrentJobId(j.id); setResult(j); setStep(4) }}>
                {j.id} · {j.status}
              </button>
            ))}
          </div>

          <hr style={{ margin: '12px 0' }} />
          <h4>Catálogos</h4>
          <pre className='dp-pre' style={{ maxHeight: 180, overflow: 'auto' }}>
            {JSON.stringify(catalogs || {}, null, 2)}
          </pre>

          <div className='dp-summary'>
            <div><strong>Tipo:</strong> {form.structureType}</div>
            <div><strong>Proveedor:</strong> {form.provider}</div>
            <div><strong>Perfil:</strong> {form.profileSeries}</div>
            <div><strong>Dims:</strong> {form.length} x {form.width} x {form.height} mm</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className='dp-field'>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className='dp-input' />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className='dp-field'>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className='dp-input'>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
