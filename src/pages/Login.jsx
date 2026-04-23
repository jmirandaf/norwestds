import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function LoginInner() {
  const { isSignedIn } = useAuth()
  if (isSignedIn) return <Navigate to='/dashboard' replace />
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
      <SignIn path='/login' routing='path' signUpUrl='/register' fallbackRedirectUrl='/dashboard' />
    </div>
  )
}

export default function Login() {
  if (!clerkEnabled) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--nds-muted)', fontFamily: 'Inter, sans-serif' }}>
          Autenticación no configurada — agrega <code>VITE_CLERK_PUBLISHABLE_KEY</code> en tu <code>.env</code>.
        </p>
      </div>
    )
  }
  return <LoginInner />
}
