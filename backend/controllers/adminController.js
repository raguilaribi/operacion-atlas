/**
 * Backend - Admin Controller
 * Logica de administracion: usuarios, auditoria, configuracion
 */

const { db } = require('../config/database');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * GET /admin/users
 * Listar todos los usuarios
 */
exports.listUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const searchTerm = req.query.search || '';

    let query = 'SELECT id, username, email, role, is_active, created_at, last_login FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let params = [];

    if (searchTerm) {
      const searchFilter = ` WHERE username LIKE ? OR email LIKE ?`;
      query += searchFilter;
      countQuery += searchFilter;
      const searchPattern = `%${searchTerm}%`;
      params = [searchPattern, searchPattern];
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const users = await db.allAsync(query, params);
    const countParams = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`] : [];
    const countResult = await db.getAsync(countQuery, countParams);

    res.json({
      success: true,
      users,
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
 * GET /admin/users/:id
 * Obtener detalles de usuario
 */
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.getAsync(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    const stats = await db.getAsync(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [id]
    );

    res.json({
      success: true,
      user,
      statistics: stats
    });
  } catch (error) {
    throw error;
  }
};

/**
 * PUT /admin/users/:id
 * Editar usuario
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const adminUserId = req.user.id;

    // No permitir editar propio rol
    if (id == adminUserId && role) {
      throw new AuthorizationError('No puedes cambiar tu propio rol');
    }

    const user = await db.getAsync('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    const updates = {};
    if (email) updates.email = email;
    if (role && ['admin', 'player', 'moderator'].includes(role)) {
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError('No hay campos para actualizar');
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await db.runAsync(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Registrar en auditoria
    await db.runAsync(
      `INSERT INTO admin_audit_log (admin_user_id, action, table_name, record_id, new_data, changes_description)
       VALUES (?, 'update', 'users', ?, ?, ?)`,
      [adminUserId, id, JSON.stringify(updates), 'Usuario actualizado por administrador']
    );

    res.json({
      success: true,
      message: 'Usuario actualizado'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE /admin/users/:id
 * Eliminar usuario
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.id;

    if (id == adminUserId) {
      throw new AuthorizationError('No puedes eliminar tu propio usuario');
    }

    const user = await db.getAsync('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);

    // Registrar en auditoria
    await db.runAsync(
      `INSERT INTO admin_audit_log (admin_user_id, action, table_name, record_id, changes_description)
       VALUES (?, 'delete', 'users', ?, ?)`,
      [adminUserId, id, 'Usuario eliminado por administrador']
    );

    res.json({
      success: true,
      message: 'Usuario eliminado'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /admin/users/:id/ban
 * Banear usuario
 */
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminUserId = req.user.id;

    if (id == adminUserId) {
      throw new AuthorizationError('No puedes banear tu propio usuario');
    }

    const user = await db.getAsync('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    await db.runAsync(
      'UPDATE users SET is_active = 0 WHERE id = ?',
      [id]
    );

    // Registrar en auditoria
    await db.runAsync(
      `INSERT INTO admin_audit_log (admin_user_id, action, table_name, record_id, changes_description)
       VALUES (?, 'ban', 'users', ?, ?)`,
      [adminUserId, id, `Usuario baneado: ${reason || 'Sin razon especificada'}`]
    );

    res.json({
      success: true,
      message: 'Usuario baneado'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /admin/users/:id/unban
 * Desbanear usuario
 */
exports.unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.id;

    const user = await db.getAsync('SELECT id FROM users WHERE id = ?', [id]);
    if (!user) {
      throw new NotFoundError('Usuario');
    }

    await db.runAsync(
      'UPDATE users SET is_active = 1 WHERE id = ?',
      [id]
    );

    // Registrar en auditoria
    await db.runAsync(
      `INSERT INTO admin_audit_log (admin_user_id, action, table_name, record_id, changes_description)
       VALUES (?, 'unban', 'users', ?, ?)`,
      [adminUserId, id, 'Usuario desbaneado']
    );

    res.json({
      success: true,
      message: 'Usuario desbaneado'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /admin/audit-log
 * Obtener registro de auditoria
 */
exports.getAuditLog = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const logs = await db.allAsync(
      `SELECT * FROM admin_audit_log
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await db.getAsync(
      'SELECT COUNT(*) as total FROM admin_audit_log'
    );

    res.json({
      success: true,
      logs,
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
 * GET /admin/statistics
 * Obtener estadisticas del sistema
 */
exports.getSystemStatistics = async (req, res) => {
  try {
    const totalUsers = await db.getAsync('SELECT COUNT(*) as count FROM users');
    const totalGames = await db.getAsync('SELECT COUNT(*) as count FROM game_sessions');
    const activeUsers = await db.getAsync(
      'SELECT COUNT(*) as count FROM users WHERE last_login > datetime("now", "-7 days")'
    );
    const completedGames = await db.getAsync(
      'SELECT COUNT(*) as count FROM game_sessions WHERE status = "completed"'
    );
    const winRate = await db.getAsync(
      'SELECT ROUND(100.0 * COUNT(CASE WHEN result = "correct_capture" THEN 1 END) / COUNT(*), 2) as rate FROM game_sessions WHERE status = "completed"'
    );

    res.json({
      success: true,
      statistics: {
        totalUsers: totalUsers.count,
        activeUsers: activeUsers.count,
        totalGames: totalGames.count,
        completedGames: completedGames.count,
        globalWinRate: winRate.rate || 0
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /admin/config
 * Obtener configuracion del sistema
 */
exports.getSystemConfig = async (req, res) => {
  try {
    const config = await db.allAsync(
      'SELECT key, value, type, description FROM system_config WHERE is_editable = 1'
    );

    res.json({
      success: true,
      config
    });
  } catch (error) {
    throw error;
  }
};

/**
 * PUT /admin/config
 * Actualizar configuracion del sistema
 */
exports.updateSystemConfig = async (req, res) => {
  try {
    const { key, value } = req.body;
    const adminUserId = req.user.id;

    if (!key || value === undefined) {
      throw new ValidationError('key y value son requeridos');
    }

    const config = await db.getAsync(
      'SELECT is_editable FROM system_config WHERE key = ?',
      [key]
    );

    if (!config) {
      throw new NotFoundError('Configuracion');
    }

    if (!config.is_editable) {
      throw new ValidationError('Esta configuracion no puede ser editada');
    }

    await db.runAsync(
      'UPDATE system_config SET value = ?, updated_at = CURRENT_TIMESTAMP, last_modified_by = ? WHERE key = ?',
      [value, adminUserId, key]
    );

    // Registrar en auditoria
    await db.runAsync(
      `INSERT INTO admin_audit_log (admin_user_id, action, table_name, record_id, new_data, changes_description)
       VALUES (?, 'update', 'system_config', ?, ?, ?)`,
      [adminUserId, key, JSON.stringify({ value }), `Configuracion del sistema actualizada: ${key}`]
    );

    res.json({
      success: true,
      message: 'Configuracion actualizada'
    });
  } catch (error) {
    throw error;
  }
};
