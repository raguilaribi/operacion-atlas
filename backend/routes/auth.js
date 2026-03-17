/**
 * Authentication Routes
 * Stub para Etapa 2
 */

const express = require('express');
const router = express.Router();

// TODO: Implementar en Etapa 2

router.post('/register', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/verify', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

module.exports = router;
