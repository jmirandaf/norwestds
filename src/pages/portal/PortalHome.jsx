import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProjects, fetchSchedules } from '../../services/portalService'
import PortalLayout from '../../components/PortalLayout'

export default function PortalHome() {
  const { currentUser, userData, getToken } = useAuth()
  const [projects, setProjects] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!currentUser || !userData) return
      setLoading(true)
      try {
        const [projectsData, schedulesData] = await Promise.all([
          fetchProjects({ role: userData.role, userId: currentUser.uid, getToken }),
          fetchSchedules({ role: userData.role, userId: currentUser.uid, getToken }),
        ])
        setProjects(projectsData)
        setSchedules(schedulesData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser, userData, getToken])

  const kpis = useMemo(() => {
    const active = projects.filter(p => (p.status || '').toLowerCase() === 'active').length
    const avgProgress = projects.length
      ? Math.round(projects.reduce((acc, p) => acc + Number(p.progressPct || 0), 0) / projects.length)
      : 0
    const upcoming = schedules.filter(s =>
      ['planned', 'pending', 'in-progress'].includes((s.status || '').toLowerCase())
    ).length
    return { active, avgProgress, upcoming }
  }, [projects, schedules])

  const firstName = userData?.displayName?.split(' ')[0] || 'bienvenido'

  return (
    <PortalLayout>
      {/* ── Greeting ── */}
      <div className="nds-portal-greeting">
        <h1 className="nds-portal-greeting-title">Hola, {firstName} 👋</h1>
        <p className="nds-portal-greeting-sub">¿A dónde quieres ir hoy?</p>
      </div>

      {/* ── Choice cards ── */}
      <div className="nds-portal-choice-grid">

        {/* Portal de Clientes */}
        <div className="nds-portal-choice-card">
          <div className="nds-portal-choice-icon nds-portal-choice-icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <h2 className="nds-portal-choice-title">Portal de Clientes</h2>
          <p className="nds-portal-choice-desc">
            Revisa el estado de tus proyectos, cronograma de entregas, documentos y solicitudes de soporte.
          </p>

          {/* KPI mini-strip */}
          {!loading && (
            <div className="nds-portal-choice-kpis">
              <div className="nds-portal-choice-kpi">
                <span className="nds-portal-choice-kpi-num">{kpis.active}</span>
                <span className="nds-portal-choice-kpi-lbl">Proyectos activos</span>
              </div>
              <div className="nds-portal-choice-kpi">
                <span className="nds-portal-choice-kpi-num">{kpis.avgProgress}%</span>
                <span className="nds-portal-choice-kpi-lbl">Avance promedio</span>
              </div>
              <div className="nds-portal-choice-kpi">
                <span className="nds-portal-choice-kpi-num">{kpis.upcoming}</span>
                <span className="nds-portal-choice-kpi-lbl">Hitos próximos</span>
              </div>
            </div>
          )}

          <div className="nds-portal-choice-links">
            <Link to="/portal/projects" className="nds-portal-choice-link">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              Proyectos
            </Link>
            <Link to="/portal/schedule" className="nds-portal-choice-link">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Cronograma
            </Link>
            <Link to="/portal/downloads" className="nds-portal-choice-link">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargas
            </Link>
            <Link to="/portal/support" className="nds-portal-choice-link">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Soporte
            </Link>
          </div>

          <Link to="/portal/projects" className="nds-portal-choice-cta">
            Ir al Dashboard
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* DesignPro */}
        <div className="nds-portal-choice-card nds-portal-choice-card--tool">
          <div className="nds-portal-choice-icon nds-portal-choice-icon--teal">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>

          <div className="nds-portal-choice-badge">Herramienta Pro</div>

          <h2 className="nds-portal-choice-title">DesignPro by NDS</h2>
          <p className="nds-portal-choice-desc">
            Genera ingeniería base para proyectos de automatización industrial en minutos. De días a minutos en cotización y diseño preliminar.
          </p>

          <div className="nds-portal-choice-metrics">
            <div className="nds-portal-choice-metric">
              <span className="nds-portal-choice-metric-val">-60%</span>
              <span className="nds-portal-choice-metric-lbl">tiempo en ingeniería</span>
            </div>
            <div className="nds-portal-choice-metric">
              <span className="nds-portal-choice-metric-val">-35%</span>
              <span className="nds-portal-choice-metric-lbl">retrabajo técnico</span>
            </div>
            <div className="nds-portal-choice-metric">
              <span className="nds-portal-choice-metric-val">24h</span>
              <span className="nds-portal-choice-metric-lbl">respuesta al cliente</span>
            </div>
          </div>

          <Link to="/portal/designpro" className="nds-portal-choice-cta nds-portal-choice-cta--tool">
            Abrir DesignPro
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Admin shortcut ── */}
      {userData?.role === 'admin' && (
        <div className="nds-portal-admin-bar">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Acceso Admin:
          <Link to="/portal/admin/invites" className="nds-portal-admin-link">Gestionar invitaciones</Link>
        </div>
      )}
    </PortalLayout>
  )
}
