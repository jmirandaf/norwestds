import { createContext, useContext, useMemo } from 'react'
import {
  useAuth as useClerkAuth,
  useUser,
  useClerk,
} from '@clerk/clerk-react'

const AuthContext = createContext(null)
const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function ClerkBackedAuthProvider({ children }) {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()

  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      uid: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
    }
  }, [user])

  const userData = useMemo(() => {
    if (!user) return null
    return {
      email: user.primaryEmailAddress?.emailAddress || '',
      displayName: user.fullName || user.firstName || 'Usuario',
      role: user.publicMetadata?.role || 'client',
      active: true,
    }
  }, [user])

  const logout = () => signOut({ redirectUrl: '/login' })

  const value = {
    currentUser: isSignedIn ? currentUser : null,
    userData: isSignedIn ? userData : null,
    signup: async () => {
      throw new Error('Use Clerk SignUp flow from /register')
    },
    login: async () => {
      throw new Error('Use Clerk SignIn flow from /login')
    },
    logout,
    resetPassword: async () => {
      throw new Error('Password reset is handled by Clerk UI in /login')
    },
    getToken,
    loading: !authLoaded || !userLoaded,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function NoopAuthProvider({ children }) {
  const value = {
    currentUser: null,
    userData: null,
    signup: async () => {
      throw new Error('Auth disabled: missing VITE_CLERK_PUBLISHABLE_KEY')
    },
    login: async () => {
      throw new Error('Auth disabled: missing VITE_CLERK_PUBLISHABLE_KEY')
    },
    logout: async () => {},
    resetPassword: async () => {
      throw new Error('Auth disabled: missing VITE_CLERK_PUBLISHABLE_KEY')
    },
    getToken: async () => null,
    loading: false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthProvider = ({ children }) => {
  return clerkEnabled ? (
    <ClerkBackedAuthProvider>{children}</ClerkBackedAuthProvider>
  ) : (
    <NoopAuthProvider>{children}</NoopAuthProvider>
  )
}
