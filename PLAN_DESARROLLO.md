# OPERACIÓN ATLAS - Plan de Desarrollo Iterativo

## 📋 Visión General
Juego online de inteligencia policial tipo "Carmen Sandiego" (1991) donde el jugador es un Agente Especial de Inteligencia de la PDI que debe identificar, rastrear y capturar sospechosos subversivos en Santiago, Chile antes de que cometan un atentado explosivo.

**Stack Tecnológico:**
- Frontend: HTML5 + CSS3 + JavaScript (Vanilla)
- Backend: Node.js + Express
- Base de Datos: SQLite (con posibilidad de LDAP/AD para login)
- Autenticación: Local + LDAP/Active Directory (configurable)

---

## 🎯 ETAPA 1: Infraestructura Base y Setup (Semana 1)

### 1.1 Estructura de Carpetas
```
operacion-atlas/
├── backend/
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── config.env
│   ├── routes/
│   │   ├── auth.js
│   │   ├── game.js
│   │   ├── admin.js
│   │   └── leaderboard.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   ├── adminController.js
│   │   └── leaderboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   │   ├── Suspect.js
│   │   └── Location.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── data/
│       ├── dialogues.json
│       ├── suspects.json
│       ├── locations.json
│       ├── buildings.json
│       └── clues.json
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── retro.css
│   │   └── game.css
│   ├── js/
│   │   ├── main.js
│   │   ├── game.js
│   │   ├── ui.js
│   │   ├── api.js
│   │   └── utils.js
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   └── admin/
│       ├── index.html
│       ├── js/
│       └── css/
├── public/
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── PLAN_DESARROLLO.md
```

### 1.2 Tareas
- [ ] Inicializar proyecto Node.js
- [ ] Configurar Express server básico
- [ ] Crear estructura de carpetas
- [ ] Configurar .gitignore y .env.example
- [ ] Crear README.md inicial
- [ ] Configurar SQLite
- [ ] Setup de autenticación básica (local + LDAP opcional)

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 2: Sistema de Autenticación y Usuarios (Semana 1-2)

### 2.1 Funcionalidades
- [ ] Login local (usuario/contraseña)
- [ ] Integración LDAP/Active Directory (configurable)
- [ ] Registro de usuarios
- [ ] Gestión de sesiones
- [ ] Recuperación de contraseña
- [ ] Validación de tokens JWT

### 2.2 Base de Datos
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  auth_type TEXT, -- 'local' | 'ldap'
  created_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### 2.3 Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/verify`
- `POST /api/auth/forgot-password`

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 3: Base de Datos de Contenido (Semana 2)

### 3.1 Locaciones en Santiago (~100)
Categorías:
- Seguridad (La Moneda, PDI, Carabineros, etc.)
- Civiles (Metro, Universidades, Hospitales)
- Administrativos (Ministerios, Municipalidades)
- Comerciales (Centros comerciales, bancos)
- Religiosas (Iglesias, conventos)
- Residenciales (Barrios específicos)

Estructura JSON:
```json
{
  "id": "loc_001",
  "name": "La Moneda",
  "address": "Teatinos 120, Santiago",
  "coordinates": [-70.6372, -33.4489],
  "category": "security",
  "npc_count": 3,
  "clue_availability": 0.7,
  "investigation_time": 15
}
```

### 3.2 Perfiles de Sospechosos (5)
1. **Extrema Derecha** → Objetivo: La Moneda
2. **Extrema Izquierda** → Objetivo: Congreso Nacional
3. **Ecologista Extremo** → Objetivo: Centro Comercial
4. **Religioso Extremo** → Objetivo: Iglesia Católica
5. **Activista de Género Extremo** → Objetivo: Ministerio de la Mujer

Estructura JSON:
```json
{
  "id": "suspect_001",
  "profile_type": "far_right",
  "name": "Carlos Mendoza",
  "aliases": ["El Patriota", "CM"],
  "description": "Hombre 35-40 años, cabello rubio corto...",
  "ideology": "Nacionalismo extremo",
  "target_building": "building_001",
  "methods": ["explosives", "timing_device"],
  "associates": ["suspect_002", "suspect_003"],
  "activity_pattern": {...}
}
```

