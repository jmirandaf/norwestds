import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './contexts/AuthContext'
import './i18n'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkEnabled = Boolean(clerkPublishableKey)

if (!clerkEnabled) {
  console.warn('[Clerk] Missing VITE_CLERK_PUBLISHABLE_KEY in .env (auth disabled)')
}

const AppTree = (
  <BrowserRouter>
    <AuthProvider>
      <ScrollToTop />
      <App />
    </AuthProvider>
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {clerkEnabled ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        {AppTree}
      </ClerkProvider>
    ) : (
      AppTree
    )}
  </React.StrictMode>
)
