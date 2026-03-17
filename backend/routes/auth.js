/**
 * Backend - Auth Routes
 * Rutas de autenticacion: login, register, logout, refresh token
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/errors');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/auth');

/**
 * POST /api/v1/auth/register
 * Registrar nuevo usuario
 * Body: { username, email, password, passwordConfirm }
 */
router.post('/register', asyncHandler(authController.register));

/**
 * POST /api/v1/auth/login
 * Login de usuario
 * Body: { username, password }
 */
router.post('/login', asyncHandler(authController.login));

/**
 * POST /api/v1/auth/logout
 * Logout (requiere autenticacion)
 */
router.post('/logout', authenticateToken, asyncHandler(authController.logout));

/**
 * POST /api/v1/auth/refresh
 * Refrescar token JWT
 */
router.post('/refresh', authenticateToken, asyncHandler(authController.refreshToken));

/**
 * POST /api/v1/auth/password-reset
 * Solicitar reset de contrasena
 * Body: { email }
 */
router.post('/password-reset', asyncHandler(authController.requestPasswordReset));

/**
 * POST /api/v1/auth/password-reset/confirm
 * Confirmar reset de contrasena
 * Body: { token, newPassword, passwordConfirm }
 */
router.post('/password-reset/confirm', asyncHandler(authController.confirmPasswordReset));

/**
 * GET /api/v1/auth/me
 * Obtener usuario actual (requiere autenticacion)
 */
router.get('/me', authenticateToken, asyncHandler(authController.getCurrentUser));

module.exports = router;
