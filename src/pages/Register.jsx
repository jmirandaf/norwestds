import { SignUp, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function Register() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Navigate to='/dashboard' replace />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
      <SignUp
        path='/register'
        routing='path'
        signInUrl='/login'
        fallbackRedirectUrl='/dashboard'
      />
    </div>
  )
}
