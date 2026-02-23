import { useEffect, useMemo, useState } from 'react'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import { createDownload, deleteDownload, fetchDownloads, updateDownload } from '../../services/portalService'

const MOCK_FILES = [
  {
    id: 'f1',
    projectName: 'Línea Ensamble A',
    name: 'Plano_mecanico_v3.pdf',
    type: 'PDF',
    category: 'plano',
    updatedAt: '2026-02-20',
    size: '2.1 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'f2',
    projectName: 'Célula Robotizada B',
    name: 'BOM_final.xlsx',
    type: 'XLSX',
    category: 'bom',
    updatedAt: '2026-02-19',
    size: '410 KB',
  },
  {
    id: 'f3',
    projectName: 'Línea Ensamble A',
    name: 'Render_preliminar.png',
    type: 'PNG',
    category: 'render',
    updatedAt: '2026-02-18',
    size: '1.3 MB',
    fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg',
  },
]

export default function PortalDownloads() {
  const { getToken, userData } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('all')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [selectedId, setSelectedId] = useState(null)
  const [createMsg, setCreateMsg] = useState('')
  const [editMsg, setEditMsg] = useState('')
  const [createForm, setCreateForm] = useState({
    projectName: '',
    name: '',
    type: '',
    category: 'otro',
    size: '',
    fileUrl: '',
  })
  const [editForm, setEditForm] = useState({
    projectName: '',
    name: '',
    type: '',
    category: 'otro',
    size: '',
    fileUrl: '',
  })

  const canManageDownloads = userData?.role === 'admin' || userData?.role === 'pm'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchDownloads({
          getToken,
          query: {
            q: query || undefined,
            project: project !== 'all' ? project : undefined,
            type: type !== 'all' ? type : undefined,
            category: category !== 'all' ? category : undefined,
            sort: sortBy,
          },
        })
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
  }, [getToken, query, project, type, category, sortBy])

  const projectOptions = useMemo(
    () => ['all', ...new Set(files.map((f) => f.projectName || 'Sin proyecto'))],
    [files]
  )

  const typeOptions = useMemo(
    () => ['all', ...new Set(files.map((f) => String(f.type || '').toUpperCase()).filter(Boolean))],
    [files]
  )

  const categoryOptions = useMemo(
    () => ['all', ...new Set(files.map((f) => String(f.category || '').toLowerCase()).filter(Boolean))],
    [files]
  )

  const filtered = useMemo(() => {
    const base = files.filter((f) => {
      const pName = f.projectName || 'Sin proyecto'
      const fType = String(f.type || '').toUpperCase()
      const fCategory = String(f.category || '').toLowerCase()
      const passProject = project === 'all' || pName === project
      const passType = type === 'all' || fType === type
      const passCategory = category === 'all' || fCategory === category
      const q = query.trim().toLowerCase()
      const passQuery = !q || `${f.name} ${fType} ${fCategory} ${pName}`.toLowerCase().includes(q)
      return passProject && passType && passCategory && passQuery
    })

    const sorted = [...base]
    sorted.sort((a, b) => {
      if (sortBy === 'name_asc') return String(a.name).localeCompare(String(b.name))
      if (sortBy === 'name_desc') return String(b.name).localeCompare(String(a.name))

      const aDate = new Date(a.updatedAt || 0).getTime()
      const bDate = new Date(b.updatedAt || 0).getTime()
      return sortBy === 'date_asc' ? aDate - bDate : bDate - aDate
    })

    return sorted
  }, [query, project, type, category, sortBy, files])

  const selectedFile = useMemo(
    () => filtered.find((f) => f.id === selectedId) || filtered[0] || null,
    [filtered, selectedId]
  )

  useEffect(() => {
    if (!selectedFile) return
    setEditForm({
      projectName: selectedFile.projectName || '',
      name: selectedFile.name || '',
      type: selectedFile.type || '',
      category: selectedFile.category || 'otro',
      size: selectedFile.size || '',
      fileUrl: selectedFile.fileUrl || '',
    })
  }, [selectedFile?.id])

  const isPreviewable = (f) => {
    const t = String(f?.type || '').toLowerCase()
    return t === 'pdf' || t === 'png' || t === 'jpg' || t === 'jpeg' || t === 'webp' || t === 'svg'
  }

  const onCreateDownload = async (e) => {
    e.preventDefault()
    setCreateMsg('')
    try {
      const created = await createDownload({
        getToken,
        payload: {
          projectName: createForm.projectName,
          name: createForm.name,
          type: createForm.type || null,
          category: createForm.category,
          size: createForm.size || null,
          fileUrl: createForm.fileUrl || null,
        },
      })
      setFiles([created, ...files])
      setCreateForm({ projectName: '', name: '', type: '', category: 'otro', size: '', fileUrl: '' })
      setCreateMsg('Archivo agregado correctamente.')
    } catch (e) {
      console.error(e)
      const local = {
        id: `local-${Date.now()}`,
        ...createForm,
        updatedAt: new Date().toISOString(),
      }
      setFiles([local, ...files])
      setCreateForm({ projectName: '', name: '', type: '', category: 'otro', size: '', fileUrl: '' })
      setCreateMsg('Archivo agregado en modo local (mock).')
    }
  }

  const onUpdateDownload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return
    setEditMsg('')
    try {
      const updated = await updateDownload({ id: selectedFile.id, payload: editForm, getToken })
      setFiles(files.map((f) => (f.id === updated.id ? updated : f)))
      setEditMsg('Archivo actualizado.')
    } catch (e) {
      console.error(e)
      setFiles(files.map((f) => (f.id === selectedFile.id ? { ...f, ...editForm } : f)))
      setEditMsg('Archivo actualizado en modo local (mock).')
    }
  }

  const onDeleteDownload = async () => {
    if (!selectedFile) return
    if (!confirm(`¿Eliminar archivo ${selectedFile.name}?`)) return

    try {
      await deleteDownload({ id: selectedFile.id, getToken })
    } catch (e) {
      console.error(e)
    }

    const remaining = files.filter((f) => f.id !== selectedFile.id)
    setFiles(remaining)
    setSelectedId(remaining[0]?.id || null)
    setEditMsg('Archivo eliminado.')
  }

  return (
    <PortalLayout title='Descargas' subtitle='Documentos y archivos disponibles por proyecto.'>
      {canManageDownloads && (
        <div className='portal-card' style={{ marginBottom: 12 }}>
          <h3 style={{ marginTop: 0 }}>Agregar archivo (admin/pm)</h3>
          <form className='portal-download-create' onSubmit={onCreateDownload}>
            <input className='dp-input' placeholder='Proyecto' required value={createForm.projectName} onChange={(e) => setCreateForm({ ...createForm, projectName: e.target.value })} />
            <input className='dp-input' placeholder='Nombre de archivo' required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
            <input className='dp-input' placeholder='Tipo (PDF, XLSX...)' value={createForm.type} onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })} />
            <select className='dp-input' value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}>
              <option value='plano'>plano</option>
              <option value='bom'>bom</option>
              <option value='manual'>manual</option>
              <option value='render'>render</option>
              <option value='otro'>otro</option>
            </select>
            <input className='dp-input' placeholder='Tamaño (ej. 2.1 MB)' value={createForm.size} onChange={(e) => setCreateForm({ ...createForm, size: e.target.value })} />
            <input className='dp-input' placeholder='URL archivo (opcional)' value={createForm.fileUrl} onChange={(e) => setCreateForm({ ...createForm, fileUrl: e.target.value })} />
            <button className='btn-primary' type='submit'>Agregar</button>
          </form>
          {createMsg && <p style={{ color: 'green' }}>{createMsg}</p>}
        </div>
      )}

      <div className='portal-download-toolbar'>
        <input className='dp-input' placeholder='Buscar archivo...' value={query} onChange={(e) => setQuery(e.target.value)} />

        <select className='dp-input' value={project} onChange={(e) => setProject(e.target.value)}>
          {projectOptions.map((p) => (
            <option key={p} value={p}>{p === 'all' ? 'todos los proyectos' : p}</option>
          ))}
        </select>

        <select className='dp-input' value={type} onChange={(e) => setType(e.target.value)}>
          {typeOptions.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'todos los tipos' : t}</option>
          ))}
        </select>

        <select className='dp-input' value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'todas las categorías' : c}</option>
          ))}
        </select>

        <select className='dp-input' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value='date_desc'>más recientes</option>
          <option value='date_asc'>más antiguos</option>
          <option value='name_asc'>nombre A-Z</option>
          <option value='name_desc'>nombre Z-A</option>
        </select>
      </div>

      {loading && <p>Cargando archivos...</p>}
      {error && <p className='portal-error'>{error}</p>}

      {!loading && (
        <div className='portal-project-grid'>
          <div className='portal-table-wrap'>
            <table className='portal-table'>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Proyecto</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Actualizado</th>
                  <th>Tamaño</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} className={selectedFile?.id === f.id ? 'portal-row-selected' : ''}>
                    <td>
                      <button className='portal-link-button' onClick={() => setSelectedId(f.id)}>{f.name}</button>
                    </td>
                    <td>{f.projectName || 'Sin proyecto'}</td>
                    <td><span className='portal-type-badge'>{f.type || 'N/D'}</span></td>
                    <td><span className='portal-category-badge'>{f.category || 'otro'}</span></td>
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

          <div className='portal-card'>
            <h3 style={{ marginTop: 0 }}>Detalle de archivo</h3>
            {!selectedFile && <p>Selecciona un archivo para ver detalle.</p>}
            {selectedFile && (
              <>
                <div><strong>Nombre:</strong> {selectedFile.name}</div>
                <div><strong>Proyecto:</strong> {selectedFile.projectName || 'Sin proyecto'}</div>
                <div><strong>Tipo:</strong> {selectedFile.type || 'N/D'}</div>
                <div><strong>Categoría:</strong> {selectedFile.category || 'otro'}</div>
                <div><strong>Tamaño:</strong> {selectedFile.size || 'N/D'}</div>
                <div><strong>Actualizado:</strong> {String(selectedFile.updatedAt || '').slice(0, 10) || 'N/D'}</div>

                {canManageDownloads && (
                  <form className='portal-download-edit' onSubmit={onUpdateDownload}>
                    <h4>Editar archivo</h4>
                    <input className='dp-input' value={editForm.projectName} onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })} placeholder='Proyecto' />
                    <input className='dp-input' value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder='Nombre' />
                    <input className='dp-input' value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} placeholder='Tipo' />
                    <select className='dp-input' value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                      <option value='plano'>plano</option>
                      <option value='bom'>bom</option>
                      <option value='manual'>manual</option>
                      <option value='render'>render</option>
                      <option value='otro'>otro</option>
                    </select>
                    <input className='dp-input' value={editForm.size} onChange={(e) => setEditForm({ ...editForm, size: e.target.value })} placeholder='Tamaño' />
                    <input className='dp-input' value={editForm.fileUrl} onChange={(e) => setEditForm({ ...editForm, fileUrl: e.target.value })} placeholder='URL' />
                    <div className='portal-download-actions'>
                      <button className='btn-primary' type='submit'>Guardar cambios</button>
                      <button className='btn-ghost' type='button' onClick={onDeleteDownload}>Eliminar</button>
                    </div>
                    {editMsg && <small style={{ color: 'green' }}>{editMsg}</small>}
                  </form>
                )}

                <div className='portal-preview-wrap'>
                  {selectedFile.fileUrl && isPreviewable(selectedFile) ? (
                    selectedFile.type?.toLowerCase() === 'pdf' ? (
                      <iframe title='preview-pdf' src={selectedFile.fileUrl} className='portal-preview-frame' />
                    ) : (
                      <img src={selectedFile.fileUrl} alt={selectedFile.name} className='portal-preview-image' />
                    )
                  ) : (
                    <div className='portal-preview-empty'>Sin vista previa disponible para este archivo.</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && <p>Sin archivos con los filtros actuales.</p>}
    </PortalLayout>
  )
}
