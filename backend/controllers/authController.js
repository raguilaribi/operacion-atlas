/**
 * Backend - Auth Controller
 * Logica de autenticacion y gestion de usuarios
 */

const { db } = require('../config/database');
const {
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  sanitizeInput
} = require('../utils/auth');
const {
  ValidationError,
  AuthenticationError,
  ConflictError,
  DatabaseError,
  NotFoundError
} = require('../utils/errors');

/**
 * POST /auth/register
 * Registrar nuevo usuario
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validaciones
    if (!username || !email || !password || !passwordConfirm) {
      throw new ValidationError('Todos los campos son requeridos');
    }

    if (password !== passwordConfirm) {
      throw new ValidationError('Las contraseñas no coinciden');
    }

    if (!isValidUsername(username)) {
      throw new ValidationError(
        'Username debe tener 3-20 caracteres (solo letras, numeros, guiones y underscores)'
      );
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Email invalido');
    }

    if (!isStrongPassword(password)) {
      throw new ValidationError(
        'Contraseña debe tener: 8+ caracteres, mayuscula, minuscula, numero, caracter especial'
      );
    }

    // Verificar si usuario o email ya existen
    const existingUser = await db.getAsync(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      throw new ConflictError('Username o email ya registrado');
    }

    // Hash de contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const result = await db.runAsync(
      `INSERT INTO users (username, email, password_hash, auth_type, role, is_active)
       VALUES (?, ?, ?, 'local', 'player', 1)`,
      [username, email, passwordHash]
    );

    const userId = result.lastID;

    // Crear estadisticas del usuario
    await db.runAsync(
      `INSERT INTO user_statistics (user_id, total_games, total_wins, total_losses, win_rate)
       VALUES (?, 0, 0, 0, 0.0)`,
      [userId]
    );

    // Generar tokens
    const token = generateToken({ id: userId, username, role: 'player' });
    const refreshToken = generateRefreshToken({ id: userId, username });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: userId,
        username,
        email,
        role: 'player'
      },
      tokens: {
        accessToken: token,
        refreshToken,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /auth/login
 * Login de usuario
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      throw new ValidationError('Username y contraseña son requeridos');
    }

    // Buscar usuario
    const user = await db.getAsync(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      throw new AuthenticationError('Usuario o contraseña incorrectos');
    }

    if (!user.is_active) {
      throw new AuthenticationError('Usuario desactivado');
    }

    // Verificar contraseña
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      // Incrementar intentos fallidos
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;

      if (failedAttempts >= maxAttempts) {
        const lockTime = new Date(
          Date.now() + parseInt(process.env.LOCK_TIME)
        ).toISOString();
        await db.runAsync(
          'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
          [failedAttempts, lockTime, user.id]
        );
        throw new AuthenticationError('Cuenta bloqueada por intentos fallidos');
      }

      await db.runAsync(
        'UPDATE users SET failed_login_attempts = ? WHERE id = ?',
        [failedAttempts, user.id]
      );

      throw new AuthenticationError('Usuario o contraseña incorrectos');
    }

    // Verificar si cuenta esta bloqueada
    if (user.locked_until) {
      const lockUntil = new Date(user.locked_until);
      if (lockUntil > new Date()) {
        throw new AuthenticationError('Cuenta bloqueada. Intenta mas tarde');
      } else {
        // Desbloquear cuenta
        await db.runAsync(
          'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?',
          [user.id]
        );
      }
    }

    // Reset de intentos fallidos
    await db.runAsync(
      'UPDATE users SET failed_login_attempts = 0, last_login = ? WHERE id = ?',
      [new Date().toISOString(), user.id]
    );

    // Generar tokens
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken: token,
        refreshToken,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /auth/logout
 * Logout (eliminar sesion)
 */
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Eliminar sesion del usuario
    await db.runAsync(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND is_active = 1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /auth/refresh
 * Refrescar token JWT
 */
exports.refreshToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const role = req.user.role;

    // Generar nuevo token
    const newToken = generateToken({ id: userId, username, role });

    res.json({
      success: true,
      message: 'Token refrescado',
      tokens: {
        accessToken: newToken,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /auth/password-reset
 * Solicitar reset de contraseña
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email es requerido');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Email invalido');
    }

    // Buscar usuario por email
    const user = await db.getAsync(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      // No revelar si el email existe (por seguridad)
      res.json({
        success: true,
        message: 'Si el email existe, recibiras un enlace de reset'
      });
      return;
    }

    // Aqui se enviaria el email con el token (TODO: implementar servicio de email)
    // Por ahora solo respondemos
    res.json({
      success: true,
      message: 'Si el email existe, recibiras un enlace de reset'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /auth/password-reset/confirm
 * Confirmar reset de contraseña
 */
exports.confirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword, passwordConfirm } = req.body;

    if (!token || !newPassword || !passwordConfirm) {
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

    // Verificar token (TODO: implementar logica de verificacion de token)
    // Por ahora solo respondemos
    res.json({
      success: true,
      message: 'Contraseña reseteada correctamente'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /auth/me
 * Obtener usuario actual
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener usuario
    const user = await db.getAsync(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    // Obtener estadisticas
    const stats = await db.getAsync(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      user: {
        ...user,
        statistics: stats || {}
      }
    });
  } catch (error) {
    throw error;
  }
};
