/**
 * Backend - Admin Routes
 * Rutas administrativas: gestion de usuarios, auditoria, configuracion
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/errors');
const { authorizeAdmin } = require('../utils/auth');
const adminController = require('../controllers/adminController');

// Todos los endpoints de admin requieren rol admin
router.use(authorizeAdmin);

/**
 * GET /api/v1/admin/users
 * Listar todos los usuarios
 */
router.get('/users', asyncHandler(adminController.listUsers));

/**
 * GET /api/v1/admin/users/:id
 * Obtener detalles de usuario
 */
router.get('/users/:id', asyncHandler(adminController.getUserDetails));

/**
 * PUT /api/v1/admin/users/:id
 * Editar usuario
 */
router.put('/users/:id', asyncHandler(adminController.updateUser));

/**
 * DELETE /api/v1/admin/users/:id
 * Eliminar usuario
 */
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

/**
 * POST /api/v1/admin/users/:id/ban
 * Banear usuario
 */
router.post('/users/:id/ban', asyncHandler(adminController.banUser));

/**
 * POST /api/v1/admin/users/:id/unban
 * Desbanear usuario
 */
router.post('/users/:id/unban', asyncHandler(adminController.unbanUser));

/**
 * GET /api/v1/admin/audit-log
 * Obtener registro de auditoria
 */
router.get('/audit-log', asyncHandler(adminController.getAuditLog));

/**
 * GET /api/v1/admin/statistics
 * Obtener estadisticas del sistema
 */
router.get('/statistics', asyncHandler(adminController.getSystemStatistics));

/**
 * PUT /api/v1/admin/config
 * Actualizar configuracion del sistema
 */
router.put('/config', asyncHandler(adminController.updateSystemConfig));

/**
 * GET /api/v1/admin/config
 * Obtener configuracion del sistema
 */
router.get('/config', asyncHandler(adminController.getSystemConfig));

module.exports = router;
