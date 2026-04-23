import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createInvite } from '../../services/portalService'
import { ROLES } from '../../config/portalStandards'
import PortalLayout from '../../components/PortalLayout'

export default function PortalInvites() {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ email: '', role: 'client', clientId: '' })
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setInviteLink('')
    try {
      const result = await createInvite({
        payload: { email: form.email.toLowerCase().trim(), role: form.role, clientId: form.clientId || null },
        getToken,
      })
      const link = `${window.location.origin}/invite/${result.token}`
      setInviteLink(link)
      setForm({ email: '', role: 'client', clientId: '' })
    } catch {
      setErr('No se pudo crear la invitación.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PortalLayout title="Invitaciones" subtitle="Alta controlada de usuarios al Portal NDS.">
      <form onSubmit={handleSubmit} className="portal-form">
        <label className="portal-field">
          <span>Email del invitado</span>
          <input className="dp-input" type="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} placeholder="usuario@empresa.com" />
        </label>

        <label className="portal-field">
          <span>Rol</span>
          <select className="dp-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label className="portal-field">
          <span>Client ID <span style={{ fontWeight: 400, color: 'var(--nds-muted)' }}>(opcional, para rol client)</span></span>
          <input className="dp-input" value={form.clientId}
            onChange={e => setForm({ ...form, clientId: e.target.value })} placeholder="cuid del cliente" />
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Crear invitación'}
        </button>
      </form>

      {err && <p className="portal-error" style={{ marginTop: 12 }}>{err}</p>}

      {inviteLink && (
        <div className="portal-card" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="16" height="16" fill="none" stroke="var(--nds-teal)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <span style={{ fontWeight: 600, color: 'var(--nds-teal-deep)', fontSize: '.9rem' }}>Invitación creada — expira en 72 horas</span>
          </div>
          <p style={{ fontSize: '.82rem', color: 'var(--nds-muted)', marginBottom: 10 }}>
            Comparte este enlace con el invitado:
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              readOnly
              value={inviteLink}
              className="dp-input"
              style={{ flex: 1, fontSize: '.82rem', color: 'var(--nds-muted)' }}
              onFocus={e => e.target.select()}
            />
            <button type="button" className="btn-ghost" onClick={handleCopy} style={{ flexShrink: 0 }}>
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
