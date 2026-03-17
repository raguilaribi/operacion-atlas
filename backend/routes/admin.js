/**
 * Admin Routes
 * Stub para Etapa 7
 */

const express = require('express');
const router = express.Router();

// TODO: Implementar en Etapa 7

router.get('/dialogues', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.put('/dialogues/:section', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/locations', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/locations', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/users', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

module.exports = router;
