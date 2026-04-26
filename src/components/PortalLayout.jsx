import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PORTAL_NAV = [
  {
    to: '/portal', end: true, label: 'Inicio',
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
  },
  {
    to: '/portal/projects', label: 'Proyectos',
    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
  },
  {
    to: '/portal/schedule', label: 'Cronograma',
    icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  },
  {
    to: '/portal/downloads', label: 'Descargas',
    icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  },
  {
    to: '/portal/support', label: 'Soporte',
    icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  },
]

const TOOLS_NAV = [
  {
    to: '/portal/designpro', label: 'DesignPro',
    icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  },
  {
    to: '/portal/roi', label: 'Calc. ROI',
    icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  },
  {
    to: '/portal/safety', label: 'Safety / PL',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  },
]

function NavIcon({ d }) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {d}
    </svg>
  )
}

export default function PortalLayout({ title, subtitle, children }) {
  const { userData, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)
  const toggleMobile = () => setMobileOpen(o => !o)

  return (
    <div className="nds-portal-shell">
      {/* Mobile backdrop */}
      <div
        className={`nds-portal-backdrop${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside className="nds-portal-sidebar">
        {/* Top bar: logo + burger */}
        <div className="nds-portal-topbar">
          <NavLink to="/" className="nds-portal-logo" onClick={closeMobile}>
            <img src="/logo.png" alt="NDS" onError={e => { e.target.style.display = 'none' }} />
            <span className="nds-portal-logo-text">NDS</span>
            <span className="nds-portal-logo-badge">Portal</span>
          </NavLink>

          <button
            className="nds-portal-burger"
            onClick={toggleMobile}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        <div className="nds-portal-user">
          <div className="nds-portal-user-name">{userData?.displayName || 'Usuario'}</div>
          <div className="nds-portal-user-role">{userData?.role || 'client'}</div>
        </div>

        <nav className={`nds-portal-nav${mobileOpen ? ' mobile-open' : ''}`}>
          {/* ── Portal section ── */}
          <div className="nds-portal-nav-section-label">Portal</div>
          {PORTAL_NAV.map(({ to, end, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobile}
              className={({ isActive }) => `nds-portal-nav-link${isActive ? ' active' : ''}`}
            >
              <NavIcon d={icon} />
              {label}
            </NavLink>
          ))}

          {/* ── Herramientas section ── */}
          <div className="nds-portal-nav-divider" />
          <div className="nds-portal-nav-section-label">Herramientas</div>
          {TOOLS_NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) => `nds-portal-nav-link nds-portal-nav-link--tool${isActive ? ' active' : ''}`}
            >
              <NavIcon d={icon} />
              {label}
              <span className="nds-portal-tool-badge">Pro</span>
            </NavLink>
          ))}

          {/* ── Admin section ── */}
          {userData?.role === 'admin' && (
            <>
              <div className="nds-portal-nav-divider" />
              <div className="nds-portal-nav-section-label">Admin</div>
              <NavLink
                to="/lms"
                onClick={closeMobile}
                className={({ isActive }) => `nds-portal-nav-link${isActive ? ' active' : ''}`}
              >
                <NavIcon d={<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>} />
                Academia
              </NavLink>
              <NavLink
                to="/portal/admin/catalogo"
                onClick={closeMobile}
                className={({ isActive }) => `nds-portal-nav-link${isActive ? ' active' : ''}`}
              >
                <NavIcon d={<><path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/></>} />
                Catálogo
              </NavLink>
              <NavLink
                to="/portal/admin/invites"
                onClick={closeMobile}
                className={({ isActive }) => `nds-portal-nav-link${isActive ? ' active' : ''}`}
              >
                <NavIcon d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>} />
                Invitaciones
              </NavLink>
            </>
          )}
        </nav>

        <button
          className={`nds-portal-logout${mobileOpen ? ' mobile-open' : ''}`}
          onClick={() => { closeMobile(); logout(); }}
        >
          <NavIcon d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />
          Cerrar sesión
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="nds-portal-main">
        {(title || subtitle) && (
          <div className="nds-portal-header">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className="nds-portal-content">
          {children}
        </div>
      </main>
    </div>
  )
}
