/**
 * Database Configuration - SQLite
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATABASE_PATH = process.env.DATABASE_PATH || './database/operacion_atlas.db';
const DB_DIR = path.dirname(DATABASE_PATH);

// Crear directorio si no existe
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('[✓] Conexión a SQLite establecida en:', DATABASE_PATH);
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Inicializar todas las tablas necesarias
 */
const initialize = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // ============================================
      // USERS TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT,
          auth_type TEXT DEFAULT 'local', -- 'local' | 'ldap'
          fullname TEXT,
          is_admin BOOLEAN DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT 1
        )
      `, (err) => {
        if (err) console.error('Error creando tabla users:', err);
      });

      // ============================================
      // GAMES TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          suspect_id TEXT NOT NULL,
          target_building_id TEXT,
          difficulty TEXT NOT NULL, -- 'easy', 'normal', 'hard'
          time_limit INTEGER NOT NULL, -- segundos
          time_elapsed INTEGER DEFAULT 0,
          status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
          result TEXT, -- 'captured', 'timeout', 'wrong_suspect'
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ended_at TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla games:', err);
      });

      // ============================================
      // INVESTIGATION_LOG TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS investigation_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER NOT NULL,
          action_type TEXT NOT NULL, -- 'database', 'witness', 'surveillance', 'documents'
          location_id TEXT,
          time_consumed INTEGER NOT NULL, -- segundos
          clue_obtained TEXT,
          is_false_clue BOOLEAN DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (game_id) REFERENCES games(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla investigation_log:', err);
      });

      // ============================================
      // LEADERBOARD TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          game_id INTEGER NOT NULL,
          difficulty TEXT NOT NULL,
          time_taken INTEGER NOT NULL, -- segundos
          success BOOLEAN NOT NULL,
          rank INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (game_id) REFERENCES games(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla leaderboard:', err);
      });

      // ============================================
      // DIALOGUES TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS dialogues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          section TEXT NOT NULL,
          subsection TEXT,
          key TEXT NOT NULL,
          content TEXT NOT NULL,
          description TEXT,
          edited_by INTEGER,
          edited_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(section, subsection, key),
          FOREIGN KEY (edited_by) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla dialogues:', err);
      });

      // ============================================
      // AUDIT_LOG TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          resource_type TEXT,
          resource_id TEXT,
          changes TEXT, -- JSON
          ip_address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla audit_log:', err);
      });

      // ============================================
      // SESSION TABLE
      // ============================================
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT UNIQUE NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) console.error('Error creando tabla sessions:', err);
      });

      // ============================================
      // INDICES
      // ============================================
      db.run(`CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_games_status ON games(status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty ON leaderboard(difficulty)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id)`);

      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
          reject(err);
        } else {
          console.log('[\u2713] Tablas creadas/verificadas:', tables.map(t => t.name).join(', '));
          resolve(db);
        }
      });
    });
  });
};

/**
 * Ejecutar query SELECT
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Ejecutar query GET (una sola fila)
 */
const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/**
 * Ejecutar INSERT, UPDATE, DELETE
 */
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

/**
 * Cerrar conexión
 */
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else {
        console.log('[\u2713] Conexión a la base de datos cerrada');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initialize,
  query,
  getOne,
  run,
  close
};
