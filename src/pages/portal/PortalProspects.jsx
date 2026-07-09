import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
import { MOCK_PLANTS } from './plantsData'
// TODO: replace with API call when backend is ready:
// import axios from 'axios'
// const API = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const SECTORS = ['Todos', 'Automotriz', 'Electrónico', 'Médico', 'Aeroespacial', 'Metalmecánico', 'Eléctrico', 'Plástico', 'Alimentos']

const SECTOR_COLORS = {
  'Automotriz':    '#f97316',
  'Electrónico':   '#3b82f6',
  'Médico':        '#ef4444',
  'Aeroespacial':  '#8b5cf6',
  'Metalmecánico': '#6b7280',
  'Eléctrico':     '#f59e0b',
  'Plástico':      '#10b981',
  'Alimentos':     '#22c55e',
}

const POTENTIAL_LABELS = ['Sin evaluar', 'Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto']
const POTENTIAL_COLORS = ['#94a3b8', '#64748b', '#60a5fa', '#fbbf24', '#34d399', '#12A6CC']
const STATUS_LABELS    = { prospecto: 'Prospecto', contactado: 'Contactado', calificado: 'Calificado', cliente: 'Cliente' }
const STATUS_COLORS    = { prospecto: '#94a3b8', contactado: '#3b82f6', calificado: '#f59e0b', cliente: '#12A6CC' }

const TOOLTIP_ZOOM = 13

function PotentialDots({ value }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < value ? POTENTIAL_COLORS[value] : '#e2e8f0' }} />
      ))}
    </span>
  )
}

function FlyToMarker({ plant }) {
  const map = useMap()
  useEffect(() => { if (plant) map.flyTo([plant.lat, plant.lng], 14, { duration: 0.8 }) }, [plant, map])
  return null
}

function ZoomTracker({ onZoom }) {
  const map = useMap()
  useEffect(() => {
    onZoom(map.getZoom())
    const handler = () => onZoom(map.getZoom())
    map.on('zoomend', handler)
    return () => map.off('zoomend', handler)
  }, [map, onZoom])
  return null
}

