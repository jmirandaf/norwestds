import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { COURSES } from '../../data/courses'
import '../../styles/lms.css'

function LMSIcon({ children }) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function LMSLayout({ title, subtitle, children }) {
  const { userData, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="nds-lms-shell">
      {/* Mobile backdrop */}
      <div
        className={`nds-lms-backdrop${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside className={`nds-lms-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="nds-lms-topbar">
          <Link to="/" className="nds-lms-logo" onClick={closeMobile}>
            <img src="/logo.png" alt="NDS" onError={e => { e.target.style.display = 'none' }} />
            <span className="nds-lms-logo-text">NDS</span>
            <span className="nds-lms-logo-badge">Academy</span>
          </Link>
          <button
            className="nds-lms-burger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        <div className="nds-lms-user">
          <div className="nds-lms-user-avatar">
            {(userData?.displayName?.[0] || 'E').toUpperCase()}
          </div>
          <div>
            <div className="nds-lms-user-name">{userData?.displayName || 'Estudiante'}</div>
            <div className="nds-lms-user-role">Estudiante</div>
          </div>
        </div>

        <nav className={`nds-lms-nav${mobileOpen ? ' mobile-open' : ''}`}>
          <div className="nds-lms-nav-label">Navegación</div>

          <NavLink
            to="/lms"
            end
            onClick={closeMobile}
            className={({ isActive }) => `nds-lms-nav-link${isActive ? ' active' : ''}`}
          >
            <LMSIcon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></LMSIcon>
            Mis cursos
          </NavLink>

          <div className="nds-lms-nav-divider" />
          <div className="nds-lms-nav-label">Catálogo</div>

          {COURSES.map(course => (
            <NavLink
              key={course.id}
              to={`/lms/course/${course.id}`}
              onClick={closeMobile}
              className={({ isActive }) => `nds-lms-nav-link nds-lms-nav-link--course${isActive ? ' active' : ''}`}
            >
              <span className="nds-lms-course-dot" style={{ background: course.color }} />
              <span className="nds-lms-nav-course-title">{course.title}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className={`nds-lms-logout${mobileOpen ? ' mobile-open' : ''}`}
          onClick={() => { closeMobile(); logout() }}
        >
          <LMSIcon>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </LMSIcon>
          Cerrar sesión
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="nds-lms-main">
        {(title || subtitle) && (
          <div className="nds-lms-header">
            {title && <h1 className="nds-lms-header-title">{title}</h1>}
            {subtitle && <p className="nds-lms-header-sub">{subtitle}</p>}
          </div>
        )}
        <div className="nds-lms-content">
          {children}
        </div>
      </main>
    </div>
  )
}