### 3.3 Diálogos Editables
```json
{
  "sections": {
    "briefing": {
      "intro": "Agente, bienvenido a la sala de operaciones...",
      "threat_assessment": "Tenemos inteligencia sobre una amenaza inminente...",
      "mission_objective": "Tu objetivo es identificar y neutralizar la amenaza..."
    },
    "investigations": {
      "witness_interview": "¿Qué información tienes para mí?",
      "database_search": "Accediendo a bases de datos clasificadas..."
    },
    "success": {
      "capture": "¡Excelente trabajo, agente!",
      "briefing_end": "Operación completada exitosamente"
    },
    "failure": {
      "timeout": "Se acabó el tiempo. El atentado ha ocurrido.",
      "wrong_suspect": "Hemos detenido al sospechoso equivocado."
    }
  }
}
```

### 3.4 Tareas
- [ ] Crear base de datos de 100 locaciones reales de Santiago
- [ ] Definir 5 perfiles de sospechosos con variantes
- [ ] Crear 5 edificios objetivo según perfil
- [ ] Estructura de pistas (verdaderas y falsas)
- [ ] Base de diálogos JSON completa y editable
- [ ] Sistema de clues dinámicas

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 4: Backend - Lógica del Juego (Semana 3-4)

### 4.1 Game Logic
- [ ] Generador de casos aleatorios
- [ ] Sistema de pistas dinámicas
- [ ] Cálculo de tiempo consumido por acción
- [ ] Validación de captura correcta
- [ ] Sistema de puntuación basado en tiempo

### 4.2 Acciones Investigativas (4)
1. **Búsqueda en Base de Datos** (5 min)
   - Tiempo bajo, información media
2. **Entrevista a Testigos** (15 min)
   - Tiempo medio, información variable (puede tener desinformación)
3. **Vigilancia de Sospechoso** (25 min)
   - Tiempo alto, información confiable
4. **Análisis de Documentos/Comunicaciones** (10 min)
   - Tiempo medio-bajo, información específica

### 4.3 Endpoints
- `POST /api/game/start`
- `POST /api/game/investigate/:action`
- `POST /api/game/capture`
- `GET /api/game/status`
- `POST /api/game/end`

