import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Team = lazy(() => import('./pages/Team.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const TrainingCenter = lazy(() => import('./pages/TrainingCenter.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const PortalHome = lazy(() => import('./pages/portal/PortalHome.jsx'))
const PortalProjects = lazy(() => import('./pages/portal/PortalProjects.jsx'))
const PortalSchedule = lazy(() => import('./pages/portal/PortalSchedule.jsx'))
const PortalDesignPro = lazy(() => import('./pages/portal/PortalDesignPro.jsx'))
const PortalInvites = lazy(() => import('./pages/portal/PortalInvites.jsx'))

function RouteFallback() {
  return <div className="route-loading">Cargando…</div>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/training" element={<MainLayout><TrainingCenter /></MainLayout>} />

      {/* Auth */}
      <Route path="/login/*" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register/*" element={<Register />} />

      {/* Legacy dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Portal clientes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute allowedRoles={['admin', 'pm', 'client']}>
            <PortalHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/projects"
        element={
          <ProtectedRoute allowedRoles={['admin', 'pm', 'client']}>
            <PortalProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/schedule"
        element={
          <ProtectedRoute allowedRoles={['admin', 'pm', 'client']}>
            <PortalSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/designpro"
        element={
          <ProtectedRoute allowedRoles={['admin', 'pm', 'client']}>
            <PortalDesignPro />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/admin/invites"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PortalInvites />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
    </Suspense>
  )
}
