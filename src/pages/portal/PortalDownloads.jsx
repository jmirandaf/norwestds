import { useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'

const MOCK_FILES = [
  { id: 'f1', project: 'Línea Ensamble A', name: 'Plano_mecanico_v3.pdf', type: 'PDF', updatedAt: '2026-02-20', size: '2.1 MB' },
  { id: 'f2', project: 'Célula Robotizada B', name: 'BOM_final.xlsx', type: 'XLSX', updatedAt: '2026-02-19', size: '410 KB' },
  { id: 'f3', project: 'Línea Ensamble A', name: 'Render_preliminar.png', type: 'PNG', updatedAt: '2026-02-18', size: '1.3 MB' },
  { id: 'f4', project: 'Transportador C', name: 'Manual_operacion_rev1.pdf', type: 'PDF', updatedAt: '2026-02-16', size: '3.8 MB' },
]

export default function PortalDownloads() {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('all')

  const projectOptions = useMemo(() => ['all', ...new Set(MOCK_FILES.map((f) => f.project))], [])

  const filtered = useMemo(() => {
    return MOCK_FILES.filter((f) => {
      const passProject = project === 'all' || f.project === project
      const q = query.trim().toLowerCase()
      const passQuery = !q || `${f.name} ${f.type} ${f.project}`.toLowerCase().includes(q)
      return passProject && passQuery
    })
  }, [query, project])

  return (
    <PortalLayout title='Descargas' subtitle='Documentos y archivos disponibles por proyecto.'>
      <div className='portal-project-toolbar'>
        <input
          className='dp-input'
          placeholder='Buscar archivo...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className='dp-input' value={project} onChange={(e) => setProject(e.target.value)}>
          {projectOptions.map((p) => (
            <option key={p} value={p}>{p === 'all' ? 'todos los proyectos' : p}</option>
          ))}
        </select>
      </div>

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
                <td>{f.project}</td>
                <td>{f.type}</td>
                <td>{f.updatedAt}</td>
                <td>{f.size}</td>
                <td>
                  <button className='btn-ghost' onClick={() => alert(`Descarga mock: ${f.name}`)}>Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <p>Sin archivos con los filtros actuales.</p>}
    </PortalLayout>
  )
}
