import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import PortalLayout from '../../components/PortalLayout.jsx'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

const CATEGORY_OPTIONS = [
  'aluminio', 'vidrio', 'acero', 'plastico', 'electrico', 'neumatico', 'otro',
]
const UNIT_OPTIONS = ['pza', 'm', 'm²', 'kg', 'lt', 'juego']

function FieldRow({ label, children }) {
  return (
    <label className="portal-field" style={{ marginBottom: 0 }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--nds-muted)', display: 'block', marginBottom: 2 }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 600,
      background: active ? '#dcfce7' : '#fee2e2',
      color:      active ? '#166534' : '#991b1b',
    }}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function MaterialModal({ material, onSave, onClose }) {
  const { getToken } = useAuth()
  const editing = Boolean(material)
  const [form, setForm] = useState({
    sku:      material?.sku      ?? '',
    name:     material?.name     ?? '',
    category: material?.category ?? 'otro',
    unit:     material?.unit     ?? 'pza',
    priceMxn: material?.priceMxn ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const token = await getToken()
      const url = editing
        ? `${API}/api/materials/${material.id}`
        : `${API}/api/materials`
      const r = await fetch(url, {
        method:  editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ ...form, priceMxn: Number(form.priceMxn) }),
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error) }
      onSave()
    } catch (e) {
      setErr(e.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="portal-card" style={{ width: 440, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16, color: 'var(--nds-teal-deep)' }}>
          {editing ? 'Editar material' : 'Nuevo material'}
        </h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="SKU">
              <input className="dp-input" required value={form.sku} onChange={set('sku')} disabled={editing} />
            </FieldRow>
            <FieldRow label="Categoría">
              <select className="dp-input" value={form.category} onChange={set('category')}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldRow>
          </div>
          <FieldRow label="Nombre / descripción">
            <input className="dp-input" required value={form.name} onChange={set('name')} />
          </FieldRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="Precio (MXN)">
              <input className="dp-input" type="number" step="any" min="0" required
                value={form.priceMxn} onChange={set('priceMxn')} />
            </FieldRow>
            <FieldRow label="Unidad">
              <select className="dp-input" value={form.unit} onChange={set('unit')}>
                {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </FieldRow>
          </div>
          {err && <p className="portal-error">{err}</p>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PortalPrices() {
  const { getToken } = useAuth()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading]     = useState(true)
  const [loadErr, setLoadErr]     = useState('')
  const [modal, setModal]         = useState(null)  // null | 'new' | materialObj

  const load = useCallback(async () => {
    setLoading(true); setLoadErr('')
    try {
      const token = await getToken()
      const r = await fetch(`${API}/api/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`)
      setMaterials(Array.isArray(data) ? data : [])
    } catch (e) {
      setLoadErr(e.message || 'Error al cargar')
    } finally { setLoading(false) }
  }, [getToken])

  useEffect(() => { load() }, [load])

  async function toggle(id, active) {
    const token = await getToken()
    await fetch(`${API}/api/materials/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ active: !active }),
    })
    load()
  }

  return (
    <PortalLayout>
      <div className="portal-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 className="portal-section-title" style={{ marginBottom: 4 }}>Precios de materiales</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '0.9rem' }}>
              Materiales adicionales disponibles para cotizaciones
            </p>
          </div>
          <button className="btn-primary" onClick={() => setModal('new')}>+ Nuevo material</button>
        </div>

        {loading && <p style={{ color: 'var(--nds-muted)' }}>Cargando…</p>}

        {loadErr && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: '0.9rem' }}>
            <strong>Error:</strong> {loadErr}
          </div>
        )}

        {!loading && !loadErr && (
          <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--nds-bg)' }}>
                  {['SKU', 'Nombre', 'Categoría', 'Unidad', 'Precio MXN', 'Estado', ''].map(h => (
                    <th key={h} style={{
                      padding: '8px 14px', textAlign: 'left', fontWeight: 600,
                      color: 'var(--nds-muted)', fontSize: '0.8rem',
                      borderBottom: '1px solid var(--nds-border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materials.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '20px 14px', color: 'var(--nds-muted)', textAlign: 'center' }}>
                      Sin materiales registrados. Agrega el primero con "+ Nuevo material".
                    </td>
                  </tr>
                )}
                {materials.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--nds-border)' }}>
                    <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: '0.82rem' }}>{m.sku}</td>
                    <td style={{ padding: '9px 14px' }}>{m.name}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--nds-muted)' }}>{m.category}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--nds-muted)' }}>{m.unit}</td>
                    <td style={{ padding: '9px 14px', fontWeight: 600 }}>${m.priceMxn.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '9px 14px' }}><Badge active={m.active} /></td>
                    <td style={{ padding: '9px 14px', display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                        onClick={() => setModal(m)}>Editar</button>
                      <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                        onClick={() => toggle(m.id, m.active)}>
                        {m.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <MaterialModal
          material={modal === 'new' ? null : modal}
          onSave={() => { setModal(null); load() }}
          onClose={() => setModal(null)}
        />
      )}
    </PortalLayout>
  )
}
