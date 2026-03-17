/**
 * Backend - Main Server
 * Punto de entrada de la aplicacion
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Importar configuracion y utilidades
const { db, initDatabase } = require('./config/database');
const { errorHandler, notFoundHandler, asyncHandler } = require('./utils/errors');
const { authenticateToken } = require('./utils/auth');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard');

// Crear aplicacion Express
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// ==========================================
// MIDDLEWARE DE SEGURIDAD
// ==========================================

// Helmet: Configuracion de headers de seguridad
app.use(helmet());

// CORS: Permitir requests desde el frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting: Limitar requests por IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas solicitudes, intenta mas tarde'
});
app.use('/api/', limiter);

// ==========================================
// MIDDLEWARE DE PARSEO
// ==========================================

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==========================================
// LOGGING
// ==========================================

// Morgan: Logging de requests HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ==========================================
// RUTAS
// ==========================================

const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Info de servidor
app.get('/info', (req, res) => {
  res.json({
    success: true,
    app: 'Operacion Atlas',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticacion (sin proteccion)
app.use(`${apiPrefix}/auth`, authRoutes);

// Rutas protegidas
app.use(`${apiPrefix}/users`, authenticateToken, userRoutes);
app.use(`${apiPrefix}/games`, authenticateToken, gameRoutes);
app.use(`${apiPrefix}/leaderboard`, authenticateToken, leaderboardRoutes);
app.use(`${apiPrefix}/admin`, authenticateToken, adminRoutes);

// Ruta no encontrada
app.use(notFoundHandler);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(errorHandler);

// ==========================================
// SERVIDOR
// ==========================================

const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor Operacion Atlas...');
    
    // Inicializar base de datos
    await initDatabase();
    
    // Iniciar servidor HTTP
    const server = app.listen(PORT, HOST, () => {
      console.log(`
${'='.repeat(60)}`);
      console.log('✓ Servidor iniciado correctamente');
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Host: http://${HOST}:${PORT}`);
      console.log(`✓ API Prefix: ${apiPrefix}`);
      console.log(`✓ Health Check: http://${HOST}:${PORT}/health`);
      console.log(`${'='.repeat(60)}
`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Recibido SIGTERM, cerrando servidor...');
      server.close(() => {
        console.log('✓ Servidor HTTP cerrado');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 Recibido SIGINT, cerrando servidor...');
      server.close(() => {
        console.log('✓ Servidor HTTP cerrado');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor si se ejecuta directamente
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
