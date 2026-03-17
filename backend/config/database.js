/**
 * Backend - Database Configuration
 * Conexion y configuracion de SQLite
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './backend/db/atlas.db';
const backupPath = process.env.DATABASE_BACKUP_PATH || './backend/db/backups';
const dbDir = path.dirname(dbPath);

// Crear directorio de base de datos si no existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Crear directorio de backups si no existe
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath, { recursive: true });
}

// Crear instancia de base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    process.exit(1);
  } else {
    console.log(`✓ Conectado a base de datos: ${dbPath}`);
    // Habilitar foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (!err) console.log('✓ Foreign keys habilitadas');
    });
  }
});

// Promisify database operations
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.execAsync = function(sql) {
  return new Promise((resolve, reject) => {
    this.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Initialize schema si es necesario
const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔄 Inicializando esquema de base de datos...');
    await db.execAsync(schema);
    console.log('✓ Esquema de base de datos inicializado');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando esquema:', error);
    throw error;
  }
};

// Backup de base de datos
const backupDatabase = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupPath, `atlas_backup_${timestamp}.db`);
    
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(dbPath);
      const writeStream = fs.createWriteStream(backupFile);
      
      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', () => {
        console.log(`✓ Backup creado: ${backupFile}`);
        resolve(backupFile);
      });
      
      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    throw error;
  }
};

// Get database info
const getInfo = async () => {
  try {
    const tables = await db.allAsync("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    const stats = await db.getAsync('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');
    
    return {
      path: dbPath,
      tables: tables.map(t => t.name),
      size: stats.size,
      backup_path: backupPath
    };
  } catch (error) {
    console.error('❌ Error obteniendo informacion de BD:', error);
    throw error;
  }
};

// Close database connection
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else {
        console.log('✓ Conexión a la base de datos cerrada');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  backupDatabase,
  getInfo,
  close,
  dbPath,
  backupPath
};
