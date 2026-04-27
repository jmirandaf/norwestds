import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import PortalLayout from '../../components/PortalLayout.jsx'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

const STATUS_LABEL = {
  draft:    { label: 'Borrador',  bg: '#f1f5f9', color: '#475569' },
  sent:     { label: 'Enviada',   bg: '#dbeafe', color: '#1d4ed8' },
  accepted: { label: 'Aceptada', bg: '#dcfce7', color: '#166534' },
  rejected: { label: 'Rechazada',bg: '#fee2e2', color: '#991b1b' },
}

const TYPE_LABEL = { profile: 'Perfil', accessory: 'Accesorio', material: 'Material' }

function StatusBadge({ status }) {
  const s = STATUS_LABEL[status] || STATUS_LABEL.draft
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  )
}

function fmt(n) {
  return Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Quote detail panel ────────────────────────────────────────────────────────

function QuoteDetail({ quote }) {
  const items = Array.isArray(quote.items) ? quote.items : []
  const date  = new Date(quote.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="portal-card" style={{ marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}>
      {/* Print header (only visible on print) */}
      <div className="print-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#071e30' }}>NORWEST DYNAMIC SYSTEMS</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Cotización preliminar — {date}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b' }}>
            <div>Folio: {quote.id.slice(-8).toUpperCase()}</div>
            <div>Estado: {STATUS_LABEL[quote.status]?.label}</div>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--nds-bg)' }}>
            {['Tipo', 'SKU / Código', 'Descripción', 'Cant.', 'Unidad', 'Precio unit.', 'Total'].map(h => (
              <th key={h} style={{
                padding: '7px 12px', textAlign: 'left', fontWeight: 600,
                color: 'var(--nds-muted)', fontSize: '0.78rem',
                borderBottom: '1px solid var(--nds-border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--nds-border)' }}>
              <td style={{ padding: '8px 12px', color: 'var(--nds-muted)', fontSize: '0.78rem' }}>
                {TYPE_LABEL[item.type] ?? item.type}
              </td>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                {item.sku ?? '—'}
              </td>
              <td style={{ padding: '8px 12px' }}>{item.description}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{fmt(item.qty)}</td>
              <td style={{ padding: '8px 12px', color: 'var(--nds-muted)' }}>{item.unit}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>${fmt(item.unitPrice)}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>${fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
              Total estimado (sin IVA):
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--nds-teal-deep)' }}>
              ${fmt(quote.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {quote.notes && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--nds-border)', color: 'var(--nds-muted)', fontSize: '0.85rem' }}>
          <strong>Notas:</strong> {quote.notes}
        </div>
      )}

      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--nds-border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => window.print()}>
          Imprimir / PDF
        </button>
      </div>

      <p style={{ padding: '0 14px 12px', color: 'var(--nds-muted)', fontSize: '0.78rem' }}>
        * Cotización preliminar basada en precios de catálogo actuales. Los precios finales pueden variar según disponibilidad y condiciones comerciales.
      </p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PortalQuotes() {
  const { getToken } = useAuth()
  const [quotes, setQuotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setLoadErr('')
    try {
      const token = await getToken()
      const r = await fetch(`${API}/api/quotes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`)
      setQuotes(Array.isArray(data) ? data : [])
    } catch (e) {
      setLoadErr(e.message || 'Error al cargar cotizaciones')
    } finally { setLoading(false) }
  }, [getToken])

  useEffect(() => { load() }, [load])

  return (
    <PortalLayout>
      <div className="portal-section" id="quotes-print-area">
        <div style={{ marginBottom: 20 }}>
          <h2 className="portal-section-title" style={{ marginBottom: 4 }}>Mis cotizaciones</h2>
          <p style={{ color: 'var(--nds-muted)', fontSize: '0.9rem' }}>
            Cotizaciones preliminares generadas desde DesignPro
          </p>
        </div>

        {loading && <p style={{ color: 'var(--nds-muted)' }}>Cargando…</p>}

        {loadErr && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: '0.9rem', marginBottom: 16 }}>
            <strong>Error:</strong> {loadErr}
          </div>
        )}

        {!loading && !loadErr && quotes.length === 0 && (
          <div className="portal-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--nds-muted)' }}>
            No tienes cotizaciones aún. Genera una desde <strong>DesignPro</strong> al completar un diseño.
          </div>
        )}

        {!loading && quotes.map(q => {
          const date = new Date(q.createdAt).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
          const isOpen = expanded === q.id
          return (
            <div key={q.id} style={{ marginBottom: 12 }}>
              {/* Row header */}
              <button
                onClick={() => setExpanded(isOpen ? null : q.id)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none',
                  border: '1px solid var(--nds-border)', borderRadius: isOpen ? '8px 8px 0 0' : 8,
                  padding: '14px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  backgroundColor: 'var(--nds-card)',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--nds-muted)', flexShrink: 0 }}>
                  #{q.id.slice(-8).toUpperCase()}
                </span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                  Job {q.jobId.slice(-8).toUpperCase()}
                </span>
                <span style={{ color: 'var(--nds-muted)', fontSize: '0.85rem', flexShrink: 0 }}>{date}</span>
                <StatusBadge status={q.status} />
                <span style={{ fontWeight: 700, color: 'var(--nds-teal-deep)', flexShrink: 0 }}>
                  ${fmt(q.total)} MXN
                </span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isOpen && <QuoteDetail quote={q} />}
            </div>
          )
        })}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .nds-portal-sidebar, .nds-portal-topbar, .nds-portal-burger,
          .nds-portal-logout, button.btn-ghost { display: none !important; }
          .print-header { display: block !important; }
          .nds-portal-main { margin: 0 !important; padding: 0 !important; }
          .portal-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>
    </PortalLayout>
  )
}
