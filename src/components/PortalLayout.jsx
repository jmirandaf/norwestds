import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/portal', label: 'Inicio', end: true },
  { to: '/portal/projects', label: 'Proyectos' },
  { to: '/portal/schedule', label: 'Schedule' },
  { to: '/portal/designpro', label: 'DesignPro' },
]

export default function PortalLayout({ title, subtitle, children }) {
  const { userData } = useAuth()

  return (
    <div className='portal-shell'>
      <div className='portal-topbar'>
        <div>
          <h1 className='portal-brand'>Portal NDS</h1>
          <p className='portal-user'>
            {userData?.displayName || 'Usuario'} · {userData?.role || 'client'}
          </p>
        </div>

        <nav className='portal-nav'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `portal-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          {userData?.role === 'admin' && (
            <NavLink to='/portal/admin/invites' className={({ isActive }) => `portal-nav-link ${isActive ? 'active' : ''}`}>
              Invitaciones
            </NavLink>
          )}
        </nav>
      </div>

      <div className='portal-header'>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {children}
    </div>
  )
}
