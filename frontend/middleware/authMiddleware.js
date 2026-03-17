/**
 * Frontend - Authentication Middleware
 * Proteccion de rutas y verificacion de tokens
 */

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

/**
 * Hook para verificar autenticacion
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          setIsAuthenticated(false);
          return;
        }

        // Verificar que el token sea valido haciendo una llamada a la API
        const response = await api.get('/users/profile');
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error verificando autenticacion:', error);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return { user, loading, isAuthenticated };
};

/**
 * Hook para verificar rol de administrador
 */
export const useAdminAuth = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user, router]);

  return { user, loading, isAdmin: user?.role === 'admin' };
};

/**
 * Hook para verificar rol de moderador o administrador
 */
export const useModeratorAuth = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'moderator'))) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, user, router]);

  return { user, loading, isModerator: user?.role === 'admin' || user?.role === 'moderator' };
};

/**
 * Componente HOC para proteger rutas admin
 */
export const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, isAdmin } = useAdminAuth();

    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#e0e0e0'
        }}>
          <div>Verificando autorizacion...</div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#e0e0e0'
        }}>
          <div>No tienes permisos para acceder a esta area</div>
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

/**
 * Componente HOC para proteger rutas de moderadores
 */
export const withModeratorAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, isModerator } = useModeratorAuth();

    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#e0e0e0'
        }}>
          <div>Verificando autorizacion...</div>
        </div>
      );
    }

    if (!isModerator) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#e0e0e0'
        }}>
          <div>No tienes permisos para acceder a esta area</div>
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

/**
 * Hook para logout
 */
export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return logout;
};

/**
 * Verificar si usuario tiene acceso a ruta especifica
 */
export const hasAccess = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};
