-- ==========================================
-- OPERACIÓN ATLAS - Database Schema
-- ==========================================

-- Tabla: users
-- Almacena información de usuarios y autenticación
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  auth_type TEXT DEFAULT 'local',  -- 'local', 'ldap', 'ad'
  role TEXT DEFAULT 'player',      -- 'player', 'admin', 'moderator'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Tabla: sessions
-- Almacena sesiones activas de usuarios
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Tabla: game_sessions
-- Almacena partidas del juego
CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  difficulty TEXT NOT NULL,  -- 'easy', 'normal', 'hard'
  suspect_id TEXT NOT NULL,
  target_building_id TEXT NOT NULL,
  time_limit INTEGER NOT NULL,    -- segundos
  time_remaining INTEGER NOT NULL, -- segundos
  status TEXT DEFAULT 'in_progress',  -- 'in_progress', 'completed', 'failed', 'timeout'
  result TEXT,                      -- 'correct_capture', 'wrong_suspect', 'timeout', 'abandoned'
  points INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at);

-- Tabla: investigation_actions
-- Almacena acciones de investigación realizadas
CREATE TABLE IF NOT EXISTS investigation_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_session_id TEXT NOT NULL,
  action_type TEXT NOT NULL,  -- 'database', 'interrogation', 'surveillance', 'analysis'
  location_id TEXT NOT NULL,
  time_consumed INTEGER NOT NULL,  -- segundos
  clue_obtained TEXT,
  clue_is_true BOOLEAN,           -- true si la pista es verdadera
  suspect_ids_affected TEXT,      -- JSON array de suspect IDs
  confidence_changes TEXT,        -- JSON con cambios de confianza
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_investigation_game_session ON investigation_actions(game_session_id);
CREATE INDEX idx_investigation_location ON investigation_actions(location_id);

-- Tabla: suspect_confidence
-- Almacena nivel de confianza en cada sospechoso durante una partida
CREATE TABLE IF NOT EXISTS suspect_confidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_session_id TEXT NOT NULL,
  suspect_id TEXT NOT NULL,
  confidence REAL DEFAULT 0.2,  -- 0.0 a 1.0
  is_correct_suspect BOOLEAN,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  UNIQUE(game_session_id, suspect_id)
);

CREATE INDEX idx_suspect_confidence_game ON suspect_confidence(game_session_id);

-- Tabla: leaderboard
-- Almacena resultados de partidas completadas
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  game_session_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  points INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,  -- segundos
  captured_correct BOOLEAN NOT NULL,
  rank_position INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX idx_leaderboard_difficulty ON leaderboard(difficulty);
CREATE INDEX idx_leaderboard_points ON leaderboard(points DESC);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Tabla: admin_audit_log
-- Registro de cambios realizados por administradores
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER NOT NULL,
  action TEXT NOT NULL,          -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,      -- tabla afectada
  record_id TEXT NOT NULL,
  old_data TEXT,                 -- JSON del estado anterior
  new_data TEXT,                 -- JSON del nuevo estado
  changes_description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_admin_id ON admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_table ON admin_audit_log(table_name);
CREATE INDEX idx_audit_created_at ON admin_audit_log(created_at DESC);

-- Tabla: user_statistics
-- Estadísticas agregadas por usuario
CREATE TABLE IF NOT EXISTS user_statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  total_games INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0.0,
  total_playtime INTEGER DEFAULT 0,  -- segundos
  highest_score INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0.0,
  favorite_difficulty TEXT,
  last_played TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_stats_user_id ON user_statistics(user_id);

-- Tabla: dialogues_config (JSON editables)
-- Almacena diálogos editables del juego
CREATE TABLE IF NOT EXISTS dialogues_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT UNIQUE NOT NULL,      -- 'briefing', 'investigation', 'success', 'failure'
  key_name TEXT NOT NULL,
  content TEXT NOT NULL,             -- Diálogo/contenido
  last_modified_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  FOREIGN KEY(last_modified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_dialogues_section ON dialogues_config(section);

-- Tabla: system_config
-- Configuración del sistema modificable
CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'string',  -- 'string', 'integer', 'boolean', 'json'
  description TEXT,
  is_editable BOOLEAN DEFAULT 1,
  last_modified_by INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(last_modified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_system_config_key ON system_config(key);

-- ==========================================
-- VISTAS (Views) útiles
-- ==========================================

-- Vista: Top 10 Leaderboard
CREATE VIEW IF NOT EXISTS leaderboard_top_10 AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
  u.username,
  l.points,
  l.difficulty,
  l.captured_correct,
  l.time_taken,
  l.created_at
FROM leaderboard l
JOIN users u ON l.user_id = u.id
ORDER BY l.points DESC
LIMIT 10;

-- Vista: User Win Rate
CREATE VIEW IF NOT EXISTS user_win_rates AS
SELECT 
  u.id,
  u.username,
  COUNT(gs.id) as total_games,
  SUM(CASE WHEN gs.result = 'correct_capture' THEN 1 ELSE 0 END) as wins,
  ROUND(100.0 * SUM(CASE WHEN gs.result = 'correct_capture' THEN 1 ELSE 0 END) / COUNT(gs.id), 2) as win_rate
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id AND gs.status = 'completed'
GROUP BY u.id, u.username;
