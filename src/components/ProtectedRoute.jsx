import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#004C71'
      }}>
        Cargando...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Si se especifican roles permitidos, verificar acceso
  if (allowedRoles.length > 0 && userData) {
    if (!allowedRoles.includes(userData.role)) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#c33' }}>Acceso Denegado</h1>
          <p>No tienes permisos para acceder a esta página.</p>
          <a href="/dashboard" style={{ color: '#00A7E1', marginTop: '16px' }}>
            Volver al Dashboard
          </a>
        </div>
      );
    }
  }

  return children;
}