export default function PortalProspects() {
  const { userData } = useAuth()
  const canEdit = userData?.role === 'admin' || userData?.role === 'pm'

  const [plants, setPlants]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [sector, setSector]         = useState('Todos')
  const [minPotential, setMinPot]   = useState(0)
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(null)
  const [flyTarget, setFlyTarget]   = useState(null)
  const [editing, setEditing]       = useState(null)
  const [savingId, setSavingId]     = useState(null)
  const [zoom, setZoom]             = useState(11)
  const sidebarRef = useRef(null)

  useEffect(() => { setPlants(MOCK_PLANTS); setLoading(false) }, [])

  const filtered = plants.filter(p => {
    if (sector !== 'Todos' && p.sector !== sector) return false
    if (p.potential < minPotential) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleMarkerClick = useCallback((plant) => {
    setSelected(plant)
    setFlyTarget(plant)
    setEditing(null)
    setTimeout(() => {
      sidebarRef.current?.querySelector(`[data-pid="${plant.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }, [])

  const handleSave = useCallback((id, patch) => {
    setSavingId(id)
    setPlants(prev => prev.map(p => {
      if (p.id !== id) return p
      const updated = { ...p, ...patch }
      setSelected(updated)
      return updated
    }))
    setEditing(null)
    setSavingId(null)
  }, [])

  const handleZoom  = useCallback((z) => setZoom(z), [])
  const showLabels  = zoom >= TOOLTIP_ZOOM

  const sectorCount = SECTORS.slice(1).reduce((acc, s) => { acc[s] = plants.filter(p => p.sector === s).length; return acc }, {})

  return (
    <PortalLayout title="Mapa de Prospectos" subtitle="Plantas de manufactura en Baja California">
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', minHeight: 540, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--nds-border, #e2e8f0)' }}>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', zIndex: 999, fontSize: 14, color: '#64748b' }}>
              Cargando plantas…
            </div>
          )}

          {!loading && (
            <MapContainer center={[32.5149, -117.0382]} zoom={11} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={19}
              />
              <ZoomTracker onZoom={handleZoom} />
              {flyTarget && <FlyToMarker plant={flyTarget} />}

              {filtered.map(plant => (
                <CircleMarker
                  key={`${plant.id}-${showLabels}`}
                  center={[plant.lat, plant.lng]}
                  radius={selected?.id === plant.id ? 11 : 8}
                  pathOptions={{
                    fillColor: POTENTIAL_COLORS[plant.potential],
                    fillOpacity: 0.88,
                    color: selected?.id === plant.id ? '#0f172a' : '#fff',
                    weight: selected?.id === plant.id ? 2.5 : 1.5,
                  }}
                  eventHandlers={{ click: () => handleMarkerClick(plant) }}
                >
                  {/* Tooltip permanente al zoom >= 13 */}
                  <Tooltip permanent={showLabels} direction="top" offset={[0, -10]} opacity={1}>
                    <div style={{ minWidth: 150, maxWidth: 210 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a', lineHeight: 1.3, marginBottom: 4 }}>
                        {plant.name}
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: SECTOR_COLORS[plant.sector] || '#64748b', color: '#fff', fontWeight: 600 }}>
                          {plant.sector}
                        </span>
                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: STATUS_COLORS[plant.status], color: '#fff', fontWeight: 600 }}>
                          {STATUS_LABELS[plant.status]}
                        </span>
                      </div>
                      {plant.employees && <div style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>{plant.employees.toLocaleString()} empleados</div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <PotentialDots value={plant.potential} />
                        <span style={{ fontSize: 10, color: POTENTIAL_COLORS[plant.potential], fontWeight: 600 }}>{POTENTIAL_LABELS[plant.potential]}</span>
                      </div>
                    </div>
                  </Tooltip>

                  {/* Popup al hacer clic */}
                  <Popup maxWidth={260}>
                    <div style={{ minWidth: 230 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{plant.name}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: SECTOR_COLORS[plant.sector] || '#64748b', color: '#fff', fontWeight: 600 }}>{plant.sector}</span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: STATUS_COLORS[plant.status], color: '#fff', fontWeight: 600 }}>{STATUS_LABELS[plant.status]}</span>
                      </div>
                      {plant.address && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>{plant.address}</div>}
                      {plant.employees && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5 }}>{plant.employees.toLocaleString()} empleados</div>}
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        Potencial: <PotentialDots value={plant.potential} />
                        <span style={{ color: POTENTIAL_COLORS[plant.potential], fontWeight: 600 }}>{POTENTIAL_LABELS[plant.potential]}</span>
                      </div>
                      {/* Contacto */}
                      {plant.contactName && (
                        <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: 7, marginBottom: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 5 }}>Contacto</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{plant.contactName}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{plant.contactTitle}</div>
                          {plant.contactPhone && (
                            <a href={`tel:${plant.contactPhone}`} style={{ display: 'block', fontSize: 11, color: '#12A6CC', textDecoration: 'none', marginBottom: 2 }}>
                              {plant.contactPhone}
                            </a>
                          )}
                          {plant.contactEmail && (
                            <a href={`mailto:${plant.contactEmail}`} style={{ display: 'block', fontSize: 11, color: '#12A6CC', textDecoration: 'none', wordBreak: 'break-all' }}>
                              {plant.contactEmail}
                            </a>
                          )}
                        </div>
                      )}
                      {plant.notes && <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', marginBottom: 6 }}>{plant.notes}</div>}
                      {canEdit && (
                        <button
                          onClick={() => { setSelected(plant); setEditing(plant) }}
                          style={{ width: '100%', marginTop: 4, fontSize: 12, padding: '5px 12px', borderRadius: 6, background: '#12A6CC', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Editar potencial
                        </button>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          {!loading && (
            <div style={{ position: 'absolute', bottom: 24, left: 12, zIndex: 1000, background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>Potencial</div>
              {POTENTIAL_LABELS.map((label, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: POTENTIAL_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
                </div>
              ))}
              {!showLabels && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', fontSize: 10, color: '#94a3b8' }}>
                  Zoom in para ver etiquetas
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--nds-border, #e2e8f0)', background: '#fff', overflow: 'hidden', flexShrink: 0 }}>

          {/* Filters */}
          <div style={{ padding: '14px 14px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>Filtros</div>

            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar empresa…"
              style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: '#1e293b', marginBottom: 8, boxSizing: 'border-box' }}
            />

            <select
              value={sector}
              onChange={e => setSector(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: '#1e293b', cursor: 'pointer', marginBottom: 8 }}
            >
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}{s !== 'Todos' && sectorCount[s] ? ` (${sectorCount[s]})` : ''}</option>
              ))}
            </select>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Potencial mínimo: {POTENTIAL_LABELS[minPotential]}</label>
              <input type="range" min={0} max={5} value={minPotential} onChange={e => setMinPot(Number(e.target.value))} style={{ width: '100%', accentColor: '#12A6CC' }} />
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8', paddingBottom: 10 }}>
              {filtered.length} de {plants.length} plantas
            </div>
          </div>

          {/* Edit panel */}
          {editing && canEdit && (
            <EditPanel
              plant={editing}
              saving={savingId === editing.id}
              onSave={patch => handleSave(editing.id, patch)}
              onClose={() => setEditing(null)}
            />
          )}

          {/* Plant list */}
          <div ref={sidebarRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
            {filtered.length === 0 && !loading && (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Sin resultados.</div>
            )}
            {filtered.map(plant => (
              <button
                key={plant.id}
                data-pid={plant.id}
                onClick={() => handleMarkerClick(plant)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 14px', border: 'none', cursor: 'pointer',
                  background: selected?.id === plant.id ? '#f0fbff' : 'transparent',
                  borderLeft: `3px solid ${selected?.id === plant.id ? '#12A6CC' : 'transparent'}`,
                  transition: 'background .12s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#1e293b', lineHeight: 1.3 }}>{plant.name}</div>
                  <PotentialDots value={plant.potential} />
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: SECTOR_COLORS[plant.sector] || '#e2e8f0', color: '#fff', fontWeight: 600 }}>{plant.sector}</span>
                  {plant.contactName && <span style={{ fontSize: 10, color: '#94a3b8' }}>{plant.contactName.split(' ').slice(0, 2).join(' ')}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}

function EditPanel({ plant, saving, onSave, onClose }) {
  const [potential, setPotential] = useState(plant.potential)
  const [status, setStatus]       = useState(plant.status)
  const [notes, setNotes]         = useState(plant.notes || '')

  const dirty = potential !== plant.potential || status !== plant.status || notes !== (plant.notes || '')

  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#12A6CC', textTransform: 'uppercase', letterSpacing: '.05em' }}>Editar — {plant.name}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Potencial ({POTENTIAL_LABELS[potential]})</label>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2,3,4,5].map(v => (
            <button key={v} onClick={() => setPotential(v)} style={{ width: 27, height: 27, borderRadius: 6, border: `2px solid ${potential===v ? POTENTIAL_COLORS[v] : '#e2e8f0'}`, background: potential===v ? POTENTIAL_COLORS[v] : '#fff', color: potential===v ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Estatus</label>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff' }}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Notas</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }} placeholder="Oportunidad, contacto clave…" />
      </div>

      <button
        disabled={!dirty || saving}
        onClick={() => onSave({ potential, status, notes: notes || null })}
        style={{ width: '100%', padding: '7px', borderRadius: 7, border: 'none', cursor: dirty && !saving ? 'pointer' : 'not-allowed', background: dirty && !saving ? '#12A6CC' : '#e2e8f0', color: dirty && !saving ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13 }}
      >
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </div>
  )
}
