/**
 * Backend - Leaderboard Controller
 * Logica de rankings y leaderboards
 */

const { db } = require('../config/database');
const { ValidationError, NotFoundError } = require('../utils/errors');

/**
 * GET /leaderboard/global
 * Obtener leaderboard global
 */
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const leaderboard = await db.allAsync(
      `SELECT ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
              u.id, u.username, l.points, l.difficulty, l.captured_correct,
              l.time_taken, l.created_at
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       ORDER BY l.points DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countResult = await db.getAsync(
      'SELECT COUNT(*) as total FROM leaderboard'
    );

    res.json({
      success: true,
      leaderboard,
      pagination: {
        total: countResult.total,
        limit,
        offset,
        hasMore: offset + limit < countResult.total
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /leaderboard/difficulty/:difficulty
 * Obtener leaderboard por dificultad
 */
exports.getByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Validar dificultad
    const validDifficulties = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      throw new ValidationError(`Dificultad invalida. Debe ser: ${validDifficulties.join(', ')}`);
    }

    const leaderboard = await db.allAsync(
      `SELECT ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
              u.id, u.username, l.points, l.difficulty, l.captured_correct,
              l.time_taken, l.created_at
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       WHERE l.difficulty = ?
       ORDER BY l.points DESC
       LIMIT ? OFFSET ?`,
      [difficulty, limit, offset]
    );

    const countResult = await db.getAsync(
      'SELECT COUNT(*) as total FROM leaderboard WHERE difficulty = ?',
      [difficulty]
    );

    res.json({
      success: true,
      difficulty,
      leaderboard,
      pagination: {
        total: countResult.total,
        limit,
        offset,
        hasMore: offset + limit < countResult.total
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /leaderboard/monthly
 * Obtener leaderboard mensual
 */
exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const monthsBack = parseInt(req.query.months) || 1;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const leaderboard = await db.allAsync(
      `SELECT ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
              u.id, u.username, l.points, l.difficulty, l.captured_correct,
              l.time_taken, l.created_at
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       WHERE l.created_at >= ?
       ORDER BY l.points DESC
       LIMIT ? OFFSET ?`,
      [startDate.toISOString(), limit, offset]
    );

    const countResult = await db.getAsync(
      'SELECT COUNT(*) as total FROM leaderboard WHERE created_at >= ?',
      [startDate.toISOString()]
    );

    res.json({
      success: true,
      period: `Last ${monthsBack} month(s)`,
      leaderboard,
      pagination: {
        total: countResult.total,
        limit,
        offset,
        hasMore: offset + limit < countResult.total
      }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /leaderboard/personal
 * Obtener posicion personal
 */
exports.getPersonalRanking = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener todas las partidas del usuario ordenadas por puntuacion
    const userGames = await db.allAsync(
      `SELECT l.points, l.difficulty, l.captured_correct, l.time_taken, l.created_at
       FROM leaderboard l
       WHERE l.user_id = ?
       ORDER BY l.points DESC
       LIMIT 10`,
      [userId]
    );

    // Obtener posicion en leaderboard global
    const globalRank = await db.getAsync(
      `SELECT COUNT(*) as rank FROM leaderboard
       WHERE points > (SELECT MAX(points) FROM leaderboard WHERE user_id = ?)`,
      [userId]
    );

    // Por dificultad
    const rankByDifficulty = {};
    const difficulties = ['easy', 'normal', 'hard'];

    for (const diff of difficulties) {
      const rank = await db.getAsync(
        `SELECT COUNT(*) as rank FROM leaderboard
         WHERE difficulty = ? AND points > (
           SELECT MAX(points) FROM leaderboard WHERE user_id = ? AND difficulty = ?
         )`,
        [diff, userId, diff]
      );
      rankByDifficulty[diff] = rank.rank + 1;
    }

    res.json({
      success: true,
      user: req.user.username,
      ranking: {
        globalRank: globalRank.rank + 1,
        byDifficulty: rankByDifficulty
      },
      recentGames: userGames
    });
  } catch (error) {
    throw error;
  }
};

/**
 * GET /leaderboard/top10
 * Obtener top 10
 */
exports.getTop10 = async (req, res) => {
  try {
    const leaderboard = await db.allAsync(
      `SELECT ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
              u.id, u.username, l.points, l.difficulty, l.captured_correct,
              l.time_taken, l.created_at
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       ORDER BY l.points DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      top10: leaderboard
    });
  } catch (error) {
    throw error;
  }
};
