/**
 * Backend - Game Controller
 * Logica del juego: iniciar partidas, acciones, resultados
 */

const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError, GameError } = require('../utils/errors');

// Importar datos del juego (a ser creados en FASE 3)
const suspects = require('../data/suspects');
const locations = require('../data/locations');
const clues = require('../data/clues');

/**
 * POST /games/start
 * Iniciar nueva partida
 */
exports.startGame = async (req, res) => {
  try {
    const userId = req.user.id;
    const { difficulty = 'normal' } = req.body;

    // Validar dificultad
    const validDifficulties = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      throw new ValidationError(`Dificultad invalida. Debe ser: ${validDifficulties.join(', ')}`);
    }

    // Obtener tiempo limite segun dificultad
    const timeLimits = {
      easy: parseInt(process.env.GAME_EASY_TIME) || 300,
      normal: parseInt(process.env.GAME_NORMAL_TIME) || 180,
      hard: parseInt(process.env.GAME_HARD_TIME) || 60
    };

    const timeLimit = timeLimits[difficulty] * 60; // convertir a segundos

    // Seleccionar sospechoso aleatorio
    const suspectId = suspects[Math.floor(Math.random() * suspects.length)].id;
    const targetBuilding = locations[Math.floor(Math.random() * locations.length)].id;

    // Crear sesion de juego
    const gameId = uuidv4();
    await db.runAsync(
      `INSERT INTO game_sessions (
        id, user_id, difficulty, suspect_id, target_building_id,
        time_limit, time_remaining, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'in_progress')`,
      [gameId, userId, difficulty, suspectId, targetBuilding, timeLimit, timeLimit]
    );

    // Inicializar confianza en todos los sospechosos
    for (const suspect of suspects) {
      await db.runAsync(
        `INSERT INTO suspect_confidence (game_session_id, suspect_id, confidence, is_correct_suspect)
         VALUES (?, ?, 0.2, ?)`,
        [gameId, suspect.id, suspect.id === suspectId ? 1 : 0]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Partida iniciada',
      game: {
        gameId,
        difficulty,
        timeLimit,
        status: 'in_progress',
        started_at: new Date().toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /games/:gameId
 * Obtener estado de la partida
 */
exports.getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    const game = await db.getAsync(
      `SELECT * FROM game_sessions WHERE id = ? AND user_id = ?`,
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    res.json({
      success: true,
      game
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /games/:gameId/action
 * Realizar accion de investigacion
 */
exports.performAction = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    const { actionType, locationId } = req.body;

    // Validar entrada
    if (!actionType || !locationId) {
      throw new ValidationError('actionType y locationId son requeridos');
    }

    const validActions = ['database', 'interrogation', 'surveillance', 'analysis'];
    if (!validActions.includes(actionType)) {
      throw new ValidationError(`Accion invalida. Debe ser: ${validActions.join(', ')}`);
    }

    // Obtener partida
    const game = await db.getAsync(
      'SELECT * FROM game_sessions WHERE id = ? AND user_id = ?',
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    if (game.status !== 'in_progress') {
      throw new GameError('La partida ya ha finalizado', 'GAME_FINISHED');
    }

    // Obtener tiempo de accion
    const actionTimes = {
      database: parseInt(process.env.INVESTIGATION_DATABASE_TIME) || 5,
      interrogation: parseInt(process.env.INVESTIGATION_INTERROGATION_TIME) || 15,
      surveillance: parseInt(process.env.INVESTIGATION_SURVEILLANCE_TIME) || 25,
      analysis: parseInt(process.env.INVESTIGATION_ANALYSIS_TIME) || 10
    };

    const timeConsumed = actionTimes[actionType] * 60; // convertir a segundos

    // Verificar que hay tiempo suficiente
    if (game.time_remaining < timeConsumed) {
      throw new GameError('Tiempo insuficiente para esta accion', 'INSUFFICIENT_TIME');
    }

    // Simular obtencion de pista (en FASE 3 sera mas complejo)
    const clueObtained = clues[Math.floor(Math.random() * clues.length)].description;
    const isClueTrue = Math.random() > 0.3; // 70% de pistas son reales

    // Registrar accion
    const actionResult = await db.runAsync(
      `INSERT INTO investigation_actions (
        game_session_id, action_type, location_id, time_consumed,
        clue_obtained, clue_is_true
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [gameId, actionType, locationId, timeConsumed, clueObtained, isClueTrue ? 1 : 0]
    );

    // Actualizar tiempo restante
    const newTimeRemaining = game.time_remaining - timeConsumed;
    await db.runAsync(
      'UPDATE game_sessions SET time_remaining = ? WHERE id = ?',
      [newTimeRemaining, gameId]
    );

    res.json({
      success: true,
      message: 'Accion ejecutada',
      action: {
        actionId: actionResult.lastID,
        actionType,
        clueObtained,
        isClueTrue,
        timeConsumed,
        timeRemaining: newTimeRemaining,
        gameStatus: newTimeRemaining > 0 ? 'in_progress' : 'timeout'
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /games/:gameId/submit
 * Enviar resultado final
 */
exports.submitResult = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    const { suspectId } = req.body;

    if (!suspectId) {
      throw new ValidationError('suspectId es requerido');
    }

    // Obtener partida
    const game = await db.getAsync(
      'SELECT * FROM game_sessions WHERE id = ? AND user_id = ?',
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    if (game.status !== 'in_progress') {
      throw new GameError('La partida ya ha finalizado', 'GAME_FINISHED');
    }

    // Verificar si el sospechoso es correcto
    const isCorrect = suspectId === game.suspect_id;
    const result = isCorrect ? 'correct_capture' : 'wrong_suspect';

    // Calcular puntuacion (en FASE 3 sera mas complejo)
    const basePoints = isCorrect ? 100 : 0;
    const timeBonus = Math.floor((game.time_remaining / game.time_limit) * 50);
    const totalPoints = basePoints + timeBonus;

    // Actualizar partida
    await db.runAsync(
      `UPDATE game_sessions SET status = 'completed', result = ?, points = ?, ended_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [result, totalPoints, gameId]
    );

    // Registrar en leaderboard
    await db.runAsync(
      `INSERT INTO leaderboard (user_id, game_session_id, difficulty, points, time_taken, captured_correct)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, gameId, game.difficulty, totalPoints, game.time_limit - game.time_remaining, isCorrect ? 1 : 0]
    );

    // Actualizar estadisticas del usuario
    const stats = await db.getAsync(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );

    const newTotalGames = stats.total_games + 1;
    const newTotalWins = stats.total_wins + (isCorrect ? 1 : 0);
    const newWinRate = (newTotalWins / newTotalGames) * 100;
    const newHighScore = Math.max(stats.highest_score || 0, totalPoints);
    const newAvgScore = ((stats.average_score * stats.total_games) + totalPoints) / newTotalGames;

    await db.runAsync(
      `UPDATE user_statistics SET total_games = ?, total_wins = ?, total_losses = ?,
               win_rate = ?, highest_score = ?, average_score = ?, last_played = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [newTotalGames, newTotalWins, newTotalGames - newTotalWins, newWinRate, newHighScore, newAvgScore, userId]
    );

    res.json({
      success: true,
      message: isCorrect ? 'Sospechoso capturado correctamente' : 'Sospechoso incorrecto',
      result: {
        gameId,
        result,
        isCorrect,
        suspectCaptured: game.suspect_id,
        points: totalPoints,
        timeBonus
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /games/:gameId/clues
 * Obtener pistas obtenidas
 */
exports.getClues = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    // Verificar que la partida pertenece al usuario
    const game = await db.getAsync(
      'SELECT id FROM game_sessions WHERE id = ? AND user_id = ?',
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    const clues = await db.allAsync(
      `SELECT id, action_type, clue_obtained, clue_is_true, created_at
       FROM investigation_actions WHERE game_session_id = ?
       ORDER BY created_at ASC`,
      [gameId]
    );

    res.json({
      success: true,
      clues
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /games/:gameId/suspects
 * Obtener confianza en sospechosos
 */
exports.getSuspectConfidence = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    // Verificar que la partida pertenece al usuario
    const game = await db.getAsync(
      'SELECT id FROM game_sessions WHERE id = ? AND user_id = ?',
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    const suspectConfidence = await db.allAsync(
      `SELECT suspect_id, confidence FROM suspect_confidence
       WHERE game_session_id = ?
       ORDER BY confidence DESC`,
      [gameId]
    );

    res.json({
      success: true,
      suspects: suspectConfidence
    });
  } catch (error) {
    throw error;
  }
};

/**
 * POST /games/:gameId/abandon
 * Abandonar partida
 */
exports.abandonGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    const game = await db.getAsync(
      'SELECT * FROM game_sessions WHERE id = ? AND user_id = ?',
      [gameId, userId]
    );

    if (!game) {
      throw new NotFoundError('Partida');
    }

    if (game.status !== 'in_progress') {
      throw new GameError('No se puede abandonar una partida que ya ha finalizado', 'INVALID_STATUS');
    }

    // Actualizar partida
    await db.runAsync(
      `UPDATE game_sessions SET status = 'completed', result = 'abandoned', ended_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [gameId]
    );

    res.json({
      success: true,
      message: 'Partida abandonada'
    });
  } catch (error) {
    throw error;
  }
};
