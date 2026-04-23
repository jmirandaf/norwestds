import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { validateInviteToken, redeemInvite } from '../services/portalService'
import { useAuth } from '../contexts/AuthContext'

const ROLE_LABELS = { admin: 'Administrador', pm: 'Project Manager', client: 'Cliente' }

export default function AcceptInvite() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { currentUser, getToken } = useAuth()

  const [invite, setInvite] = useState(null)   // { email, role }
  const [status, setStatus] = useState('loading') // loading | valid | invalid | redeeming | done | error
  const [errorMsg, setErrorMsg] = useState('')

  // Validate token on mount
  useEffect(() => {
    validateInviteToken(token)
      .then(data => { setInvite(data); setStatus('valid') })
      .catch(err => {
        setErrorMsg(err.response?.data?.error || 'Invitación inválida o expirada')
        setStatus('invalid')
      })
  }, [token])

  async function handleRedeem() {
    setStatus('redeeming')
    try {
      await redeemInvite({ token, getToken })
      setStatus('done')
      setTimeout(() => navigate('/portal'), 2200)
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al aceptar la invitación')
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nds-teal-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 'var(--nds-radius)', border: '1px solid var(--nds-border)', padding: '40px 36px', boxShadow: '0 8px 32px rgba(2,32,71,0.1)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.png" alt="NDS" style={{ height: 36, marginBottom: 8 }} onError={e => { e.target.style.display = 'none' }} />
          <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--nds-muted)' }}>Norwest Dynamic Systems</p>
        </div>

        {status === 'loading' && (
          <p style={{ textAlign: 'center', color: 'var(--nds-muted)' }}>Validando invitación…</p>
        )}

        {status === 'invalid' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: 12 }}>
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 8px' }}>Invitación inválida</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '.9rem', marginBottom: 24 }}>{errorMsg}</p>
            <Link to="/" className="ns-btn ns-btn-primary" style={{ display: 'inline-block' }}>Volver al inicio</Link>
          </div>
        )}

        {(status === 'valid' || status === 'redeeming' || status === 'error') && invite && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--nds-teal-ink)', border: '1px solid #cbe6f5', borderRadius: 999, padding: '6px 14px', marginBottom: 16 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--nds-teal)', flexShrink: 0 }} />
                <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--nds-teal-deep)', letterSpacing: '.05em' }}>
                  {ROLE_LABELS[invite.role] || invite.role}
                </span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 6px' }}>Tienes una invitación</h2>
              <p style={{ color: 'var(--nds-muted)', fontSize: '.9rem', margin: 0 }}>
                Fuiste invitado como <strong>{ROLE_LABELS[invite.role]}</strong> al Portal NDS.
              </p>
            </div>

            {/* Email del invite */}
            <div style={{ background: 'var(--nds-teal-wash)', border: '1px solid var(--nds-border)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '.88rem', color: 'var(--nds-muted)' }}>
              <span style={{ fontWeight: 600, color: 'var(--nds-text)' }}>Correo: </span>{invite.email}
            </div>

            {!currentUser ? (
              /* Not logged in — send to register */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ color: 'var(--nds-muted)', fontSize: '.88rem', textAlign: 'center', margin: '0 0 4px' }}>
                  Crea tu cuenta con el correo de la invitación para continuar.
                </p>
                <Link
                  to={`/register?redirect=/invite/${token}`}
                  className="ns-btn ns-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Crear cuenta
                </Link>
                <Link
                  to={`/login?redirect=/invite/${token}`}
                  className="ns-btn ns-btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Ya tengo cuenta — Iniciar sesión
                </Link>
              </div>
            ) : currentUser.email?.toLowerCase() !== invite.email.toLowerCase() ? (
              /* Logged in with wrong account */
              <div className="ns-form-feedback ns-form-feedback--error" style={{ marginBottom: 12 }}>
                Estás conectado como <strong>{currentUser.email}</strong>, pero esta invitación es para <strong>{invite.email}</strong>. Por favor inicia sesión con la cuenta correcta.
              </div>
            ) : (
              /* Correct account — can redeem */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {status === 'error' && (
                  <div className="ns-form-feedback ns-form-feedback--error">{errorMsg}</div>
                )}
                <button
                  className="ns-btn ns-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleRedeem}
                  disabled={status === 'redeeming'}
                >
                  {status === 'redeeming' ? 'Aceptando…' : 'Aceptar invitación'}
                </button>
              </div>
            )}
          </>
        )}

        {status === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" fill="none" stroke="var(--nds-teal)" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 8px' }}>¡Invitación aceptada!</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '.9rem' }}>Redirigiendo al portal…</p>
          </div>
        )}
      </div>
    </div>
  )
}
