import { useEffect, useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import { fetchDownloads } from '../../services/portalService'

const MOCK_FILES = [
  { id: 'f1', projectName: 'Línea Ensamble A', name: 'Plano_mecanico_v3.pdf', type: 'PDF', updatedAt: '2026-02-20', size: '2.1 MB' },
  { id: 'f2', projectName: 'Célula Robotizada B', name: 'BOM_final.xlsx', type: 'XLSX', updatedAt: '2026-02-19', size: '410 KB' },
]

export default function PortalDownloads() {
  const { getToken } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchDownloads({ getToken })
        setFiles(data)
      } catch (e) {
        console.error(e)
        setError('No se pudieron cargar las descargas. Mostrando datos de prueba.')
        setFiles(MOCK_FILES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const projectOptions = useMemo(() => ['all', ...new Set(files.map((f) => f.projectName || 'Sin proyecto'))], [files])

  const filtered = useMemo(() => {
    return files.filter((f) => {
      const pName = f.projectName || 'Sin proyecto'
      const passProject = project === 'all' || pName === project
      const q = query.trim().toLowerCase()
      const passQuery = !q || `${f.name} ${f.type || ''} ${pName}`.toLowerCase().includes(q)
      return passProject && passQuery
    })
  }, [query, project, files])

  return (
    <PortalLayout title='Descargas' subtitle='Documentos y archivos disponibles por proyecto.'>
      <div className='portal-project-toolbar'>
        <input className='dp-input' placeholder='Buscar archivo...' value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className='dp-input' value={project} onChange={(e) => setProject(e.target.value)}>
          {projectOptions.map((p) => (
            <option key={p} value={p}>{p === 'all' ? 'todos los proyectos' : p}</option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando archivos...</p>}
      {error && <p className='portal-error'>{error}</p>}

      {!loading && (
        <>
          <div className='portal-table-wrap'>
            <table className='portal-table'>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Proyecto</th>
                  <th>Tipo</th>
                  <th>Actualizado</th>
                  <th>Tamaño</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.projectName || 'Sin proyecto'}</td>
                    <td>{f.type || 'N/D'}</td>
                    <td>{String(f.updatedAt || '').slice(0, 10) || 'N/D'}</td>
                    <td>{f.size || 'N/D'}</td>
                    <td>
                      {f.fileUrl ? (
                        <a className='btn-ghost' href={f.fileUrl} target='_blank' rel='noreferrer'>Descargar</a>
                      ) : (
                        <button className='btn-ghost' onClick={() => alert(`Archivo sin URL aún: ${f.name}`)}>Descargar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && <p>Sin archivos con los filtros actuales.</p>}
        </>
      )}
    </PortalLayout>
  )
}
