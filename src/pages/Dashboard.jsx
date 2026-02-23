import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderDashboardContent = () => {
    if (!userData) return null;

    switch (userData.role) {
      case 'admin':
        return (
          <div className="dashboard-content">
            <h2>Panel de Administrador</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>👥 Gestión de Usuarios</h3>
                <p>Administra usuarios, roles y permisos</p>
                <button className="card-button" onClick={() => navigate('/portal/admin/invites')}>Ver Usuarios</button>
              </div>
              <div className="dashboard-card">
                <h3>📁 Proyectos</h3>
                <p>Todos los proyectos de la empresa</p>
                <button className="card-button" onClick={() => navigate('/portal/projects')}>Ver Proyectos</button>
              </div>
              <div className="dashboard-card">
                <h3>📊 Estadísticas</h3>
                <p>Reportes y métricas generales</p>
                <button className="card-button" onClick={() => navigate('/portal')}>Ver Reportes</button>
              </div>
            </div>
          </div>
        );

      case 'pm':
        return (
          <div className="dashboard-content">
            <h2>Panel de Project Manager</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>📋 Mis Proyectos</h3>
                <p>Proyectos asignados a tu gestión</p>
                <button className="card-button" onClick={() => navigate('/portal/projects')}>Ver Proyectos</button>
              </div>
              <div className="dashboard-card">
                <h3>👤 Clientes</h3>
                <p>Gestiona tus clientes</p>
                <button className="card-button" onClick={() => navigate('/portal')}>Ver Clientes</button>
              </div>
              <div className="dashboard-card">
                <h3>📄 Documentación</h3>
                <p>Sube y gestiona documentos</p>
                <button className="card-button" onClick={() => navigate('/portal/downloads')}>Ver Documentos</button>
              </div>
            </div>
          </div>
        );

      case 'client':
        return (
          <div className="dashboard-content">
            <h2>Panel de Cliente</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>🔧 Mis Proyectos</h3>
                <p>Proyectos contratados</p>
                <button className="card-button" onClick={() => navigate('/portal/projects')}>Ver Proyectos</button>
              </div>
              <div className="dashboard-card">
                <h3>📥 Descargas</h3>
                <p>Documentos y archivos disponibles</p>
                <button className="card-button" onClick={() => navigate('/portal/downloads')}>Ver Archivos</button>
              </div>
              <div className="dashboard-card">
                <h3>💬 Soporte</h3>
                <p>Contacta con tu Project Manager</p>
                <button className="card-button" onClick={() => navigate('/portal/support')}>Contactar</button>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Rol no reconocido</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <img src="/logo.png" alt="Norwest DS" className="dashboard-logo" />
            <h1>Dashboard</h1>
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{userData?.displayName || currentUser?.email}</span>
              <span className="user-role">
                {userData?.role === 'admin' && '👑 Administrador'}
                {userData?.role === 'pm' && '📊 Project Manager'}
                {userData?.role === 'client' && '👤 Cliente'}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Bienvenido, {userData?.displayName || 'Usuario'}</h2>
          <p>Email: {currentUser?.email}</p>
        </div>

        {renderDashboardContent()}
      </main>
    </div>
  );
}
