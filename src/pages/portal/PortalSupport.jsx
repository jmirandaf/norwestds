import { useState } from 'react'
import PortalLayout from '../../components/PortalLayout'

const MOCK_TICKETS = [
  { id: 'T-1042', subject: 'Ajuste de timeline en proyecto A', priority: 'media', status: 'abierto', createdAt: '2026-02-20' },
  { id: 'T-1037', subject: 'Solicitud de versión de planos', priority: 'alta', status: 'en progreso', createdAt: '2026-02-18' },
]

export default function PortalSupport() {
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [form, setForm] = useState({ subject: '', priority: 'media', message: '' })
  const [msg, setMsg] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const next = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: form.subject,
      priority: form.priority,
      status: 'abierto',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setTickets([next, ...tickets])
    setForm({ subject: '', priority: 'media', message: '' })
    setMsg('Ticket creado (modo mock).')
  }

  return (
    <PortalLayout title='Soporte' subtitle='Crea tickets y da seguimiento a solicitudes.'>
      <div className='portal-project-grid'>
        <div className='portal-card'>
          <h3 style={{ marginTop: 0 }}>Nuevo ticket</h3>
          <form onSubmit={submit} className='portal-form'>
            <label className='portal-field'>
              <span>Asunto</span>
              <input
                className='dp-input'
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>

            <label className='portal-field'>
              <span>Prioridad</span>
              <select
                className='dp-input'
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value='baja'>baja</option>
                <option value='media'>media</option>
                <option value='alta'>alta</option>
              </select>
            </label>

            <label className='portal-field'>
              <span>Mensaje</span>
              <textarea
                className='dp-input'
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>

            <button className='btn-primary' type='submit'>Crear ticket</button>
          </form>
          {msg && <p style={{ color: 'green' }}>{msg}</p>}
        </div>

        <div className='portal-card'>
          <h3 style={{ marginTop: 0 }}>Mis tickets</h3>
          <div className='portal-stack'>
            {tickets.map((t) => (
              <div key={t.id} className='portal-card'>
                <strong>{t.id} · {t.subject}</strong>
                <div>Prioridad: {t.priority}</div>
                <div>Estatus: {t.status}</div>
                <div>Fecha: {t.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
