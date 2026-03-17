/**
 * OPERACIÓN ATLAS - Intelligence Tracking Game
 * Backend Server
 */

const express = require('express');
const cors = require('express-cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-ratelimit');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.'
});
app.use('/api/', limiter);

// ============================================
// BODY PARSER
// ============================================
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// LOGGING
// ============================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// STATIC FILES
// ============================================
app.use(express.static('frontend'));
app.use('/admin', express.static('frontend/admin'));

// ============================================
// API ROUTES
// ============================================
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV
  });
});

// API endpoints (to be implemented in later stages)
app.use(`${apiPrefix}/auth`, require('./routes/auth'));
app.use(`${apiPrefix}/game`, require('./routes/game'));
app.use(`${apiPrefix}/leaderboard`, require('./routes/leaderboard'));
app.use(`${apiPrefix}/admin`, require('./routes/admin'));

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorHandler);

// ============================================
// DATABASE INITIALIZATION
// ============================================
db.initialize()
  .then(() => {
    console.log('[✓] Base de datos inicializada correctamente');
    
    // ============================================
    // START SERVER
    // ============================================
    app.listen(PORT, HOST, () => {
      console.log(`
${'='.repeat(60)}`);
      console.log('  🛘 OPERACIÓN ATLAS - Intelligence Tracking Game');
      console.log(`${'='.repeat(60)}`);
      console.log(`  🚀 Servidor ejecutándose en: http://${HOST}:${PORT}`);
      console.log(`  🌐 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`  📄 API Prefix: ${apiPrefix}`);
      console.log(`  👥 Validación: http://${HOST}:${PORT}/health`);
      console.log(`${'='.repeat(60)}\n`);
    });
  })
  .catch((error) => {
    console.error('[×] Error al inicializar la base de datos:', error);
    process.exit(1);
  });

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('[⚠] Señal SIGTERM recibida: cerrando el servidor...');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n[\u26a0] Señal SIGINT recibida: cerrando el servidor...');
  db.close();
  process.exit(0);
});

module.exports = app;
