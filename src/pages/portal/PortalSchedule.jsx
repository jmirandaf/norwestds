import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchSchedules } from '../../services/portalService'
import { SCHEDULE_MILESTONES } from '../../config/portalStandards'
import PortalLayout from '../../components/PortalLayout'

export default function PortalSchedule() {
  const { currentUser, userData, getToken } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!currentUser || !userData) return
      try {
        setLoading(true)
        setError('')
        const data = await fetchSchedules({
          role: userData.role,
          userId: currentUser.uid,
          getToken,
        })
        setItems(data)
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar el schedule.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentUser, userData, getToken])

  return (
    <PortalLayout title='Schedule' subtitle='Hitos y fechas de proyectos.'>
      {loading && <p>Cargando schedule...</p>}
      {error && <p className='portal-error'>{error}</p>}

      {!loading && !error && items.length === 0 && <p>Sin hitos registrados aún.</p>}

      {!loading && !error && items.length > 0 && (
        <div className='portal-stack'>
          {items.map((s) => {
            const milestone = (s.milestone || s.name || '').toLowerCase()
            const milestoneOk = !milestone || SCHEDULE_MILESTONES.includes(milestone)

            return (
              <div key={s.id} className='portal-card'>
                <strong>{s.projectName || s.projectId || 'Proyecto'}</strong>
                <div>Hito: {s.milestone || s.name || 'N/D'} {!milestoneOk && <span className='portal-error'>(fuera de estándar)</span>}</div>
                <div>Fecha: {s.dueDate || s.date || 'N/D'}</div>
                <div>Estatus: {s.status || 'N/D'}</div>
              </div>
            )
          })}
        </div>
      )}
    </PortalLayout>
  )
}
