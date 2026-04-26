import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import PortalLayout from '../../components/PortalLayout.jsx'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

const CATEGORY_LABELS = {
  bracket:  'Escuadra',
  t_nut:    'Tuerca T',
  screw:    'Tornillo',
  end_cap:  'Tapa',
}

const SERIES_OPTIONS = ['30', '40', '45']

// ── Helpers ───────────────────────────────────────────────────────────────────

function Badge({ active }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: '0.72rem',
      fontWeight: 600,
      background: active ? '#dcfce7' : '#fee2e2',
      color:      active ? '#166534' : '#991b1b',
    }}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

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

// ── Profile modal ─────────────────────────────────────────────────────────────

function ProfileModal({ providerId, profile, onSave, onClose }) {
  const { getToken } = useAuth()
  const editing = Boolean(profile)
  const [form, setForm] = useState({
    series:          profile?.series          ?? '40',
    sizeMm:          profile?.sizeMm          ?? '',
    weightKgM:       profile?.weightKgM       ?? '',
    grooveWidthMm:   profile?.grooveWidthMm   ?? '',
    grooveDepthMm:   profile?.grooveDepthMm   ?? '',
    cornerRadiusMm:  profile?.cornerRadiusMm  ?? '',
    wallThicknessMm: profile?.wallThicknessMm ?? '',
    priceMxnM:       profile?.priceMxnM       ?? '',
    maxLoadNM:       profile?.maxLoadNM       ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const token = await getToken()
      const url = editing
        ? `${API}/api/catalog/profiles/${profile.id}`
        : `${API}/api/catalog/profiles`
      const r = await fetch(url, {
        method:  editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(editing ? form : { ...form, providerId }),
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error) }
      onSave()
    } catch (e) {
      setErr(e.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="portal-card" style={{ width: 480, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16, color: 'var(--nds-teal-deep)' }}>
          {editing ? 'Editar perfil' : 'Nuevo perfil'}
        </h3>
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {!editing && (
            <div style={{ gridColumn: '1/-1' }}>
              <FieldRow label="Serie">
                <select className="dp-input" value={form.series} onChange={set('series')}>
                  {SERIES_OPTIONS.map(s => <option key={s} value={s}>Serie {s}</option>)}
                </select>
              </FieldRow>
            </div>
          )}
          {[
            ['sizeMm',          'Tamaño sección (mm)'],
            ['weightKgM',       'Peso (kg/m)'],
            ['grooveWidthMm',   'Ancho ranura (mm)'],
            ['grooveDepthMm',   'Prof. ranura (mm)'],
            ['cornerRadiusMm',  'Radio esquina (mm)'],
            ['wallThicknessMm', 'Espesor pared (mm)'],
            ['priceMxnM',       'Precio (MXN/m)'],
            ['maxLoadNM',       'Carga máx. (N/m)'],
          ].map(([k, lbl]) => (
            <FieldRow key={k} label={lbl}>
              <input className="dp-input" type="number" step="any" required value={form[k]} onChange={set(k)} />
            </FieldRow>
          ))}
          {err && <p className="portal-error" style={{ gridColumn: '1/-1' }}>{err}</p>}
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
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

// ── Accessory modal ───────────────────────────────────────────────────────────

function AccessoryModal({ providerId, acc, onSave, onClose }) {
  const { getToken } = useAuth()
  const editing = Boolean(acc)
  const [form, setForm] = useState({
    sku:              acc?.sku              ?? '',
    name:             acc?.name             ?? '',
    category:         acc?.category         ?? 'bracket',
    compatibleSeries: acc?.compatibleSeries ?? [],
    priceMxn:         acc?.priceMxn         ?? '',
    tNutsRequired:    acc?.tNutsRequired    ?? '',
    screwsRequired:   acc?.screwsRequired   ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggleSeries = (s) => setForm(f => ({
    ...f,
    compatibleSeries: f.compatibleSeries.includes(s)
      ? f.compatibleSeries.filter(x => x !== s)
      : [...f.compatibleSeries, s],
  }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const token = await getToken()
      const payload = {
        ...form,
        priceMxn:      Number(form.priceMxn),
        tNutsRequired: form.tNutsRequired !== '' ? Number(form.tNutsRequired) : null,
        screwsRequired: form.screwsRequired !== '' ? Number(form.screwsRequired) : null,
      }
      const url = editing
        ? `${API}/api/catalog/accessories/${acc.id}`
        : `${API}/api/catalog/accessories`
      const r = await fetch(url, {
        method:  editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(editing ? payload : { ...payload, providerId }),
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error) }
      onSave()
    } catch (e) {
      setErr(e.message || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="portal-card" style={{ width: 480, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16, color: 'var(--nds-teal-deep)' }}>
          {editing ? 'Editar accesorio' : 'Nuevo accesorio'}
        </h3>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="SKU">
              <input className="dp-input" required value={form.sku} onChange={set('sku')} disabled={editing} />
            </FieldRow>
            <FieldRow label="Categoría">
              <select className="dp-input" value={form.category} onChange={set('category')}>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </FieldRow>
          </div>
          <FieldRow label="Nombre">
            <input className="dp-input" required value={form.name} onChange={set('name')} />
          </FieldRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <FieldRow label="Precio (MXN)">
              <input className="dp-input" type="number" step="any" required value={form.priceMxn} onChange={set('priceMxn')} />
            </FieldRow>
            <FieldRow label="Tuercas T req.">
              <input className="dp-input" type="number" value={form.tNutsRequired} onChange={set('tNutsRequired')} placeholder="—" />
            </FieldRow>
            <FieldRow label="Tornillos req.">
              <input className="dp-input" type="number" value={form.screwsRequired} onChange={set('screwsRequired')} placeholder="—" />
            </FieldRow>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--nds-muted)' }}>Series compatibles</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              {SERIES_OPTIONS.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.compatibleSeries.includes(s)} onChange={() => toggleSeries(s)} />
                  <span>Serie {s}</span>
                </label>
              ))}
            </div>
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

export default function PortalCatalog() {
  const { getToken } = useAuth()
  const [providers, setProviders] = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('profiles')   // 'profiles' | 'accessories'
  const [activeProvider, setActiveProvider] = useState(null)

  // Modal state
  const [profileModal, setProfileModal]   = useState(null)  // null | 'new' | profileObj
  const [accModal, setAccModal]           = useState(null)  // null | 'new' | accObj

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`${API}/api/catalog/providers`)
      const data = await r.json()
      setProviders(data)
      setActiveProvider(p => p ?? data[0]?.id ?? null)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleProfile(id, active) {
    const token = await getToken()
    await fetch(`${API}/api/catalog/profiles/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ active: !active }),
    })
    load()
  }

  async function toggleAcc(id, active) {
    const token = await getToken()
    await fetch(`${API}/api/catalog/accessories/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ active: !active }),
    })
    load()
  }

  const provider = providers.find(p => p.id === activeProvider)

  return (
    <PortalLayout>
      <div className="portal-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 className="portal-section-title" style={{ marginBottom: 4 }}>Catálogo de perfilería</h2>
            <p style={{ color: 'var(--nds-muted)', fontSize: '0.9rem' }}>
              Gestión de perfiles y accesorios por proveedor
            </p>
          </div>
        </div>

        {/* Provider tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={activeProvider === p.id ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '6px 16px' }}
            >
              {p.name}
              {!p.active && <span style={{ marginLeft: 6, opacity: 0.6 }}>(inactivo)</span>}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--nds-muted)' }}>Cargando…</p>}

        {!loading && provider && (
          <>
            {/* Section toggle */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid var(--nds-border)' }}>
              {[['profiles', 'Perfiles'], ['accessories', 'Accesorios']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '8px 20px', fontWeight: 600, fontSize: '0.95rem',
                    color: tab === key ? 'var(--nds-teal)' : 'var(--nds-muted)',
                    borderBottom: tab === key ? '2px solid var(--nds-teal)' : '2px solid transparent',
                    marginBottom: -2,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Profiles tab ── */}
            {tab === 'profiles' && (
              <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--nds-border)' }}>
                  <span style={{ fontWeight: 600 }}>Perfiles — {provider.name}</span>
                  <button className="btn-primary" style={{ padding: '5px 14px', fontSize: '0.85rem' }}
                    onClick={() => setProfileModal('new')}>
                    + Agregar serie
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--nds-bg)' }}>
                      {['Serie','Tamaño','Peso kg/m','Ranura mm','Precio MXN/m','Carga N/m','Estado',''].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--nds-muted)', fontSize: '0.8rem', borderBottom: '1px solid var(--nds-border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {provider.profiles.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: '20px 14px', color: 'var(--nds-muted)', textAlign: 'center' }}>Sin perfiles registrados</td></tr>
                    )}
                    {provider.profiles.map(pr => (
                      <tr key={pr.id} style={{ borderBottom: '1px solid var(--nds-border)' }}>
                        <td style={{ padding: '9px 14px', fontWeight: 700 }}>Serie {pr.series}</td>
                        <td style={{ padding: '9px 14px' }}>{pr.sizeMm}×{pr.sizeMm} mm</td>
                        <td style={{ padding: '9px 14px' }}>{pr.weightKgM}</td>
                        <td style={{ padding: '9px 14px' }}>{pr.grooveWidthMm}</td>
                        <td style={{ padding: '9px 14px' }}>${pr.priceMxnM}</td>
                        <td style={{ padding: '9px 14px' }}>{pr.maxLoadNM.toLocaleString()}</td>
                        <td style={{ padding: '9px 14px' }}><Badge active={pr.active} /></td>
                        <td style={{ padding: '9px 14px', display: 'flex', gap: 6 }}>
                          <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                            onClick={() => setProfileModal(pr)}>Editar</button>
                          <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                            onClick={() => toggleProfile(pr.id, pr.active)}>
                            {pr.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Accessories tab ── */}
            {tab === 'accessories' && (
              <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--nds-border)' }}>
                  <span style={{ fontWeight: 600 }}>Accesorios — {provider.name}</span>
                  <button className="btn-primary" style={{ padding: '5px 14px', fontSize: '0.85rem' }}
                    onClick={() => setAccModal('new')}>
                    + Agregar accesorio
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--nds-bg)' }}>
                      {['SKU','Nombre','Categoría','Series','Precio MXN','Estado',''].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--nds-muted)', fontSize: '0.8rem', borderBottom: '1px solid var(--nds-border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {provider.accessories.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: '20px 14px', color: 'var(--nds-muted)', textAlign: 'center' }}>Sin accesorios registrados</td></tr>
                    )}
                    {provider.accessories.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--nds-border)' }}>
                        <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.sku}</td>
                        <td style={{ padding: '9px 14px' }}>{a.name}</td>
                        <td style={{ padding: '9px 14px' }}>{CATEGORY_LABELS[a.category] ?? a.category}</td>
                        <td style={{ padding: '9px 14px' }}>{a.compatibleSeries.join(', ')}</td>
                        <td style={{ padding: '9px 14px' }}>${a.priceMxn}</td>
                        <td style={{ padding: '9px 14px' }}><Badge active={a.active} /></td>
                        <td style={{ padding: '9px 14px', display: 'flex', gap: 6 }}>
                          <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                            onClick={() => setAccModal(a)}>Editar</button>
                          <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                            onClick={() => toggleAcc(a.id, a.active)}>
                            {a.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {profileModal && (
        <ProfileModal
          providerId={activeProvider}
          profile={profileModal === 'new' ? null : profileModal}
          onSave={() => { setProfileModal(null); load() }}
          onClose={() => setProfileModal(null)}
        />
      )}
      {accModal && (
        <AccessoryModal
          providerId={activeProvider}
          acc={accModal === 'new' ? null : accModal}
          onSave={() => { setAccModal(null); load() }}
          onClose={() => setAccModal(null)}
        />
      )}
    </PortalLayout>
  )
}
