import { Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Team from './pages/Team.jsx'
import Contact from './pages/Contact.jsx'
import TrainingCenter from './pages/TrainingCenter.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas con layout */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/training" element={<MainLayout><TrainingCenter /></MainLayout>} />
      
      {/* Rutas de autenticación sin layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  )
}