import { useEffect, useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import { addTicketComment, createTicket, fetchTickets, updateTicketStatus } from '../../services/portalService'

const MOCK_TICKETS = [
  { id: 'T-1042', subject: 'Ajuste de timeline en proyecto A', priority: 'medium', status: 'open', createdAt: '2026-02-20', comments: [] },
  { id: 'T-1037', subject: 'Solicitud de versión de planos', priority: 'high', status: 'in_progress', createdAt: '2026-02-18', comments: [] },
]

export default function PortalSupport() {
  const { getToken, userData } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ subject: '', priority: 'medium', message: '' })
  const [comment, setComment] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [msg, setMsg] = useState('')

  const canManageStatus = userData?.role === 'admin' || userData?.role === 'pm'

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

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedId) || tickets[0] || null,
    [tickets, selectedId]
  )

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const created = await createTicket({ payload: form, getToken })
      setTickets([created, ...tickets])
      setSelectedId(created.id)
      setForm({ subject: '', priority: 'medium', message: '' })
      setMsg('Ticket creado correctamente.')
    } catch (e) {
      console.error(e)
      const next = {
        id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: form.subject,
        priority: form.priority,
        status: 'open',
        message: form.message,
        createdAt: new Date().toISOString().slice(0, 10),
        comments: [],
      }
      setTickets([next, ...tickets])
      setSelectedId(next.id)
      setForm({ subject: '', priority: 'medium', message: '' })
      setMsg('Ticket creado en modo local (mock).')
    }
  }

  const onStatusChange = async (status) => {
    if (!selectedTicket) return
    try {
      const updated = await updateTicketStatus({ ticketId: selectedTicket.id, status, getToken })
      setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)))
    } catch (e) {
      console.error(e)
      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? { ...t, status } : t)))
    }
  }

  const onAddComment = async () => {
    if (!selectedTicket || !comment.trim()) return
    try {
      const updated = await addTicketComment({ ticketId: selectedTicket.id, body: comment.trim(), getToken })
      setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)))
      setComment('')
    } catch (e) {
      console.error(e)
      const localComment = {
        id: `c-${Date.now()}`,
        body: comment.trim(),
        author: userData?.displayName || 'Usuario',
        createdAt: new Date().toISOString(),
      }
      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? { ...t, comments: [...(t.comments || []), localComment] } : t)))
      setComment('')
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
          <h3 style={{ marginTop: 0 }}>Tickets</h3>
          {loading && <p>Cargando tickets...</p>}
          {!loading && (
            <div className='portal-project-grid'>
              <div className='portal-stack'>
                {tickets.map((t) => (
                  <button key={t.id} className={`portal-card portal-project-item ${selectedTicket?.id === t.id ? 'active' : ''}`} onClick={() => setSelectedId(t.id)}>
                    <strong>{t.id} · {t.subject}</strong>
                    <div>Prioridad: {t.priority}</div>
                    <div>Estatus: {t.status}</div>
                    <div>Fecha: {String(t.createdAt || '').slice(0, 10)}</div>
                  </button>
                ))}
                {tickets.length === 0 && <p>Aún no hay tickets.</p>}
              </div>

              <div className='portal-card'>
                {!selectedTicket && <p>Selecciona un ticket.</p>}
                {selectedTicket && (
                  <>
                    <h4 style={{ marginTop: 0 }}>{selectedTicket.id} · {selectedTicket.subject}</h4>
                    <div><strong>Prioridad:</strong> {selectedTicket.priority}</div>
                    <div><strong>Estatus:</strong> {selectedTicket.status}</div>
                    <div><strong>Mensaje:</strong> {selectedTicket.message || 'N/D'}</div>

                    {canManageStatus && (
                      <label className='portal-field' style={{ marginTop: 10 }}>
                        <span>Cambiar estatus</span>
                        <select className='dp-input' value={selectedTicket.status} onChange={(e) => onStatusChange(e.target.value)}>
                          <option value='open'>open</option>
                          <option value='in_progress'>in_progress</option>
                          <option value='closed'>closed</option>
                        </select>
                      </label>
                    )}

                    <div className='portal-field' style={{ marginTop: 10 }}>
                      <span>Comentarios</span>
                      <div className='portal-stack'>
                        {(selectedTicket.comments || []).map((c) => (
                          <div key={c.id} className='portal-card'>
                            <div>{c.body}</div>
                            <small>{c.author || 'Usuario'} · {String(c.createdAt || '').slice(0, 16).replace('T', ' ')}</small>
                          </div>
                        ))}
                        {(selectedTicket.comments || []).length === 0 && <small>Sin comentarios aún.</small>}
                      </div>
                    </div>

                    <div className='portal-field' style={{ marginTop: 10 }}>
                      <textarea className='dp-input' rows={3} placeholder='Agregar comentario...' value={comment} onChange={(e) => setComment(e.target.value)} />
                      <button className='btn-ghost' onClick={onAddComment}>Agregar comentario</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
