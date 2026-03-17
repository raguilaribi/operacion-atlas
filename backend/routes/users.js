/**
 * Backend - Users Routes
 * Rutas de usuarios: perfil, estadisticas, configuracion
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/errors');
const userController = require('../controllers/userController');

/**
 * GET /api/v1/users/me
 * Obtener perfil del usuario actual
 */
router.get('/me', asyncHandler(userController.getProfile));

/**
 * PUT /api/v1/users/me
 * Actualizar perfil del usuario actual
 */
router.put('/me', asyncHandler(userController.updateProfile));

/**
 * GET /api/v1/users/me/statistics
 * Obtener estadisticas del usuario actual
 */
router.get('/me/statistics', asyncHandler(userController.getStatistics));

/**
 * GET /api/v1/users/me/history
 * Obtener historial de partidas
 */
router.get('/me/history', asyncHandler(userController.getGameHistory));

/**
 * GET /api/v1/users/:id
 * Obtener perfil publico de usuario
 */
router.get('/:id', asyncHandler(userController.getPublicProfile));

/**
 * GET /api/v1/users/:id/statistics
 * Obtener estadisticas publicas de usuario
 */
router.get('/:id/statistics', asyncHandler(userController.getPublicStatistics));

/**
 * PUT /api/v1/users/me/password
 * Cambiar contrasena
 */
router.put('/me/password', asyncHandler(userController.changePassword));

module.exports = router;
