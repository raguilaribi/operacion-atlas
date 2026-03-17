/**
 * Global Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Log del error
  console.error(`[×] Error ${status}:`, message);
  console.error('Stack:', err.stack);

  // Respuesta de error
  res.status(status).json({
    success: false,
    error: message,
    status: status,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
