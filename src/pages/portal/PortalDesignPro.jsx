import { useMemo, useState } from 'react'
import { generateDesignPro } from '../../services/designProService'

const STRUCTURES = [
  { id: 'workbench', name: 'Mesa de trabajo' },
  { id: 'mobile_cart', name: 'Carro móvil' },
  { id: 'industrial_rack', name: 'Rack industrial' },
  { id: 'machine_guarding', name: 'Guarda de máquina' },
  { id: 'machine_base', name: 'Base de máquina' },
]

const STEPS = ['Tipo', 'Dimensiones', 'Opciones', 'Resumen', 'Generar']

export default function PortalDesignPro() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    structureType: 'workbench',
    provider: 'tjsd',
    length: 1200,
    width: 800,
    height: 900,
    profileSeries: '40',
    loadClass: 'medium',
    panelType: 'none',
    doorType: 'none',
  })

  const payload = useMemo(() => ({
    project_name: `designpro_${Date.now()}`,
    provider: form.provider,
    structure_type: form.structureType,
    dimensions: {
      length: Number(form.length),
      width: Number(form.width),
      height: Number(form.height),
    },
    options: {
      provider: form.provider,
      profile_series: form.profileSeries,
      load_class: form.loadClass,
      panel_type: form.panelType,
      door_type: form.doorType,
    },
    render: { enabled: true, engine: 'blender' },
  }), [form])

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const apiResult = await generateDesignPro(payload)
      setResult(apiResult)
      setStep(4)
    } catch (err) {
      console.error(err)
      setResult({ ok: false, error: err?.response?.data || err?.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='portal-shell'>
      <div className='portal-header'>
        <h1>Design Pro by NDS</h1>
        <p>Configurador interactivo estilo librería técnica (MVP).</p>
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
              {!result && <p>Presiona generar para obtener artefactos.</p>}
              {result?.ok && (
                <div className='portal-stack'>
                  <div><strong>Request ID:</strong> {result.request_id}</div>
                  <div><strong>Estatus:</strong> Generado correctamente</div>
                  {result?.artifacts?.step_url ? (
                    <a href={result.artifacts.step_url} target='_blank' rel='noreferrer'>Descargar STEP</a>
                  ) : (
                    <span>STEP no disponible</span>
                  )}
                </div>
              )}
              {result && !result.ok && (
                <pre className='dp-pre'>{JSON.stringify(result, null, 2)}</pre>
              )}
            </section>
          )}

          <div className='dp-actions'>
            <button className='btn-ghost' onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Atrás</button>
            <button className='btn-ghost' onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={step === 4}>Siguiente</button>
            <button className='btn-primary' onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generando...' : 'Generar'}
            </button>
          </div>
        </section>

        <aside className='portal-card'>
          <h3>Preview</h3>
          {result?.render?.url ? (
            <img src={result.render.url} alt='render' className='dp-preview-img' />
          ) : (
            <div className='dp-preview-empty'>Aquí aparecerá el render</div>
          )}

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
