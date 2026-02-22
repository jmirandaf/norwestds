import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProjects, fetchSchedules } from '../../services/portalService'

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
    const upcoming = schedules.filter(s => ['planned', 'pending', 'in-progress'].includes((s.status || '').toLowerCase())).length
    return { active, avgProgress, upcoming }
  }, [projects, schedules])

  return (
    <div className='portal-shell'>
      <div className='portal-header'>
        <h1>Portal NDS</h1>
        <p>Bienvenido al portal de clientes y proyectos.</p>
      </div>

      <div className='portal-kpi-grid'>
        <Card title='Proyectos activos' value={loading ? '...' : kpis.active} />
        <Card title='% avance promedio' value={loading ? '...' : `${kpis.avgProgress}%`} />
        <Card title='Hitos próximos' value={loading ? '...' : kpis.upcoming} />
      </div>

      <div className='portal-quick-links'>
        <Link className='portal-link-pill' to='/portal/projects'>Ver proyectos</Link>
        <Link className='portal-link-pill' to='/portal/schedule'>Ver schedule</Link>
        <Link className='portal-link-pill' to='/portal/designpro'>DesignPro by NDS</Link>
        {userData?.role === 'admin' && <Link className='portal-link-pill' to='/portal/admin/invites'>Invitar usuario</Link>}
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className='portal-card'>
      <div className='portal-card-title'>{title}</div>
      <div className='portal-card-value'>{value}</div>
    </div>
  )
}
