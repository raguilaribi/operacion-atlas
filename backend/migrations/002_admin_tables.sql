-- Migracion 002: Tablas de administracion y auditoria
-- Permite rastrear acciones administrativas y cambios en configuracion

-- Tabla de registro de auditoria
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'ban', 'unban'
  table_name TEXT NOT NULL, -- nombre de la tabla afectada
  record_id TEXT, -- ID del registro afectado
  new_data TEXT, -- JSON con los nuevos datos
  old_data TEXT, -- JSON con los datos anteriores
  changes_description TEXT, -- Descripcion del cambio
  ip_address TEXT, -- IP del administrador
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indices para auditoria
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin_id ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_table ON admin_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON admin_audit_log(action);

-- Tabla de configuracion del sistema
CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL, -- ej: 'game_max_duration', 'max_players_per_session'
  value TEXT NOT NULL, -- valor configurado
  type TEXT DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT, -- descripcion del parametro
  is_editable INTEGER DEFAULT 1, -- si puede ser editado desde admin
  default_value TEXT, -- valor por defecto
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified_by INTEGER, -- ID del admin que lo cambio
  FOREIGN KEY (last_modified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indices para configuracion
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(key);

-- Tabla de estadisticas de usuarios
CREATE TABLE IF NOT EXISTS user_statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  games_played INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  total_correct_captures INTEGER DEFAULT 0,
  total_incorrect_captures INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0, -- porcentaje
  total_playtime_minutes INTEGER DEFAULT 0,
  average_game_duration_minutes INTEGER DEFAULT 0,
  best_capture_time_seconds INTEGER, -- tiempo mas rapido para capturar
  last_game_played TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indices para estadisticas
CREATE INDEX IF NOT EXISTS idx_user_stats_created ON user_statistics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_win_rate ON user_statistics(win_rate);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_game ON user_statistics(last_game_played);

-- Insertar configuracion inicial del sistema
INSERT OR IGNORE INTO system_config (key, value, type, description, default_value) VALUES
('game_max_duration_minutes', '10', 'number', 'Duracion maxima de una sesion de juego', '10'),
('max_players_per_session', '1', 'number', 'Maximos jugadores por sesion (para modo futuro multijugador)', '1'),
('max_login_attempts', '5', 'number', 'Intentos maximos de login antes de bloqueo temporal', '5'),
('login_attempt_lockout_minutes', '15', 'number', 'Minutos que se bloquea una cuenta tras intentos fallidos', '15'),
('maintenance_mode', 'false', 'boolean', 'Modo mantenimiento (solo admins pueden acceder)', 'false'),
('allow_new_registrations', 'true', 'boolean', 'Permitir nuevos registros de usuarios', 'true'),
('require_email_verification', 'true', 'boolean', 'Requerir verificacion de email al registrarse', 'true'),
('game_difficulty_levels', '{"easy": 1, "normal": 2, "hard": 3}', 'json', 'Niveles de dificultad disponibles', '{"easy": 1, "normal": 2, "hard": 3}');
