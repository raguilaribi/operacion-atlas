/**
 * Backend - Error Handling
 * Errores personalizados y manejador centralizado
 */

/**
 * Clase base para errores personalizados
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Error de validacion
 */
class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Error de autenticacion
 */
class AuthenticationError extends ApiError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Error de autorizacion
 */
class AuthorizationError extends ApiError {
  constructor(message = 'Acceso denegado') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Error de recurso no encontrado
 */
class NotFoundError extends ApiError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
  }
}

/**
 * Error de conflicto
 */
class ConflictError extends ApiError {
  constructor(message = 'Conflicto') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Error de base de datos
 */
class DatabaseError extends ApiError {
  constructor(message = 'Error en la base de datos', details = null) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

/**
 * Error de servidor interno
 */
class InternalServerError extends ApiError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

/**
 * Error de juego (logica del juego)
 */
class GameError extends ApiError {
  constructor(message, code = 'GAME_ERROR', details = null) {
    super(message, 400, code, details);
  }
}

/**
 * Manejador de errores middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log del error
  console.error('❌ Error en', req.method, req.path);
  console.error('  Mensaje:', err.message);
  if (err.statusCode === 500) {
    console.error('  Stack:', err.stack);
  }

  // Si es un error personalizado
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({
      success: false,
      message: 'Token inválido',
      code: 'INVALID_TOKEN',
      statusCode: 403
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
      code: 'TOKEN_EXPIRED',
      statusCode: 401
    });
  }

  // Database errors
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado',
      code: 'DUPLICATE_RECORD',
      statusCode: 409
    });
  }

  // Errores no manajados
  console.error('❌ Error no capturado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  });
};

/**
 * Manejador para rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
    statusCode: 404
  });
};

/**
 * Async handler para wrappear rutas
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  InternalServerError,
  GameError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
