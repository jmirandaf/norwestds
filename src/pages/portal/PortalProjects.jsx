import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchProjects } from '../../services/portalService'
import { PROJECT_REQUIRED_FIELDS, PROJECT_STATUSES } from '../../config/portalStandards'
import PortalLayout from '../../components/PortalLayout'

export default function PortalProjects() {
  const { currentUser, userData, getToken } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

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

  const statusOptions = useMemo(() => {
    const dynamic = [...new Set(projects.map((p) => String(p.status || '').toLowerCase()).filter(Boolean))]
    const merged = [...new Set([...PROJECT_STATUSES, ...dynamic])]
    return ['all', ...merged]
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const status = String(p.status || '').toLowerCase()
      const text = `${p.title || ''} ${p.pmName || ''} ${p.pmId || ''} ${p.clientName || ''}`.toLowerCase()
      const passStatus = statusFilter === 'all' || status === statusFilter
      const passQuery = !query.trim() || text.includes(query.trim().toLowerCase())
      return passStatus && passQuery
    })
  }, [projects, statusFilter, query])

  const selectedProject = useMemo(
    () => filtered.find((p) => p.id === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  )

  return (
    <PortalLayout title='Proyectos' subtitle='Estatus, avance y entregables por cliente.'>
      <div className='portal-project-toolbar'>
        <input
          className='dp-input'
          placeholder='Buscar por proyecto, PM o cliente...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className='dp-input' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'todos los estatus' : s}</option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando proyectos...</p>}
      {error && <p className='portal-error'>{error}</p>}
      {!loading && !error && projects.length === 0 && <p>No hay proyectos todavía para este usuario.</p>}

      {!loading && !error && projects.length > 0 && (
        <div className='portal-project-grid'>
          <div className='portal-stack'>
            {filtered.length === 0 && <p>Sin resultados con los filtros actuales.</p>}
            {filtered.map((p) => {
              const statusOk = PROJECT_STATUSES.includes((p.status || '').toLowerCase())
              const isActive = selectedProject?.id === p.id
              return (
                <button key={p.id} className={`portal-card portal-project-item ${isActive ? 'active' : ''}`} onClick={() => setSelectedId(p.id)}>
                  <strong>{p.title || 'Proyecto sin título'}</strong>
                  <div>Estatus: {p.status || 'N/D'} {!statusOk && <span className='portal-error'>(fuera de estándar)</span>}</div>
                  <div>Avance: {p.progressPct ?? 0}%</div>
                  <div>PM: {p.pmName || p.pmId || 'N/D'}</div>
                </button>
              )
            })}
          </div>

          <div className='portal-card'>
            {!selectedProject && <p>Selecciona un proyecto para ver detalle.</p>}
            {selectedProject && (
              <>
                <h3 style={{ marginTop: 0 }}>{selectedProject.title || 'Proyecto sin título'}</h3>
                <div><strong>ID:</strong> {selectedProject.id || 'N/D'}</div>
                <div><strong>Estatus:</strong> {selectedProject.status || 'N/D'}</div>
                <div><strong>Avance:</strong> {selectedProject.progressPct ?? 0}%</div>
                <div><strong>Prioridad:</strong> {selectedProject.priority || 'N/D'}</div>
                <div><strong>Riesgo:</strong> {selectedProject.riskLevel || 'N/D'}</div>
                <div><strong>PM:</strong> {selectedProject.pmName || selectedProject.pmId || 'N/D'}</div>
                <div><strong>Cliente:</strong> {selectedProject.clientName || selectedProject.clientId || 'N/D'}</div>
                <div><strong>Fecha inicio:</strong> {selectedProject.startDate || 'N/D'}</div>
                <div><strong>Fecha fin:</strong> {selectedProject.endDate || 'N/D'}</div>

                {PROJECT_REQUIRED_FIELDS.filter((f) => selectedProject[f] === undefined || selectedProject[f] === null || selectedProject[f] === '').length > 0 && (
                  <div className='portal-error portal-mt'>
                    Campos faltantes:{' '}
                    {PROJECT_REQUIRED_FIELDS.filter((f) => selectedProject[f] === undefined || selectedProject[f] === null || selectedProject[f] === '').join(', ')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  )
}
