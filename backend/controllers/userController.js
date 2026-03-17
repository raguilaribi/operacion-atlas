/**
 * Backend - User Controller
 * Logica de gestion de usuarios, perfiles y estadisticas
 */

const { db } = require('../config/database');
const { verifyPassword, hashPassword, isStrongPassword } = require('../utils/auth');
const { ValidationError, NotFoundError, AuthenticationError } = require('../utils/errors');

/**
 * GET /users/me
 * Obtener perfil del usuario actual
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db.getAsync(
      `SELECT id, username, email, role, created_at, last_login, is_active
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    throw error;
  }
};

/**
 * PUT /users/me
 * Actualizar perfil del usuario actual
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    // Validaciones
    const updates = {};
    if (email) {
      // Verificar que el email no este en uso
      const existingUser = await db.getAsync(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existingUser) {
        throw new ValidationError('Email ya esta en uso');
      }
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('No hay campos para actualizar');
    }

    // Actualizar
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(userId);

    await db.runAsync(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const updatedUser = await db.getAsync(
      `SELECT id, username, email, role, created_at, last_login
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Perfil actualizado',
      user: updatedUser
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /users/me/statistics
 * Obtener estadisticas del usuario actual
 */
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await db.getAsync(
      `SELECT * FROM user_statistics WHERE user_id = ?`,
      [userId]
    );

    if (!stats) {
      throw new NotFoundError('Estadisticas del usuario');
    }

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /users/me/history
 * Obtener historial de partidas del usuario actual
 */
exports.getGameHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const games = await db.allAsync(
      `SELECT id, difficulty, status, result, points, time_remaining,
              started_at, ended_at
       FROM game_sessions
       WHERE user_id = ?
       ORDER BY started_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const countResult = await db.getAsync(
      'SELECT COUNT(*) as total FROM game_sessions WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      games,
      pagination: {
        total: countResult.total,
        limit,
        offset,
        hasMore: offset + limit < countResult.total
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /users/:id
 * Obtener perfil publico de usuario
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un numero
    if (isNaN(id)) {
      throw new ValidationError('ID de usuario invalido');
    }

    const user = await db.getAsync(
      `SELECT id, username, created_at, role
       FROM users WHERE id = ?`,
      [id]
    );

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /users/:id/statistics
 * Obtener estadisticas publicas de usuario
 */
exports.getPublicStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      throw new ValidationError('ID de usuario invalido');
    }

    const stats = await db.getAsync(
      `SELECT user_id, total_games, total_wins, total_losses, win_rate,
              highest_score, average_score, favorite_difficulty
       FROM user_statistics WHERE user_id = ?`,
      [id]
    );

    if (!stats) {
      throw new NotFoundError('Estadisticas del usuario');
    }

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    throw error;
  }
};

/**
 * PUT /users/me/password
 * Cambiar contrasena
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword || !passwordConfirm) {
      throw new ValidationError('Todos los campos son requeridos');
    }

    if (newPassword !== passwordConfirm) {
      throw new ValidationError('Las contraseñas no coinciden');
    }

    if (!isStrongPassword(newPassword)) {
      throw new ValidationError(
        'Contraseña debe tener: 8+ caracteres, mayuscula, minuscula, numero, caracter especial'
      );
    }

    // Obtener usuario actual
    const user = await db.getAsync(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Verificar contraseña actual
    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      throw new AuthenticationError('Contraseña actual incorrecta');
    }

    // Hash de nueva contraseña
    const newPasswordHash = await hashPassword(newPassword);

    // Actualizar contraseña
    await db.runAsync(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    throw error;
  }
};
