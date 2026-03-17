/**
 * Backend - Games Routes
 * Rutas del juego: iniciar partida, acciones, envio de resultados
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/errors');
const gameController = require('../controllers/gameController');

/**
 * POST /api/v1/games/start
 * Iniciar nueva partida
 * Body: { difficulty: 'easy'|'normal'|'hard' }
 */
router.post('/start', asyncHandler(gameController.startGame));

/**
 * GET /api/v1/games/:gameId
 * Obtener estado de la partida
 */
router.get('/:gameId', asyncHandler(gameController.getGameState));

/**
 * POST /api/v1/games/:gameId/action
 * Realizar accion de investigacion
 * Body: { actionType, locationId }
 */
router.post('/:gameId/action', asyncHandler(gameController.performAction));

/**
 * POST /api/v1/games/:gameId/submit
 * Enviar resultado final (captura de sospechoso)
 * Body: { suspectId }
 */
router.post('/:gameId/submit', asyncHandler(gameController.submitResult));

/**
 * GET /api/v1/games/:gameId/clues
 * Obtener pistas obtenidas hasta el momento
 */
router.get('/:gameId/clues', asyncHandler(gameController.getClues));

/**
 * GET /api/v1/games/:gameId/suspects
 * Obtener estado de confianza en sospechosos
 */
router.get('/:gameId/suspects', asyncHandler(gameController.getSuspectConfidence));

/**
 * POST /api/v1/games/:gameId/abandon
 * Abandonar partida
 */
router.post('/:gameId/abandon', asyncHandler(gameController.abandonGame));

module.exports = router;
