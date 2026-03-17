/**
 * Game Routes
 * Stub para Etapa 4
 */

const express = require('express');
const router = express.Router();

// TODO: Implementar en Etapa 4

router.post('/start', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/investigate/:action', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/capture', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/status', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.post('/end', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

module.exports = router;
