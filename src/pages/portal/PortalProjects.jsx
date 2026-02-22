import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProjects } from '../../services/portalService'
import { PROJECT_REQUIRED_FIELDS, PROJECT_STATUSES } from '../../config/portalStandards'
import PortalLayout from '../../components/PortalLayout'

export default function PortalProjects() {
  const { currentUser, userData, getToken } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!currentUser || !userData) return
      try {
        setLoading(true)
        setError('')
        const data = await fetchProjects({
          role: userData.role,
          userId: currentUser.uid,
          getToken,
        })
        setProjects(data)
      } catch (e) {
        console.error(e)
        setError('No se pudieron cargar los proyectos.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentUser, userData, getToken])

  return (
    <PortalLayout title='Proyectos' subtitle='Estatus, avance y entregables por cliente.'>
      {loading && <p>Cargando proyectos...</p>}
      {error && <p className='portal-error'>{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p>No hay proyectos todavía para este usuario.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className='portal-stack'>
          {projects.map((p) => {
            const missing = PROJECT_REQUIRED_FIELDS.filter((f) => p[f] === undefined || p[f] === null || p[f] === '')
            const statusOk = PROJECT_STATUSES.includes((p.status || '').toLowerCase())

            return (
              <div key={p.id} className='portal-card'>
                <strong>{p.title || 'Proyecto sin título'}</strong>
                <div>Estatus: {p.status || 'N/D'} {!statusOk && <span className='portal-error'>(fuera de estándar)</span>}</div>
                <div>Avance: {p.progressPct ?? 0}%</div>
                <div>Prioridad: {p.priority || 'N/D'} | Riesgo: {p.riskLevel || 'N/D'}</div>
                <div>PM: {p.pmName || p.pmId || 'N/D'}</div>
                {missing.length > 0 && (
                  <div className='portal-error portal-mt'>
                    Campos faltantes: {missing.join(', ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </PortalLayout>
  )
}
