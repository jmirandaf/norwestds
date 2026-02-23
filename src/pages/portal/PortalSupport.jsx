import { useEffect, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import { createTicket, fetchTickets } from '../../services/portalService'

const MOCK_TICKETS = [
  { id: 'T-1042', subject: 'Ajuste de timeline en proyecto A', priority: 'medium', status: 'open', createdAt: '2026-02-20' },
  { id: 'T-1037', subject: 'Solicitud de versión de planos', priority: 'high', status: 'in_progress', createdAt: '2026-02-18' },
]

export default function PortalSupport() {
  const { getToken } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ subject: '', priority: 'medium', message: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchTickets({ getToken })
        setTickets(data)
      } catch (e) {
        console.error(e)
        setError('No se pudieron cargar tickets. Mostrando datos de prueba.')
        setTickets(MOCK_TICKETS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const created = await createTicket({ payload: form, getToken })
      setTickets([created, ...tickets])
      setForm({ subject: '', priority: 'medium', message: '' })
      setMsg('Ticket creado correctamente.')
    } catch (e) {
      console.error(e)
      const next = {
        id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: form.subject,
        priority: form.priority,
        status: 'open',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setTickets([next, ...tickets])
      setForm({ subject: '', priority: 'medium', message: '' })
      setMsg('Ticket creado en modo local (mock).')
    }
  }

  return (
    <PortalLayout title='Soporte' subtitle='Crea tickets y da seguimiento a solicitudes.'>
      <div className='portal-project-grid'>
        <div className='portal-card'>
          <h3 style={{ marginTop: 0 }}>Nuevo ticket</h3>
          <form onSubmit={submit} className='portal-form'>
            <label className='portal-field'>
              <span>Asunto</span>
              <input className='dp-input' required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>

            <label className='portal-field'>
              <span>Prioridad</span>
              <select className='dp-input' value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value='low'>baja</option>
                <option value='medium'>media</option>
                <option value='high'>alta</option>
              </select>
            </label>

            <label className='portal-field'>
              <span>Mensaje</span>
              <textarea className='dp-input' rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>

            <button className='btn-primary' type='submit'>Crear ticket</button>
          </form>
          {msg && <p style={{ color: 'green' }}>{msg}</p>}
          {error && <p className='portal-error'>{error}</p>}
        </div>

        <div className='portal-card'>
          <h3 style={{ marginTop: 0 }}>Mis tickets</h3>
          {loading && <p>Cargando tickets...</p>}
          {!loading && (
            <div className='portal-stack'>
              {tickets.map((t) => (
                <div key={t.id} className='portal-card'>
                  <strong>{t.id} · {t.subject}</strong>
                  <div>Prioridad: {t.priority}</div>
                  <div>Estatus: {t.status}</div>
                  <div>Fecha: {String(t.createdAt || '').slice(0, 10)}</div>
                </div>
              ))}
              {tickets.length === 0 && <p>Aún no hay tickets.</p>}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
