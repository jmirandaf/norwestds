import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PortalLayout from '../../components/PortalLayout'
import { useAuth } from '../../contexts/AuthContext'
// TODO: replace MOCK_PLANTS with API call when backend is ready:
// import axios from 'axios'
// const API = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const MOCK_PLANTS = [
  // ── Mesa de Otay — Tijuana ────────────────────────────────────────────
  { id: '1',  name: 'Samsung Electronics México',    sector: 'Electrónico',   lat: 32.5273, lng: -116.9198, address: 'Parque Industrial Mesa de Otay, Tijuana, BC',  employees: 3500, potential: 4, status: 'prospecto', notes: null },
  { id: '2',  name: 'Medtronic de México',           sector: 'Médico',        lat: 32.5311, lng: -116.9212, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1800, potential: 5, status: 'prospecto', notes: null },
  { id: '3',  name: 'Abbott Laboratories',           sector: 'Médico',        lat: 32.5289, lng: -116.9187, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1200, potential: 5, status: 'prospecto', notes: null },
  { id: '4',  name: 'BD Medical (Becton Dickinson)', sector: 'Médico',        lat: 32.5302, lng: -116.9201, address: 'Mesa de Otay, Tijuana, BC',                    employees: 900,  potential: 5, status: 'prospecto', notes: null },
  { id: '5',  name: 'Plantronics (Poly)',             sector: 'Electrónico',   lat: 32.5268, lng: -116.9187, address: 'Mesa de Otay, Tijuana, BC',                    employees: 800,  potential: 3, status: 'prospecto', notes: null },
  { id: '6',  name: 'Panasonic México',               sector: 'Electrónico',   lat: 32.5245, lng: -116.9225, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1100, potential: 4, status: 'prospecto', notes: null },
  { id: '7',  name: 'TE Connectivity',                sector: 'Electrónico',   lat: 32.5285, lng: -116.9218, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1600, potential: 4, status: 'prospecto', notes: null },
  { id: '8',  name: 'L3Harris Technologies',          sector: 'Aeroespacial',  lat: 32.5318, lng: -116.9175, address: 'Mesa de Otay, Tijuana, BC',                    employees: 600,  potential: 4, status: 'prospecto', notes: null },
  { id: '9',  name: 'GE Healthcare',                  sector: 'Médico',        lat: 32.5307, lng: -116.9179, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1400, potential: 5, status: 'prospecto', notes: null },
  { id: '10', name: 'Prolec GE (GE Vernova)',         sector: 'Eléctrico',     lat: 32.5265, lng: -116.9223, address: 'Mesa de Otay, Tijuana, BC',                    employees: 700,  potential: 5, status: 'prospecto', notes: null },
  { id: '11', name: 'Amphenol México',                sector: 'Electrónico',   lat: 32.5258, lng: -116.9195, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1300, potential: 4, status: 'prospecto', notes: null },
  { id: '12', name: 'Benchmark Electronics',          sector: 'Electrónico',   lat: 32.5241, lng: -116.9208, address: 'Mesa de Otay, Tijuana, BC',                    employees: 950,  potential: 3, status: 'prospecto', notes: null },
  { id: '13', name: 'Edwards Lifesciences',           sector: 'Médico',        lat: 32.5296, lng: -116.9194, address: 'Mesa de Otay, Tijuana, BC',                    employees: 1100, potential: 5, status: 'prospecto', notes: null },
  { id: '14', name: 'Baxter International',           sector: 'Médico',        lat: 32.5321, lng: -116.9204, address: 'Mesa de Otay, Tijuana, BC',                    employees: 850,  potential: 5, status: 'prospecto', notes: null },

  // ── Parque Industrial El Florido — Tijuana ────────────────────────────
  { id: '15', name: 'Hyundai Mobis',                  sector: 'Automotriz',    lat: 32.4802, lng: -116.8827, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 2200, potential: 5, status: 'prospecto', notes: null },
  { id: '16', name: 'Foxconn México',                 sector: 'Electrónico',   lat: 32.4825, lng: -116.8775, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 4000, potential: 4, status: 'prospecto', notes: null },
  { id: '17', name: 'Johnson Controls',               sector: 'Automotriz',    lat: 32.4798, lng: -116.8862, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 1700, potential: 5, status: 'prospecto', notes: null },
  { id: '18', name: 'Medtronic Neurológico',          sector: 'Médico',        lat: 32.4811, lng: -116.8841, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 800,  potential: 5, status: 'prospecto', notes: null },
  { id: '19', name: 'Kyocera International',          sector: 'Electrónico',   lat: 32.4832, lng: -116.8812, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 1300, potential: 3, status: 'prospecto', notes: null },
  { id: '20', name: 'Jabil Circuit',                  sector: 'Electrónico',   lat: 32.4808, lng: -116.8851, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 2800, potential: 4, status: 'prospecto', notes: null },
  { id: '21', name: 'Boston Scientific',              sector: 'Médico',        lat: 32.4793, lng: -116.8869, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 900,  potential: 5, status: 'prospecto', notes: null },
  { id: '22', name: 'Haas Automation México',         sector: 'Metalmecánico', lat: 32.4840, lng: -116.8845, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 350,  potential: 5, status: 'prospecto', notes: null },
  { id: '23', name: 'Flextronics (Flex Ltd)',         sector: 'Electrónico',   lat: 32.4789, lng: -116.8876, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 3200, potential: 4, status: 'prospecto', notes: null },
  { id: '24', name: 'Chamberlain Group',              sector: 'Electrónico',   lat: 32.4821, lng: -116.8830, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 600,  potential: 4, status: 'prospecto', notes: null },
  { id: '25', name: 'Canon México',                   sector: 'Electrónico',   lat: 32.4815, lng: -116.8823, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 1100, potential: 3, status: 'prospecto', notes: null },
  { id: '26', name: 'Regal Rexnord',                  sector: 'Metalmecánico', lat: 32.4826, lng: -116.8835, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 550,  potential: 5, status: 'prospecto', notes: null },
  { id: '27', name: 'Continental Automotive',         sector: 'Automotriz',    lat: 32.4784, lng: -116.8858, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 1900, potential: 5, status: 'prospecto', notes: null },
  { id: '28', name: 'Delphi Packard',                 sector: 'Automotriz',    lat: 32.4836, lng: -116.8819, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 2400, potential: 5, status: 'prospecto', notes: null },
  { id: '29', name: 'Hella México',                   sector: 'Automotriz',    lat: 32.4848, lng: -116.8806, address: 'Parque Industrial El Florido, Tijuana, BC',    employees: 780,  potential: 4, status: 'prospecto', notes: null },

  // ── Parque Industrial Pacifico — Tijuana ──────────────────────────────
  { id: '30', name: 'Honeywell Aerospace',            sector: 'Aeroespacial',  lat: 32.4178, lng: -116.9315, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 1200, potential: 5, status: 'prospecto', notes: null },
  { id: '31', name: 'Zodiac Aerospace (Safran)',      sector: 'Aeroespacial',  lat: 32.4163, lng: -116.9341, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 850,  potential: 5, status: 'prospecto', notes: null },
  { id: '32', name: 'Celestica',                      sector: 'Electrónico',   lat: 32.4155, lng: -116.9322, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 2000, potential: 4, status: 'prospecto', notes: null },
  { id: '33', name: 'Molex de México',                sector: 'Electrónico',   lat: 32.4191, lng: -116.9298, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 1800, potential: 4, status: 'prospecto', notes: null },
  { id: '34', name: 'Parker Hannifin',                sector: 'Metalmecánico', lat: 32.4172, lng: -116.9309, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 700,  potential: 5, status: 'prospecto', notes: null },
  { id: '35', name: 'Ducommun Aerostructures',        sector: 'Aeroespacial',  lat: 32.4145, lng: -116.9334, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 480,  potential: 4, status: 'prospecto', notes: null },
  { id: '36', name: 'Orbis Corp',                     sector: 'Plástico',      lat: 32.4199, lng: -116.9287, address: 'Parque Industrial Pacifico, Tijuana, BC',      employees: 400,  potential: 2, status: 'prospecto', notes: null },

  // ── Parque Industrial Cuauhtémoc — Tijuana ────────────────────────────
  { id: '37', name: 'Kenworth Mexicana',              sector: 'Automotriz',    lat: 32.5183, lng: -116.9505, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 3100, potential: 5, status: 'prospecto', notes: null },
  { id: '38', name: 'Eaton Corporation',              sector: 'Eléctrico',     lat: 32.4988, lng: -116.9498, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 950,  potential: 5, status: 'prospecto', notes: null },
  { id: '39', name: 'Hubbell Power Systems',          sector: 'Eléctrico',     lat: 32.4973, lng: -116.9512, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 600,  potential: 4, status: 'prospecto', notes: null },
  { id: '40', name: 'National Instruments (NI)',      sector: 'Electrónico',   lat: 32.4962, lng: -116.9487, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 750,  potential: 5, status: 'prospecto', notes: null },
  { id: '41', name: 'Vitro Automotriz',               sector: 'Automotriz',    lat: 32.4955, lng: -116.9523, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 1100, potential: 4, status: 'prospecto', notes: null },
  { id: '42', name: 'Schneider Electric',             sector: 'Eléctrico',     lat: 32.5010, lng: -116.9474, address: 'Parque Industrial Cuauhtémoc, Tijuana, BC',    employees: 880,  potential: 5, status: 'prospecto', notes: null },

  // ── Zona Industrial La Mesa — Tijuana ─────────────────────────────────
  { id: '43', name: 'Infineon Technologies (IR)',     sector: 'Electrónico',   lat: 32.5123, lng: -116.9612, address: 'Zona Industrial La Mesa, Tijuana, BC',         employees: 950,  potential: 4, status: 'prospecto', notes: null },
  { id: '44', name: 'Merit Medical Systems',          sector: 'Médico',        lat: 32.5138, lng: -116.9594, address: 'Zona Industrial La Mesa, Tijuana, BC',         employees: 700,  potential: 5, status: 'prospecto', notes: null },
  { id: '45', name: 'ISOSA Electrónica',              sector: 'Electrónico',   lat: 32.5112, lng: -116.9625, address: 'Zona Industrial La Mesa, Tijuana, BC',         employees: 320,  potential: 3, status: 'prospecto', notes: null },
  { id: '46', name: 'Vishay Intertechnology',         sector: 'Electrónico',   lat: 32.5148, lng: -116.9581, address: 'Zona Industrial La Mesa, Tijuana, BC',         employees: 600,  potential: 3, status: 'prospecto', notes: null },

  // ── Rosarito ──────────────────────────────────────────────────────────
  { id: '47', name: 'Fox Factory',                    sector: 'Metalmecánico', lat: 32.3698, lng: -117.0245, address: 'Parque Industrial Rosarito, BC',                employees: 420,  potential: 4, status: 'prospecto', notes: null },
  { id: '48', name: 'Cemex Planta Rosarito',          sector: 'Metalmecánico', lat: 32.3734, lng: -117.0198, address: 'Rosarito, BC',                                 employees: 280,  potential: 2, status: 'prospecto', notes: null },

  // ── Tecate ────────────────────────────────────────────────────────────
  { id: '49', name: 'Heineken México (Tecate)',       sector: 'Alimentos',     lat: 32.5742, lng: -116.6289, address: 'Tecate, BC',                                   employees: 950,  potential: 2, status: 'prospecto', notes: null },
  { id: '50', name: 'Border Pharma',                  sector: 'Médico',        lat: 32.5768, lng: -116.6312, address: 'Parque Industrial Tecate, BC',                 employees: 380,  potential: 4, status: 'prospecto', notes: null },
  { id: '51', name: 'Tecate Precision',               sector: 'Metalmecánico', lat: 32.5712, lng: -116.6345, address: 'Parque Industrial Tecate, BC',                 employees: 220,  potential: 3, status: 'prospecto', notes: null },

  // ── Mexicali ──────────────────────────────────────────────────────────
  { id: '52', name: 'Hitachi México',                 sector: 'Electrónico',   lat: 32.6245, lng: -115.4378, address: 'Parque Industrial El Mirador, Mexicali, BC',   employees: 2100, potential: 4, status: 'prospecto', notes: null },
  { id: '53', name: 'Daewoo Electronics',             sector: 'Electrónico',   lat: 32.6312, lng: -115.4521, address: 'Parque Industrial Mexicali, BC',               employees: 1600, potential: 3, status: 'prospecto', notes: null },
  { id: '54', name: 'Bosch Mexicali',                 sector: 'Automotriz',    lat: 32.6356, lng: -115.4412, address: 'Parque Industrial Calafia, Mexicali, BC',      employees: 3200, potential: 5, status: 'prospecto', notes: null },
  { id: '55', name: 'SMC Corporation',                sector: 'Metalmecánico', lat: 32.6289, lng: -115.4389, address: 'Parque Industrial El Mirador, Mexicali, BC',   employees: 750,  potential: 5, status: 'prospecto', notes: null },
  { id: '56', name: 'Siemens Mexicali',               sector: 'Eléctrico',     lat: 32.6221, lng: -115.4498, address: 'Parque Industrial Calafia, Mexicali, BC',      employees: 1100, potential: 5, status: 'prospecto', notes: null },
  { id: '57', name: 'Honeywell Mexicali',             sector: 'Metalmecánico', lat: 32.6178, lng: -115.4456, address: 'Parque Industrial Norte, Mexicali, BC',        employees: 890,  potential: 4, status: 'prospecto', notes: null },
  { id: '58', name: 'ABB México (Mexicali)',          sector: 'Eléctrico',     lat: 32.6334, lng: -115.4367, address: 'Parque Industrial Calafia, Mexicali, BC',      employees: 670,  potential: 5, status: 'prospecto', notes: null },
  { id: '59', name: 'Kenyon International',           sector: 'Metalmecánico', lat: 32.6267, lng: -115.4445, address: 'Mexicali, BC',                                 employees: 340,  potential: 3, status: 'prospecto', notes: null },
  { id: '60', name: 'Schneider Electric Mexicali',    sector: 'Eléctrico',     lat: 32.6198, lng: -115.4512, address: 'Parque Industrial Norte, Mexicali, BC',        employees: 1050, potential: 5, status: 'prospecto', notes: null },

  // ── Ensenada ──────────────────────────────────────────────────────────
  { id: '61', name: 'TDK de México',                  sector: 'Electrónico',   lat: 31.8712, lng: -116.5934, address: 'Parque Industrial Ensenada, BC',               employees: 1400, potential: 3, status: 'prospecto', notes: null },
  { id: '62', name: 'Baja Naval',                     sector: 'Metalmecánico', lat: 31.8623, lng: -116.5978, address: 'Ensenada, BC',                                 employees: 520,  potential: 3, status: 'prospecto', notes: null },
  { id: '63', name: 'Hussmann México',                sector: 'Metalmecánico', lat: 31.8689, lng: -116.5812, address: 'Parque Industrial Ensenada, BC',               employees: 780,  potential: 4, status: 'prospecto', notes: null },
]

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
const STATUS_LABELS = { prospecto: 'Prospecto', contactado: 'Contactado', calificado: 'Calificado', cliente: 'Cliente' }
const STATUS_COLORS = { prospecto: '#94a3b8', contactado: '#3b82f6', calificado: '#f59e0b', cliente: '#12A6CC' }

