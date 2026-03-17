/**
 * Backend - Leaderboard Routes
 * Rutas de leaderboard: rankings globales, por dificultad, mensuales
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/errors');
const leaderboardController = require('../controllers/leaderboardController');

/**
 * GET /api/v1/leaderboard/global
 * Obtener leaderboard global
 */
router.get('/global', asyncHandler(leaderboardController.getGlobalLeaderboard));

/**
 * GET /api/v1/leaderboard/difficulty/:difficulty
 * Obtener leaderboard por dificultad (easy, normal, hard)
 */
router.get('/difficulty/:difficulty', asyncHandler(leaderboardController.getByDifficulty));

/**
 * GET /api/v1/leaderboard/monthly
 * Obtener leaderboard mensual
 */
router.get('/monthly', asyncHandler(leaderboardController.getMonthlyLeaderboard));

/**
 * GET /api/v1/leaderboard/personal
 * Obtener posicion personal en el leaderboard
 */
router.get('/personal', asyncHandler(leaderboardController.getPersonalRanking));

/**
 * GET /api/v1/leaderboard/top10
 * Obtener top 10 del leaderboard
 */
router.get('/top10', asyncHandler(leaderboardController.getTop10));

module.exports = router;
