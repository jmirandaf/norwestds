import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createInvite } from '../../services/portalService'
import { ROLES } from '../../config/portalStandards'
import PortalLayout from '../../components/PortalLayout'

export default function PortalInvites() {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ email: '', role: 'client', clientId: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMsg('')
      setErr('')

      const result = await createInvite({
        payload: {
          email: form.email.toLowerCase().trim(),
          role: form.role,
          clientId: form.clientId || null,
        },
        getToken,
      })

      setMsg(result?.message || 'Invitación creada correctamente.')
      setForm({ email: '', role: 'client', clientId: '' })
    } catch (e) {
      console.error(e)
      setErr('No se pudo crear la invitación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortalLayout title='Invitaciones' subtitle='Alta controlada de usuarios para portal NDS.'>
      <form onSubmit={handleSubmit} className='portal-form'>
        <label className='portal-field'>
          <span>Email</span>
          <input
            className='dp-input'
            type='email'
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className='portal-field'>
          <span>Rol</span>
          <select className='dp-input' value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label className='portal-field'>
          <span>clientId (opcional, recomendado para client)</span>
          <input className='dp-input' value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
        </label>

        <button className='btn-primary' type='submit' disabled={loading}>{loading ? 'Creando...' : 'Crear invitación'}</button>
      </form>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p className='portal-error'>{err}</p>}
    </PortalLayout>
  )
}
