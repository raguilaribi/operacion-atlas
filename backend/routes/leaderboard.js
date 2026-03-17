/**
 * Leaderboard Routes
 * Stub para Etapa 6
 */

const express = require('express');
const router = express.Router();

// TODO: Implementar en Etapa 6

router.get('/', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/user/:userId', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

router.get('/stats/:userId', (req, res) => {
  res.status(501).json({ error: 'No implementado aún' });
});

module.exports = router;