const TOOLTIP_ZOOM_THRESHOLD = 13

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
  useEffect(() => {
    if (plant) map.flyTo([plant.lat, plant.lng], 14, { duration: 0.8 })
  }, [plant, map])
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

  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [sector, setSector] = useState('Todos')
  const [minPotential, setMinPotential] = useState(0)
  const [selected, setSelected] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)
  const [editing, setEditing] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [zoom, setZoom] = useState(11)
  const sidebarRef = useRef(null)

  useEffect(() => {
    setPlants(MOCK_PLANTS)
    setLoading(false)
  }, [])

  const filtered = plants.filter(p => {
    if (sector !== 'Todos' && p.sector !== sector) return false
    if (p.potential < minPotential) return false
    return true
  })

  const handleMarkerClick = useCallback((plant) => {
    setSelected(plant)
    setFlyTarget(plant)
    setEditing(null)
    setTimeout(() => {
      const el = sidebarRef.current?.querySelector(`[data-plant-id="${plant.id}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

  const handleZoom = useCallback((z) => setZoom(z), [])
  const showLabels = zoom >= TOOLTIP_ZOOM_THRESHOLD

  const sectorCount = SECTORS.slice(1).reduce((acc, s) => {
    acc[s] = plants.filter(p => p.sector === s).length
    return acc
  }, {})

  return (
    <PortalLayout title="Mapa de Prospectos" subtitle="Plantas de manufactura en Baja California">
      <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 120px)', minHeight: 540, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--nds-border, #e2e8f0)' }}>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', zIndex: 999, fontSize: 14, color: '#64748b' }}>
              Cargando plantas…
            </div>
          )}

          {!loading && (
            <MapContainer
              center={[32.5149, -117.0382]}
              zoom={11}
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={19}
              />
              <ZoomTracker onZoom={handleZoom} />
              {flyTarget && <FlyToMarker plant={flyTarget} />}

              {filtered.map(plant => (
                <CircleMarker
                  key={plant.id}
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
                  {/* Tooltip permanente al hacer zoom-in */}
                  <Tooltip
                    permanent={showLabels}
                    direction="top"
                    offset={[0, -10]}
                    opacity={1}
                  >
                    <div style={{ minWidth: 140, maxWidth: 200 }}>
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
                      {plant.employees && (
                        <div style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>
                          {plant.employees.toLocaleString()} empleados
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <PotentialDots value={plant.potential} />
                        <span style={{ fontSize: 10, color: POTENTIAL_COLORS[plant.potential], fontWeight: 600 }}>
                          {POTENTIAL_LABELS[plant.potential]}
                        </span>
                      </div>
                    </div>
                  </Tooltip>

                  {/* Popup al hacer clic */}
                  <Popup>
                    <div style={{ minWidth: 210 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{plant.name}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: SECTOR_COLORS[plant.sector] || '#64748b', color: '#fff', fontWeight: 600 }}>
                          {plant.sector}
                        </span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: STATUS_COLORS[plant.status], color: '#fff', fontWeight: 600 }}>
                          {STATUS_LABELS[plant.status]}
                        </span>
                      </div>
                      {plant.address && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>{plant.address}</div>}
                      {plant.employees && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5 }}>{plant.employees.toLocaleString()} empleados</div>}
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        Potencial: <PotentialDots value={plant.potential} />
                        <span style={{ color: POTENTIAL_COLORS[plant.potential], fontWeight: 600 }}>{POTENTIAL_LABELS[plant.potential]}</span>
                      </div>
                      {plant.notes && <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic', marginBottom: 4 }}>{plant.notes}</div>}
                      {canEdit && (
                        <button
                          onClick={() => { setSelected(plant); setEditing(plant) }}
                          style={{ marginTop: 6, fontSize: 12, padding: '4px 12px', borderRadius: 6, background: '#12A6CC', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
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
          <div style={{ padding: '16px 16px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 10 }}>Filtros</div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Sector</label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: '#1e293b', cursor: 'pointer' }}
              >
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}{s !== 'Todos' && sectorCount[s] ? ` (${sectorCount[s]})` : ''}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Potencial mínimo: {POTENTIAL_LABELS[minPotential]}</label>
              <input
                type="range" min={0} max={5} value={minPotential}
                onChange={e => setMinPotential(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#12A6CC' }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', paddingBottom: 12 }}>
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
          <div ref={sidebarRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {filtered.length === 0 && !loading && (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Sin resultados para los filtros seleccionados.
              </div>
            )}
            {filtered.map(plant => (
              <button
                key={plant.id}
                data-plant-id={plant.id}
                onClick={() => handleMarkerClick(plant)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', border: 'none', cursor: 'pointer',
                  background: selected?.id === plant.id ? '#f0fbff' : 'transparent',
                  borderLeft: `3px solid ${selected?.id === plant.id ? '#12A6CC' : 'transparent'}`,
                  transition: 'background .15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', lineHeight: 1.3 }}>{plant.name}</div>
                  <PotentialDots value={plant.potential} />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 999, background: SECTOR_COLORS[plant.sector] || '#e2e8f0', color: '#fff', fontWeight: 600 }}>
                    {plant.sector}
                  </span>
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 999, background: '#f1f5f9', color: '#64748b' }}>
                    {STATUS_LABELS[plant.status] || plant.status}
                  </span>
                  {plant.employees && (
                    <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 999, background: '#f1f5f9', color: '#94a3b8' }}>
                      {plant.employees.toLocaleString()} emp.
                    </span>
                  )}
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
  const [status, setStatus] = useState(plant.status)
  const [notes, setNotes] = useState(plant.notes || '')

  const dirty = potential !== plant.potential || status !== plant.status || notes !== (plant.notes || '')

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#12A6CC', textTransform: 'uppercase', letterSpacing: '.05em' }}>Editar — {plant.name}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Potencial ({POTENTIAL_LABELS[potential]})</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map(v => (
            <button
              key={v}
              onClick={() => setPotential(v)}
              style={{
                width: 28, height: 28, borderRadius: 6, border: `2px solid ${potential === v ? POTENTIAL_COLORS[v] : '#e2e8f0'}`,
                background: potential === v ? POTENTIAL_COLORS[v] : '#fff',
                color: potential === v ? '#fff' : '#64748b',
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Estatus</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, background: '#fff' }}
        >
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Notas</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Contacto, oportunidad específica…"
        />
      </div>

      <button
        disabled={!dirty || saving}
        onClick={() => onSave({ potential, status, notes: notes || null })}
        style={{
          width: '100%', padding: '7px', borderRadius: 7, border: 'none', cursor: dirty && !saving ? 'pointer' : 'not-allowed',
          background: dirty && !saving ? '#12A6CC' : '#e2e8f0',
          color: dirty && !saving ? '#fff' : '#94a3b8',
          fontWeight: 700, fontSize: 13,
        }}
      >
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </div>
  )
}