### 4.4 Base de Datos de Juego
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  suspect_id TEXT,
  target_building_id TEXT,
  difficulty TEXT, -- 'easy', 'normal', 'hard'
  time_limit INTEGER, -- segundos
  time_elapsed INTEGER,
  status TEXT, -- 'in_progress', 'completed', 'failed'
  result TEXT, -- 'captured', 'timeout', 'wrong_suspect'
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE TABLE investigation_log (
  id INTEGER PRIMARY KEY,
  game_id INTEGER,
  action_type TEXT,
  location_id TEXT,
  time_consumed INTEGER,
  clue_obtained TEXT,
  created_at TIMESTAMP
);
```

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 5: Frontend - Interfaz Retro Carmen Sandiego (Semana 4-5)

### 5.1 Pantallas
1. **Login/Registro**
2. **Menú Principal** (Nueva Partida, Ranking, Historial)
3. **Pantalla de Dificultad**
4. **Briefing del Caso**
5. **Mapa de Santiago** (interactivo)
6. **Pantalla de Investigación**
7. **Pantalla de Análisis de Pistas**
8. **Pantalla de Captura**
9. **Pantalla de Resultado**
10. **Ranking Global**

### 5.2 Diseño Visual
- Paleta de colores oscuros (gris, negro, rojo oscuro, azul oscuro)
- Estilo retro tipo Carmen Sandiego 1991
- Tipografía monoespaciada para sensación policial
- Animaciones sutiles y sonidos de interfaz

### 5.3 Assets Necesarios
- [ ] Mapas de Santiago (zonas)
- [ ] Iconos de acciones investigativas
- [ ] Avatares de sospechosos
- [ ] Efectos de sonido (beeps, clicks)
- [ ] Música de fondo retro

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 6: Sistema de Ranking y Persistencia (Semana 5-6)

### 6.1 Leaderboard
```sql
CREATE TABLE leaderboard (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  game_id INTEGER,
  difficulty TEXT,
  time_taken INTEGER,
  success BOOLEAN,
  created_at TIMESTAMP
);
```

### 6.2 Funcionalidades
- [ ] Cálculo automático de ranking por dificultad
- [ ] Estadísticas del jugador (tasas de éxito, mejores tiempos)
- [ ] Historial de partidas
- [ ] Comparativa con otros jugadores

### 6.3 Endpoints
- `GET /api/leaderboard?difficulty=normal`
- `GET /api/leaderboard/user/:userId`
- `GET /api/stats/:userId`

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 7: Panel de Administración (Semana 6-7)

### 7.1 Funcionalidades
- [ ] Edición de diálogos por sección
- [ ] CRUD de locaciones
- [ ] CRUD de perfiles de sospechosos
- [ ] CRUD de edificios objetivo
- [ ] Gestión de usuarios
- [ ] Visualización de logs de juego
- [ ] Control de configuración (LDAP, tiempos, etc.)

### 7.2 Seguridad
- [ ] Rol de administrador
- [ ] Validación de permisos
- [ ] Auditoría de cambios
- [ ] Backup automático

### 7.3 Endpoints
- `GET /api/admin/dialogues`
- `PUT /api/admin/dialogues/:section`
- `GET /api/admin/locations`
- `POST /api/admin/locations`
- `PUT /api/admin/locations/:id`
- `DELETE /api/admin/locations/:id`
- Similar para suspects, buildings, etc.

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 8: Integración LDAP/Active Directory (Semana 7-8)

### 8.1 Configuración
- [ ] Parámetros de conexión LDAP (configurable en .env)
- [ ] Sync de usuarios desde AD
- [ ] Mapeo de roles desde LDAP
- [ ] Fallback a autenticación local

### 8.2 Endpoints
- `POST /api/auth/ldap-login`
- `GET /api/admin/ldap/sync`

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 9: Testing y Optimización (Semana 8-9)

### 9.1 Testing
- [ ] Unit tests (backend)
- [ ] Integration tests (API)
- [ ] E2E tests (flujos completos)
- [ ] Testing en diferentes navegadores

### 9.2 Optimización
- [ ] Compresión de assets
- [ ] Caching de datos
- [ ] Optimización de BD
- [ ] Análisis de performance

### 9.3 Documentación
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] User Guide
- [ ] Admin Guide
- [ ] Developer Guide

**Estado:** ⏳ No iniciado

---

## 🎯 ETAPA 10: Deploy y Producción (Semana 9-10)

### 10.1 Deployments
- [ ] Configurar servidor (Docker, nginx)
- [ ] SSL/TLS
- [ ] Database backup strategy
- [ ] Monitoring y logging
- [ ] CI/CD pipeline (GitHub Actions)

### 10.2 Validación Final
- [ ] Pruebas de funcionalidad
- [ ] Pruebas de seguridad
- [ ] Pruebas de carga
- [ ] Documentación actualizada

**Estado:** ⏳ No iniciado

---

## 📊 Timeline Resumido

| Etapa | Duración | Estado |
|-------|----------|--------|
| 1. Infraestructura Base | 1 semana | ⏳ No iniciado |
| 2. Autenticación | 1-2 semanas | ⏳ No iniciado |
| 3. Base de Datos de Contenido | 1-2 semanas | ⏳ No iniciado |
| 4. Backend - Lógica del Juego | 2 semanas | ⏳ No iniciado |
| 5. Frontend - Interfaz Retro | 2 semanas | ⏳ No iniciado |
| 6. Ranking y Persistencia | 1 semana | ⏳ No iniciado |
| 7. Panel de Administración | 1-2 semanas | ⏳ No iniciado |
| 8. LDAP/AD Integration | 1 semana | ⏳ No iniciado |
| 9. Testing y Optimización | 1-2 semanas | ⏳ No iniciado |
| 10. Deploy y Producción | 1 semana | ⏳ No iniciado |
| **TOTAL** | **10-14 semanas** | - |

---

## 🎮 Cómo Probar Cada Etapa

Después de cada etapa completada, podrás:
1. Hacer pull del código actualizado
2. Ejecutar `npm install` y `npm start`
3. Acceder a `http://localhost:3000`
4. Probar las funcionalidades de esa etapa
5. Reportar cambios/ajustes necesarios

---

## 📝 Notas Importantes

- **Iterativo:** Cada etapa es independiente pero complementaria
- **Flexible:** Cambios pueden hacerse en cualquier momento
- **Documentado:** Cada commit incluirá documentación clara
- **Testeable:** Funcionalidades se prueban al terminar cada etapa
- **Escalable:** Arquitectura permite agregar características sin afectar las existentes

---

## 🚀 Comenzar

Vamos a iniciar con la **ETAPA 1: Infraestructura Base** inmediatamente.

¿Confirmado para proceder?
