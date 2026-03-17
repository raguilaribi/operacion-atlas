# OPERACIÓN ATLAS - PLAN DE DESARROLLO ITERATIVO

**Actualizado**: 17 de Marzo, 2026  
**Autor**: Rodrigo Alejandro Aguilar Saavedra  
**Repositorio**: [operacion-atlas](https://github.com/raguilaribi/operacion-atlas)  

---

## 📋 VISIÓN GENERAL

**OPERACIÓN ATLAS** es un juego web narrativo inmersivo donde el jugador es un **Agente Especial de Inteligencia** que debe identificar, rastrear y neutralizar amenazas terroristas en Santiago, Chile en contra reloj.

### Concepto
- 🎮 Estilo: Carmen Sandiego (1991) + thriller de inteligencia
- 🕐 Dinámica: Carreras contra el tiempo con presión real
- 🗺️ Escenario: ~100 locaciones reales de Santiago
- 👥 Antagonistas: 5 perfiles extremistas con motivaciones complejas
- 🎯 Mecánica: Investigación + deducción + presión temporal
- 🏆 Competencia: Ranking global de jugadores

### Confirmaciones del Cliente
✅ Stack: Node.js + Express | SQLite | HTML5 + CSS3 + JS Vanilla  
✅ Contenido: ~100 locaciones, 5 sospechosos, 5 edificios objetivo  
✅ Tiempos: FÁCIL(5h), NORMAL(3h), DIFÍCIL(1h)  
✅ Diálogos: Completamente editables en panel admin  
✅ Autenticación: LDAP/Active Directory configurable  
✅ Modelo: Fases iterativas sin deadline

---

## 📊 TABLA DE CONTENIDOS

1. [Confirmación de Requisitos](#confirmación-de-requisitos)
2. [Plan de 9 Fases](#plan-de-9-fases)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Stack Tecnológico Detallado](#stack-tecnológico-detallado)
5. [Modelo de Datos](#modelo-de-datos)
6. [Checklist General](#checklist-general)
7. [Timeline y Milestones](#timeline-y-milestones)

---

## ✅ CONFIRMACIÓN DE REQUISITOS

### Stack Tecnológico
```
┌─────────────────────────────────────┐
│ FRONTEND                            │
│ • HTML5 (semántica)                 │
│ • CSS3 (Grid, Flexbox, animaciones) │
│ • JavaScript Vanilla (sin framework)│
└─────────────────────────────────────┘
        ↓ HTTP (JSON) ↓
┌─────────────────────────────────────┐
│ BACKEND                             │
│ • Node.js                           │
│ • Express.js                        │
│ • Middleware: Auth, Error Handler   │
└─────────────────────────────────────┘
        ↓ SQL ↓
┌─────────────────────────────────────┐
│ BASE DE DATOS                       │
│ • SQLite3                           │
│ • JSON para configuración           │
│ • LDAP/AD (integración futura)      │
└─────────────────────────────────────┘
```

### Contenido del Juego
| Elemento | Cantidad | Estado |
|----------|----------|--------|
| Locaciones de Santiago | ~100 | ⏳ Por crear |
| Perfiles de sospechosos | 5 | ⏳ Por crear |
| Edificios objetivo | 5 | ⏳ Por crear |
| Acciones investigativas | 4 | ✅ Definidas |
| Dificultades | 3 | ✅ Definidas |
| Diálogos editables | múltiples | ⏳ Por crear |
| Pistas (v/f) | dinámicas | ⏳ Por crear |

### Tiempos de Juego
| Dificultad | Simulación | Tiempo Real | Multiplicador Puntos |
|-----------|-----------|-------------|----------------------|
| 🟢 FÁCIL  | 5 horas   | 300 min     | 1.0x |
| 🟡 NORMAL | 3 horas   | 180 min     | 1.5x |
| 🔴 DIFÍCIL| 1 hora    | 60 min      | 2.0x |

---

## 📅 PLAN DE 9 FASES

### FASE 1: INFRAESTRUCTURA BASE Y AUTENTICACIÓN
**Duración estimada**: 2 semanas  
**Objetivo**: Proyecto operativo con login funcional  
**Estado**: 🔄 EN DESARROLLO

#### Deliverables
- [x] Repositorio GitHub configurado
- [x] Estructura de carpetas creada
- [x] Package.json con dependencias base
- [x] Estilos CSS retro (main.css + game.css) ✅
- [ ] Express server corriendo
- [ ] SQLite BD inicializada
- [ ] Autenticación JWT básica
- [ ] Pantalla de login/registro funcional
- [ ] README.md con instrucciones

#### Tareas Técnicas
1. **Backend**
   - [ ] Crear `server.js` con Express
   - [ ] Configurar middleware (CORS, bodyParser, error handling)
   - [ ] Crear rutas `/api/health`, `/api/auth/login`, `/api/auth/register`
   - [ ] Implementar JWT middleware
   - [ ] Crear modelos User en SQLite
   - [ ] Hash de contraseñas con bcrypt

2. **Frontend**
   - [ ] HTML5 estructura semántica
   - [ ] CSS retro (ya completado)
   - [ ] Formularios de login/registro
   - [ ] Validación de formularios (vanilla JS)
   - [ ] Integración con `/api/auth/*`
   - [ ] Manejo de sesiones (localStorage)

3. **Base de Datos**
   ```sql
   -- Users
   CREATE TABLE users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     email TEXT UNIQUE,
     password_hash TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_login TIMESTAMP,
     auth_type TEXT DEFAULT 'local'
   );
   
   -- Sessions
   CREATE TABLE sessions (
     id TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     token TEXT NOT NULL,
     expires_at TIMESTAMP,
     FOREIGN KEY(user_id) REFERENCES users(id)
   );
   ```

#### Testing
- [ ] Registrar usuario nuevo
- [ ] Login exitoso
- [ ] Login fallido (credenciales incorrectas)
- [ ] Token JWT válido
- [ ] Logout limpia sesión

#### Notas
- Estilos CSS ya están listos: `main.css` + `game.css`
- No hay deadline, pero aprox. 2 semanas
- Documentar cada commit

---

### FASE 2: PANTALLA HOME Y SELECTORES
**Duración estimada**: 1 semana  
**Objetivo**: Sistema de inicio de sesión completamente funcional  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Pantalla home personalizada (Agente [nombre])
- [ ] Grid de acciones: Nuevo Juego, Rankings, Admin, Perfil
- [ ] Selector de dificultad con descripciones
- [ ] Animaciones hover y transiciones
- [ ] API para datos de usuario

#### Tareas Técnicas
1. **Frontend - Pantalla Home**
   - [ ] HTML estructura
   - [ ] CSS grid responsive
   - [ ] Cards con acciones
   - [ ] Información del usuario (nombre, ranking actual)

2. **Frontend - Selector de Dificultad**
   - [ ] 3 cards (Fácil, Normal, Difícil)
   - [ ] Mostrar tiempos, multiplicadores, beneficios
   - [ ] Click inicia nueva partida
   - [ ] Transiciones suaves

3. **Backend**
   - [ ] GET `/api/user/profile` → datos del jugador
   - [ ] GET `/api/leaderboard` → top 10 global
   - [ ] POST `/api/game/new` → crear sesión de juego
   - [ ] GET `/api/game/current` → obtener sesión activa

4. **Base de Datos**
   ```sql
   CREATE TABLE game_sessions (
     id TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     difficulty TEXT NOT NULL, -- 'easy', 'normal', 'hard'
     suspect_id TEXT,
     time_limit INTEGER, -- segundos
     time_remaining INTEGER,
     status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
     started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     ended_at TIMESTAMP,
     FOREIGN KEY(user_id) REFERENCES users(id)
   );
   
   CREATE TABLE leaderboard (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     game_id TEXT NOT NULL,
     difficulty TEXT NOT NULL,
     points INTEGER,
     time_taken INTEGER, -- segundos
     captured_correct BOOLEAN,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY(user_id) REFERENCES users(id),
     FOREIGN KEY(game_id) REFERENCES game_sessions(id)
   );
   ```

#### Testing
- [ ] Ver pantalla home después de login
- [ ] Datos de usuario muestran correctamente
- [ ] Selector de dificultad funciona
- [ ] Crear nueva partida
- [ ] Ver leaderboard global

---

### FASE 3: BASE DE DATOS DE CONTENIDO
**Duración estimada**: 1.5 semanas  
**Objetivo**: Contenido completo del juego estructurado  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] ~100 locaciones de Santiago documentadas
- [ ] 5 perfiles extremistas creados
- [ ] 5 edificios objetivo definidos
- [ ] Sistema de pistas verdaderas/falsas
- [ ] Diálogos base escritos (editables luego)
- [ ] JSON + tablas SQL pobladas

#### Tareas Técnicas
1. **Locaciones de Santiago (~100)**
   ```json
   {
     "id": "loc_001",
     "name": "La Moneda",
     "address": "Teatinos 120, Santiago Centro",
     "coordinates": [-70.6372, -33.4489],
     "category": "security", // security, administrative, commercial, religious, residential, educational, healthcare
     "npcs": ["npc_001", "npc_002"],
     "clue_probability": 0.7,
     "investigation_time": 15, // minutos
     "accessibility": true,
     "description": "Palacio presidencial, máxima seguridad"
   }
   ```

2. **Perfiles de Sospechosos (5)**
   ```json
   {
     "id": "suspect_001",
     "profile_type": "far_right", // far_right, far_left, eco_extreme, religious_extreme, gender_extreme
     "name": "Carlos Mendoza",
     "aliases": ["El Patriota", "CM"],
     "age_range": "35-40",
     "description": "Físico, nacionalismo extremo, redes de derecha radical...",
     "ideology": "Nacionalismo étnico extremo",
     "motivation": "Derrocar régimen considerado corrupto",
     "associates": ["suspect_002", "suspect_003"],
     "target_building": "building_001", // La Moneda
     "known_locations": ["loc_025", "loc_045", "loc_067"],
     "activity_pattern": {
       "morning": "loc_045",
       "afternoon": "loc_025",
       "evening": "loc_067"
     },
     "methods": ["explosives", "timing_device"],
     "danger_level": 9 // 1-10
   }
   ```

3. **Edificios Objetivo (5)**
   ```json
   {
     "id": "building_001",
     "name": "La Moneda",
     "address": "Teatinos 120, Santiago Centro",
     "security_level": 10,
     "vulnerable_points": ["sotano_sur", "acceso_norte"],
     "npcs_present": 15,
     "description": "Palacio presidencial con vigilancia de élite"
   }
   ```

4. **Pistas (Verdaderas y Falsas)**
   ```json
   {
     "clues": [
       {
         "id": "clue_001",
         "type": "true", // true or false
         "suspect_id": "suspect_001",
         "location_id": "loc_025",
         "text": "Vieron a un hombre rubio de 40s hablando en clave",
         "confidence": 0.85,
         "source": "witness_interview"
       },
       {
         "id": "clue_002",
         "type": "false",
         "suspect_id": ["suspect_002", "suspect_003"], // pistas falsas pueden dirigir a otros
         "location_id": "loc_045",
         "text": "Se vio entrar gente sospechosa al edificio",
         "confidence": 0.30,
         "source": "database_search"
       }
     ]
   }
   ```

5. **Diálogos Base (Editables luego)**
   ```json
   {
     "sections": {
       "briefing": {
         "intro": "Agente, bienvenido a la Sala de Operaciones...",
         "threat_assessment": "Hemos detectado actividad subversiva...",
         "mission_objective": "Tu objetivo es identificar y neutralizar..."
       },
       "investigation": {
         "interrogation": "¿Qué información tienes para mí?",
         "database": "Accediendo a bases de datos clasificadas...",
         "surveillance": "Iniciando operación de vigilancia...",
         "analysis": "Analizando documentos..."
       },
       "success": {
         "correct_capture": "¡Excelente trabajo, agente! Hemos capturado al objetivo correcto.",
         "mission_complete": "La operación ha sido un éxito. Atentado neutralizado."
       },
       "failure": {
         "timeout": "Se acabó el tiempo. El atentado ha ocurrido...",
         "wrong_suspect": "Hemos detenido al sospechoso equivocado. Operación FALLIDA.",
         "escape": "El sospechoso ha escapado. No fue posible capturarlo a tiempo."
       }
     }
   }
   ```

#### Testing
- [ ] Cargar ~100 locaciones desde DB
- [ ] Mostrar perfiles de sospechosos
- [ ] Sistema de pistas generando correctamente
- [ ] Diálogos aparecen en pantalla
- [ ] Datos consistentes

---

### FASE 4: LÓGICA DE INVESTIGACIÓN
**Duración estimada**: 2 semanas  
**Objetivo**: Mecánica central del juego  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] 4 acciones investigativas implementadas
- [ ] Sistema de pistas dinámicas
- [ ] Consumo de tiempo por acción
- [ ] Actualización de sospechas
- [ ] Gráfico de confianza
- [ ] Pantalla interactiva de mapa

#### 4 Acciones Investigativas
```
1️⃣ BÚSQUEDA EN BASE DE DATOS
   ├─ Tiempo: 5 minutos
   ├─ Información: Media
   ├─ Precisión: 70%
   └─ Fuente: Registros gubernamentales

2️⃣ INTERROGATORIO A TESTIGOS
   ├─ Tiempo: 15 minutos
   ├─ Información: Variable
   ├─ Precisión: 50% (testigos pueden confundir)
   └─ Fuente: Entrevistas directas

3️⃣ VIGILANCIA ACTIVA
   ├─ Tiempo: 25 minutos
   ├─ Información: Alta y confiable
   ├─ Precisión: 90%
   └─ Fuente: Observación directa

4️⃣ ANÁLISIS DE DOCUMENTOS
   ├─ Tiempo: 10 minutos
   ├─ Información: Específica
   ├─ Precisión: 85%
   └─ Fuente: Comunicaciones, registros
```

#### Tareas Técnicas
1. **Backend - Lógica de Investigación**
   ```javascript
   // POST /api/game/investigate
   // Body: { action: 'interrogation', location_id: 'loc_025', suspect_id: 'suspect_001' }
   // Response: { clue: {...}, time_consumed: 15, confidence_change: +0.15 }
   ```

2. **Sistema de Confianza de Sospechosos**
   - Cada sospechoso: confianza 0-100%
   - Cada acción: aumenta/disminuye confianza según pista
   - Pistas verdaderas: aumentan confianza en correcto sospechoso
   - Pistas falsas: aumentan confianza en sospechosos incorrectos

3. **Frontend - Interfaz de Investigación**
   - Mapa de Santiago (grid 10x10 o similar)
   - Click en locación: abrir acciones investigativas
   - Lista de 4 botones (B. Datos, Interrogatorio, Vigilancia, Análisis)
   - Confirmación de tiempo requerido
   - Mostrar pista obtenida
   - Actualizar gráfico de sospechosos en tiempo real

4. **Base de Datos**
   ```sql
   CREATE TABLE investigation_actions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     game_id TEXT NOT NULL,
     action_type TEXT NOT NULL, -- 'database', 'interrogation', 'surveillance', 'analysis'
     location_id TEXT NOT NULL,
     time_consumed INTEGER NOT NULL, -- segundos
     clue_obtained TEXT,
     suspect_confidence_change JSON, -- {suspect_id: delta, ...}
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY(game_id) REFERENCES game_sessions(id)
   );
   
   CREATE TABLE suspect_confidence (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     game_id TEXT NOT NULL,
     suspect_id TEXT NOT NULL,
     confidence REAL DEFAULT 0.2, -- 0-1
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY(game_id) REFERENCES game_sessions(id)
   );
   ```

#### Testing
- [ ] Realizar cada acción
- [ ] Tiempo se consume correctamente
- [ ] Pistas se revelan
- [ ] Confianza actualiza
- [ ] Gráfico muestra cambios
- [ ] No puedo actuar si falta tiempo

---

### FASE 5: PANTALLA DE MAPA Y TIMER
**Duración estimada**: 1.5 semanas  
**Objetivo**: Interfaz principal de juego  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Mapa interactivo de Santiago
- [ ] Visualización de 100 locaciones
- [ ] Timer en vivo (cuenta regresiva)
- [ ] Indicadores visuales (tiempo bajo, etc)
- [ ] Pantalla de gráfico de sospechosos

#### Tareas Técnicas
1. **Mapa de Santiago**
   - Grid o canvas
   - ~100 puntos interactivos
   - Colores según categoría
   - Hover: mostrar nombre
   - Click: investigar

2. **Timer**
   - Reloj digital (hh:mm:ss)
   - Cuenta regresiva automática
   - Alerta visual cuando < 10 minutos
   - Sonido al 1 minuto
   - Juego termina en 0:00

3. **Gráfico de Sospechosos**
   - 5 barras de confianza (0-100%)
   - Actualizan en tiempo real
   - Colores según nivel (rojo si > 80%)
   - Nombres y fotos

#### Testing
- [ ] Mapa carga con 100 locaciones
- [ ] Click en locación abre acciones
- [ ] Timer cuenta correctamente
- [ ] Gráfico actualiza con acciones
- [ ] Responsive en mobile

---

### FASE 6: SISTEMA DE ACUSACIÓN Y RESULTADO
**Duración estimada**: 1 semana  
**Objetivo**: Conclusión del juego  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Pantalla de acusación
- [ ] Cálculo de puntuación
- [ ] Pantalla de resultado (éxito/fracaso)
- [ ] Integración con leaderboard
- [ ] Opción de jugar de nuevo

#### Fórmula de Puntuación
```
Puntos = Base × Multiplicador_Dificultad × Bonus_Tiempo

Base = 1000 (acusación correcta)
Multiplicador:
  - FÁCIL: 1.0x
  - NORMAL: 1.5x
  - DIFÍCIL: 2.0x

Bonus_Tiempo = (Tiempo_Restante / Tiempo_Total) × 500

Ejemplo:
- Dificultad NORMAL
- Acertó en 120 de 180 minutos (60 min restantes)
- Puntos = 1000 × 1.5 × (60/180 × 500) = 1000 × 1.5 × 166.67 = 250,005 puntos
```

#### Tareas Técnicas
1. **Pantalla de Acusación**
   - Selector de sospechoso
   - Resumen de pistas encontradas
   - Confirmación final
   - Botón "ACUSAR"

2. **Backend - Validación**
   ```javascript
   // POST /api/game/capture
   // Body: { game_id, suspect_id }
   // Response: { success: true/false, points: 250005, rank: 45 }
   ```

3. **Pantalla de Resultado**
   - Si correcto: "OPERACIÓN EXITOSA" + estadísticas
   - Si incorrecto: "OPERACIÓN FALLIDA" + culpable real
   - Mostrar puntos y ranking
   - Botón "Volver a Home" o "Jugar de nuevo"

4. **Base de Datos**
   - Guardar resultado en leaderboard
   - Actualizar puntuación de usuario

#### Testing
- [ ] Acusar sospechoso correcto = éxito
- [ ] Acusar sospechoso incorrecto = fracaso
- [ ] Puntuación calcula correctamente
- [ ] Leaderboard se actualiza
- [ ] Puede jugar de nuevo

---

### FASE 7: PANEL DE ADMINISTRACIÓN
**Duración estimada**: 2 semanas  
**Objetivo**: Sistema para editar contenido del juego  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Panel de admin protegido
- [ ] Editor de diálogos por sección
- [ ] CRUD de locaciones
- [ ] CRUD de sospechosos
- [ ] CRUD de edificios
- [ ] Dashboard de estadísticas
- [ ] Log de cambios

#### Tareas Técnicas
1. **Autenticación de Admin**
   - Rol "admin" en tabla users
   - Middleware verificar admin
   - GET `/admin/panel` (protegido)

2. **Editor de Diálogos**
   - Tabs por sección (briefing, investigación, etc)
   - Textarea editable
   - Botón Guardar
   - Preview en vivo
   - PUT `/api/admin/dialogues/:section`

3. **Gestores CRUD**
   - Locaciones: crear, editar, eliminar, visualizar
   - Sospechosos: crear, editar, eliminar
   - Edificios: crear, editar, eliminar
   - Endpoints: GET, POST, PUT, DELETE

4. **Dashboard de Estadísticas**
   - Partidas totales
   - Tasa de éxito por dificultad
   - Sospechoso más acusado
   - Tiempo promedio
   - Ranking top 10

5. **Log de Cambios**
   ```sql
   CREATE TABLE admin_audit_log (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     admin_id INTEGER NOT NULL,
     action TEXT, -- 'create', 'update', 'delete'
     table_name TEXT,
     record_id TEXT,
     changes JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

#### Testing
- [ ] Solo admin puede acceder
- [ ] Editar diálogos
- [ ] CRUD locaciones
- [ ] CRUD sospechosos
- [ ] Ver estadísticas
- [ ] Log de cambios registra acciones

---

### FASE 8: AUTENTICACIÓN LDAP/ACTIVE DIRECTORY
**Duración estimada**: 1 semana  
**Objetivo**: Integración con sistemas empresariales  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Soporte LDAP configurble
- [ ] Soporte Active Directory
- [ ] Fallback a autenticación local
- [ ] Configuración en .env
- [ ] Sincronización de usuarios

#### Tareas Técnicas
1. **Implementación LDAP**
   - Librería: `ldapjs`
   - Parámetros en `.env`: LDAP_URL, LDAP_BASE, etc
   - POST `/api/auth/ldap-login`
   - Crear usuario local si no existe

2. **Configuración .env**
   ```
   AUTH_TYPE=local # local, ldap, ad
   LDAP_URL=ldap://ldap.example.com:389
   LDAP_BASE=dc=example,dc=com
   LDAP_BIND_DN=cn=admin,dc=example,dc=com
   LDAP_BIND_PASSWORD=secret
   ```

3. **Fallback**
   - Si LDAP falla, intentar local
   - Opciones múltiples en login

#### Testing
- [ ] Login con LDAP funciona
- [ ] Fallback a local si LDAP no disponible
- [ ] Usuarios sincronizados

---

### FASE 9: TESTING, OPTIMIZACIÓN Y DEPLOY
**Duración estimada**: 2 semanas  
**Objetivo**: Aplicación lista para producción  
**Estado**: ⏳ Pendiente

#### Deliverables
- [ ] Testing manual completo
- [ ] Testing automatizado (opcional)
- [ ] Optimización de performance
- [ ] Documentación completa
- [ ] Aplicación deployada

#### Tareas Técnicas
1. **Testing Manual**
   - Flujo completo (login → juego → resultado)
   - Todas las dificultades
   - Casos edge (tiempo 0, etc)
   - Panel admin
   - Responsividad

2. **Optimización**
   - Minify JS/CSS
   - Comprimir imágenes
   - Caché de datos estáticos
   - Query optimization (DB)

3. **Documentación**
   - README.md completo
   - API.md detallado
   - Admin Guide
   - User Guide
   - Comentarios en código

4. **Deployment**
   - Servidor (Heroku, DigitalOcean, etc)
   - SSL/TLS
   - Variables de entorno en prod
   - Backup automático BD
   - Monitoreo

#### Testing Checklist
- [ ] Registrar usuario
- [ ] Login exitoso
- [ ] Ver home
- [ ] Seleccionar dificultad
- [ ] Ver briefing
- [ ] Investigar todas las acciones
- [ ] Acusar correcto → éxito
- [ ] Acusar incorrecto → fracaso
- [ ] Ver ranking
- [ ] Admin panel accesible (admin)
- [ ] Editar diálogos
- [ ] Crear/editar locaciones
- [ ] Responsive en mobile/tablet
- [ ] Velocidad de carga < 2s
- [ ] Sin errores en consola

---

## 📁 ESTRUCTURA DE DIRECTORIOS

```
operacion-atlas/
├── backend/
│   ├── server.js                 # Express entry point
│   ├── config.js                 # Configuración global
│   ├── package.json              # Dependencias
│   │
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── game.js              # /api/game/*
│   │   ├── admin.js             # /api/admin/*
│   │   └── leaderboard.js       # /api/leaderboard/*
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── adminCheck.js        # Admin role verification
│   │   └── errorHandler.js      # Error handling
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── GameSession.js
│   │   ├── Suspect.js
│   │   ├── Location.js
│   │   └── Leaderboard.js
│   │
│   ├── db/
│   │   ├── init.js              # Inicializar BD
│   │   ├── schema.sql           # Esquema SQL
│   │   └── seed.js              # Datos iniciales
│   │
│   └── data/
│       ├── dialogues.json       # Diálogos editables
│       ├── suspects.json        # Perfiles sospechosos
│       ├── locations.json       # ~100 locaciones Santiago
│       ├── buildings.json       # 5 edificios objetivo
│       └── clues.json           # Pistas v/f
│
├── frontend/
│   ├── index.html               # HTML principal
│   ├── admin.html               # Panel de admin
│   │
│   ├── css/
│   │   ├── main.css             # Estilos base
│   │   ├── game.css             # Estilos juego
│   │   └── admin.css            # Estilos admin
│   │
│   ├── js/
│   │   ├── app.js               # Main JS
│   │   ├── auth.js              # Lógica autenticación
│   │   ├── game.js              # Lógica del juego
│   │   ├── admin.js             # Lógica admin panel
│   │   ├── ui.js                # Funciones UI
│   │   ├── api.js               # Cliente HTTP
│   │   └── utils.js             # Utilidades
│   │
│   └── assets/
│       ├── images/              # Avatares, mapas, etc
│       ├── sounds/              # Efectos de sonido
│       └── fonts/               # Tipografías retro
│
├── .env.example                 # Variables de entorno ejemplo
├── .gitignore                   # Git ignore
├── README.md                    # Documentación principal
├── API.md                       # Documentación API
└── PLAN_DESARROLLO.md           # Este archivo
```

---

## 🛠️ STACK TECNOLÓGICO DETALLADO

### Backend
```javascript
// package.json dependencies
{
  "express": "^4.18.0",         // Framework web
  "sqlite3": "^5.1.0",          // Base de datos
  "jsonwebtoken": "^9.0.0",     // JWT auth
  "bcryptjs": "^2.4.3",         // Hash de contraseñas
  "dotenv": "^16.0.0",          // Variables de entorno
  "cors": "^2.8.5",             // CORS middleware
  "ldapjs": "^2.3.0"            // LDAP cliente (opcional)
}
```

### Frontend
- HTML5 semántica (sin frameworks)
- CSS3 Grid + Flexbox + Animaciones
- JavaScript Vanilla (ES6+)
- Fetch API para HTTP
- LocalStorage para sesiones

### Base de Datos
- SQLite3 (archivo local)
- JSON para configuración (editable en admin)
- ~50-100 KB total

---

## 📊 MODELO DE DATOS

```
users
├── id
├── username
├── email
├── password_hash
├── auth_type (local|ldap|ad)
├── created_at
└── last_login

game_sessions
├── id
├── user_id → users.id
├── difficulty (easy|normal|hard)
├── suspect_id → suspects.id
├── time_limit
├── time_remaining
├── status
├── started_at
└── ended_at

suspects
├── id
├── profile_type
├── name
├── description
├── ideology
├── target_building
└── activity_pattern

locations
├── id
├── name
├── address
├── coordinates
├── category
└── investigation_time

investigation_actions
├── id
├── game_id → game_sessions.id
├── action_type (database|interrogation|surveillance|analysis)
├── location_id → locations.id
├── time_consumed
├── clue_obtained
└── created_at

leaderboard
├── id
├── user_id → users.id
├── game_id → game_sessions.id
├── difficulty
├── points
├── time_taken
├── captured_correct
└── created_at
```

---

## ✅ CHECKLIST GENERAL

### Infraestructura
- [ ] Repositorio GitHub operativo
- [ ] .gitignore configurado
- [ ] README.md inicial
- [ ] package.json con dependencias
- [ ] .env.example con variables

### Backend Base
- [ ] Express servidor corriendo
- [ ] SQLite BD operativa
- [ ] Middleware: CORS, body-parser, error handler
- [ ] Autenticación JWT
- [ ] Rutas de salud (/api/health)

### Autenticación
- [ ] Registro de usuarios
- [ ] Login local
- [ ] Gestión de sesiones
- [ ] Protección de rutas
- [ ] LDAP integrado (opcional)

### Contenido del Juego
- [ ] ~100 locaciones de Santiago
- [ ] 5 perfiles extremistas
- [ ] 5 edificios objetivo
- [ ] Sistema de pistas v/f
- [ ] Diálogos editables

### Mecánica del Juego
- [ ] 4 acciones investigativas
- [ ] Sistema de tiempo
- [ ] Cálculo de confianza
- [ ] Sistema de puntuación
- [ ] Detección de captura

### Frontend
- [ ] HTML5 estructura
- [ ] CSS retro (main.css + game.css)
- [ ] Pantalla de login
- [ ] Pantalla de home
- [ ] Pantalla de dificultad
- [ ] Pantalla de juego (mapa + timer)
- [ ] Pantalla de resultado
- [ ] Pantalla de ranking

### Panel Admin
- [ ] Acceso protegido
- [ ] Editor de diálogos
- [ ] CRUD locaciones
- [ ] CRUD sospechosos
- [ ] CRUD edificios
- [ ] Dashboard estadísticas
- [ ] Log de auditoría

### Testing
- [ ] Flujo completo de login
- [ ] Flujo completo de juego
- [ ] Acusación correcta e incorrecta
- [ ] Leaderboard
- [ ] Panel admin
- [ ] Responsividad
- [ ] Performance

### Documentación
- [ ] README.md completo
- [ ] API.md detallado
- [ ] Admin Guide
- [ ] Comentarios en código
- [ ] Changelog.md

### Deployment
- [ ] Servidor configurado
- [ ] SSL/TLS
- [ ] Variables de entorno prod
- [ ] Backup BD
- [ ] Monitoreo
- [ ] CI/CD (opcional)

---

## 📈 TIMELINE Y MILESTONES

| Fase | Duración | Milestone | Estado |
|------|----------|-----------|--------|
| 1. Infraestructura | 2 sem | Sistema login funcional | 🔄 EN DESARROLLO |
| 2. Home & Dificultad | 1 sem | Iniciar partida | ⏳ Pendiente |
| 3. Contenido | 1.5 sem | BD poblada | ⏳ Pendiente |
| 4. Investigación | 2 sem | Mecánica central | ⏳ Pendiente |
| 5. Mapa & Timer | 1.5 sem | Interfaz jugable | ⏳ Pendiente |
| 6. Acusación | 1 sem | Juego completable | ⏳ Pendiente |
| 7. Admin Panel | 2 sem | Contenido editable | ⏳ Pendiente |
| 8. LDAP/AD | 1 sem | Empresarial ready | ⏳ Pendiente |
| 9. Testing/Deploy | 2 sem | Producción | ⏳ Pendiente |
| **TOTAL** | **13-14 sem** | **MVP Completo** | - |

---

## 🚀 CÓMO PROCEDER

### Inicio Rápido
1. Clonar repositorio
2. `cd backend` → `npm install` → `npm start`
3. Abrir `http://localhost:3000` en navegador
4. Registrarse y comenzar a probar

### Después de Cada Fase
1. Hacer pull del código actualizado
2. Verificar funcionalidades nuevas
3. Reportar bugs/feedback
4. Seguir con siguiente fase

### Estructura de Commits
```
[FASE-X] Feat: descripción corta

- Detalles de cambios
- Detalles técnicos
- Testing realizado
```

---

## 📞 CONTACTO

**Desarrollador**: Rodrigo Alejandro Aguilar Saavedra  
**GitHub**: [@raguilaribi](https://github.com/raguilaribi)  
**Ubicación**: Santiago, Chile  
**Repositorio**: [operacion-atlas](https://github.com/raguilaribi/operacion-atlas)  

---

**Última actualización**: 17 de Marzo, 2026  
**Versión del Plan**: 2.0
