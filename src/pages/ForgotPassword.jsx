import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function ForgotPasswordInner() {
  const { isLoaded, signIn } = useSignIn()
  const [step, setStep] = useState('request') // 'request' | 'verify' | 'done'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRequest(e) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email })
      setStep('verify')
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Error al enviar el código')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      })
      if (result.status === 'complete') setStep('done')
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Código o contraseña inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nds-teal-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 'var(--nds-radius)', border: '1px solid var(--nds-border)', padding: '40px 36px', boxShadow: '0 8px 32px rgba(2,32,71,0.1)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.png" alt="NDS" style={{ height: 36, marginBottom: 8 }} onError={e => { e.target.style.display = 'none' }} />
          <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--nds-muted)' }}>Norwest Dynamic Systems</p>
        </div>

        {step === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <svg width="48" height="48" fill="none" stroke="var(--nds-teal)" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 8px' }}>Contraseña actualizada</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '.9rem', marginBottom: 24 }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <Link to="/login" className="ns-btn ns-btn-primary" style={{ display: 'block', textAlign: 'center' }}>Ir al login</Link>
          </div>
        ) : step === 'verify' ? (
          <>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 6px' }}>Revisa tu correo</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '.88rem', marginBottom: 24 }}>Enviamos un código de verificación a <strong>{email}</strong>.</p>
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="ns-contact-field">
                <label htmlFor="code">Código de verificación</label>
                <input id="code" className="nds-input" type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" required />
              </div>
              <div className="ns-contact-field">
                <label htmlFor="newpwd">Nueva contraseña</label>
                <input id="newpwd" className="nds-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} />
              </div>
              {error && <div className="ns-form-feedback ns-form-feedback--error">{error}</div>}
              <button type="submit" className="ns-btn ns-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Verificando…' : 'Cambiar contraseña'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--nds-dark-deep)', margin: '0 0 6px' }}>¿Olvidaste tu contraseña?</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '.88rem', marginBottom: 24 }}>Ingresa tu correo y te enviamos un código para restablecerla.</p>
            <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="ns-contact-field">
                <label htmlFor="email">Correo electrónico</label>
                <input id="email" className="nds-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              {error && <div className="ns-form-feedback ns-form-feedback--error">{error}</div>}
              <button type="submit" className="ns-btn ns-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar código'}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.85rem', color: 'var(--nds-muted)' }}>
          <Link to="/login" style={{ color: 'var(--nds-teal)', fontWeight: 600, textDecoration: 'none' }}>← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPassword() {
  if (!clerkEnabled) return <Navigate to="/login" replace />
  return <ForgotPasswordInner />
}
