import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function Login() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Navigate to='/dashboard' replace />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
      <SignIn
        path='/login'
        routing='path'
        signUpUrl='/register'
        fallbackRedirectUrl='/dashboard'
      />
    </div>
  )
}
