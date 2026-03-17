/**
 * Backend - Authentication Utilities
 * Manejo de JWT, hashing de contrasenas, y validacion
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

/**
 * Generar hash de contraseña
 */
const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('❌ Error hasheando contraseña:', error);
    throw error;
  }
};

/**
 * Comparar contraseña con hash
 */
const verifyPassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.error('❌ Error verificando contraseña:', error);
    throw error;
  }
};

/**
 * Generar JWT token
 */
const generateToken = (payload, expiresIn = JWT_EXPIRATION) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    console.error('❌ Error generando JWT:', error);
    throw error;
  }
};

/**
 * Verificar y decodificar JWT token
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('❌ Error verificando JWT:', error.message);
    return null;
  }
};

/**
 * Decodificar token sin verificar firma (solo para debug)
 */
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('❌ Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Generar token refresh (de mayor duracion)
 */
const generateRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return refreshToken;
  } catch (error) {
    console.error('❌ Error generando refresh token:', error);
    throw error;
  }
};

/**
 * Validar estructura de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar fortaleza de contraseña
 * Requisitos:
 * - Min 8 caracteres
 * - Al menos una mayuscula
 * - Al menos una minuscula
 * - Al menos un numero
 * - Al menos un caracter especial
 */
const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * Validar username
 * Solo alphanumericos, guiones y underscores
 * 3-20 caracteres
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Sanitizar entrada de usuario
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>"']/g, '')
    .substring(0, 255);
};

/**
 * Middleware de autenticacion JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
      code: 'NO_TOKEN'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado',
      code: 'INVALID_TOKEN'
    });
  }

  req.user = decoded;
  next();
};

/**
 * Middleware para verificar rol de administrador
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
  next();
};

/**
 * Generar token temporal para reseteo de contraseña
 */
const generatePasswordResetToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  } catch (error) {
    console.error('❌ Error generando reset token:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  sanitizeInput,
  authenticateToken,
  authorizeAdmin,
  generatePasswordResetToken,
  JWT_SECRET,
  JWT_EXPIRATION,
  BCRYPT_ROUNDS
};
