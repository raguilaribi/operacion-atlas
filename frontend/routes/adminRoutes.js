/**
 * Frontend - Admin Routes Configuration
 * Definicion de rutas protegidas del panel administrativo
 */

/**
 * Rutas disponibles solo para administradores
 */
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  AUDIT_LOG: '/admin/audit-log',
  SYSTEM_CONFIG: '/admin/config',
  SETTINGS: '/admin/settings',
  LOGS: '/admin/logs',
  REPORTS: '/admin/reports'
};

/**
 * Rutas disponibles para moderadores y administradores
 */
export const MODERATOR_ROUTES = {
  MODERATION: '/moderation',
  REPORTS: '/moderation/reports',
  WARNINGS: '/moderation/warnings'
};

/**
 * Rutas publicas (accesibles para cualquier usuario autenticado)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GAMES: '/games',
  LEADERBOARD: '/leaderboard'
};

/**
 * Rutas de autenticacion (sin proteccion)
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password'
};

/**
 * Mapeo de rutas por rol
 */
export const ROLE_ROUTES = {
  admin: [
    ...Object.values(ADMIN_ROUTES),
    ...Object.values(PUBLIC_ROUTES)
  ],
  moderator: [
    ...Object.values(MODERATOR_ROUTES),
    ...Object.values(PUBLIC_ROUTES)
  ],
  player: [
    ...Object.values(PUBLIC_ROUTES)
  ]
};

/**
 * Verificar si un usuario tiene acceso a una ruta
 */
export const canAccessRoute = (userRole, routePath) => {
  const allowedRoutes = ROLE_ROUTES[userRole] || [];
  return allowedRoutes.includes(routePath);
};

/**
 * Obtener rol minimo requerido para una ruta
 */
export const getRequiredRoleForRoute = (routePath) => {
  if (Object.values(ADMIN_ROUTES).includes(routePath)) {
    return 'admin';
  }
  if (Object.values(MODERATOR_ROUTES).includes(routePath)) {
    return 'moderator';
  }
  if (Object.values(PUBLIC_ROUTES).includes(routePath)) {
    return 'player';
  }
  return null;
};

/**
 * Configuracion de cada ruta admin
 */
export const ADMIN_ROUTE_CONFIG = {
  [ADMIN_ROUTES.DASHBOARD]: {
    title: 'Panel Administrativo',
    description: 'Dashboard principal del administrador',
    icon: '⚙️',
    requiresAuth: true,
    requiredRole: 'admin'
  },
  [ADMIN_ROUTES.USERS]: {
    title: 'Gestion de Usuarios',
    description: 'Administrar usuarios del sistema',
    icon: '👥',
    requiresAuth: true,
    requiredRole: 'admin'
  },
  [ADMIN_ROUTES.AUDIT_LOG]: {
    title: 'Registro de Auditoria',
    description: 'Historial de cambios en el sistema',
    icon: '📋',
    requiresAuth: true,
    requiredRole: 'admin'
  },
  [ADMIN_ROUTES.SYSTEM_CONFIG]: {
    title: 'Configuracion del Sistema',
    description: 'Parametros y configuracion global',
    icon: '⚙️',
    requiresAuth: true,
    requiredRole: 'admin'
  }
};

/**
 * Permisos por rol de administrador
 */
export const ADMIN_PERMISSIONS = {
  admin: [
    'view_users',
    'edit_users',
    'delete_users',
    'ban_users',
    'view_audit_log',
    'manage_config',
    'manage_moderators',
    'view_reports',
    'view_analytics'
  ],
  moderator: [
    'view_users',
    'ban_users',
    'view_audit_log',
    'view_reports'
  ],
  player: []
};

/**
 * Verificar si un usuario tiene un permiso especifico
 */
export const hasPermission = (userRole, permission) => {
  const permissions = ADMIN_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};
