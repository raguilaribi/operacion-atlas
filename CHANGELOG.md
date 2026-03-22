# Changelog - Operacion Atlas

Todos los cambios notables en este proyecto estan documentados aqui.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planeado
- Sistema de notificaciones en tiempo real con WebSockets
- Sistema de reportes avanzado con exportacion PDF/Excel
- Dashboard de metricas con graficos interactivos
- Sistema de roles y permisos granulares
- Sistema de backup automatico

---

## [0.6.0] - 2026-03-22

### Agregado - FASE 6: Testing y optimizaciones

#### Testing Backend
- ✅ `backend/tests/admin.test.js` actualizado al contrato actual de autenticacion (/auth)
  - Usa `username` + `password` en login
  - Usa `passwordConfirm` en registro
  - Extrae `tokens.accessToken` segun nueva respuesta de /auth
  - Crea usuarios de prueba con sufijo `_f6` y los limpia al final del suite
- ✅ Nuevo archivo `backend/tests/auth.test.js`
  - Pruebas basicas de registro y login de usuarios
  - Verificacion de estructura de respuesta (user + tokens.accessToken)
- ✅ Nuevo archivo `backend/tests/game.test.js`
  - Pruebas basicas para `/api/v1/games/start` y `/api/v1/games/:gameId/action`
  - Verifica que se pueda iniciar una partida y ejecutar una accion de investigacion usando los datos stub de la FASE 5

#### Optimizaciones de entorno de pruebas
- ✅ `package.json` actualizado para ejecutar `jest --runInBand` en el script `test`
  - Evita conflictos de concurrencia con SQLite al correr multiples suites
  - Mejora la estabilidad de los tests de integracion contra la misma base de datos

> Nota: Estas pruebas iniciales de FASE 6 cubren flujos felices principales. Futuros incrementos pueden ampliar cobertura (errores, limites, mas endpoints) y agregar tests de frontend/E2E.

---

## [0.5.0] - 2026-03-18

### Agregado - FASE 5: Backend de mecanicas de juego e integracion frontend

#### Backend de Juego
- ✅ `backend/db/schema.sql` ya incluye tablas `game_sessions`, `investigation_actions`, `suspect_confidence` y `leaderboard`
- ✅ `backend/controllers/gameController.js` implementa:
  - Inicio de partidas (`startGame`) con seleccion aleatoria de sospechoso y edificio objetivo
  - Acciones de investigacion (`performAction`) con consumo de tiempo y registro de pistas
  - Envio de resultado final (`submitResult`) con calculo basico de puntos y registro en leaderboard
  - Obtencion de pistas (`getClues`) y nivel de confianza por sospechoso (`getSuspectConfidence`)
  - Abandono de partida (`abandonGame`)
- ✅ Rutas protegidas `/api/v1/games/*` montadas en `backend/routes/games.js`
- ✅ Nuevos stubs de contenido en `backend/data/`:
  - `suspects.js` con 3 sospechosos base
  - `locations.js` con 4 locaciones base de Santiago
  - `clues.js` con 4 pistas simuladas para pruebas

#### Frontend - Integracion con Backend
- ✅ `frontend/js/api.js` ahora es un cliente HTTP real:
  - Login y registro contra `/api/v1/auth/login` y `/api/v1/auth/register`
  - Manejo de JWT en `localStorage` (`atlas_access_token`, `atlas_refresh_token`, `atlas_user`)
  - Logout contra `/api/v1/auth/logout` + limpieza local
  - Inicio de partidas (`startGameSession`) y ejecucion de acciones (`performAction`) contra `/api/v1/games/*`
- ✅ `frontend/js/ui.js` (HUD de juego) ahora:
  - Inicia partidas llamando a `ATLAS.api.startGameSession`
  - Ejecuta acciones de investigacion desde el boton "Avanzar turno", llamando a `ATLAS.api.performAction`
  - Registra en el log las pistas obtenidas y el tiempo simulado consumido por accion
  - Usa `ATLAS.api.logout()` al cerrar sesion desde la navegacion
- ✅ `frontend/js/main.js` actualiza formularios de login/registro para usar autenticacion real del backend y mantiene la sesion iniciada tras registro

> Nota: El contenido de juego (100 locaciones, 5 sospechosos completos, etc.) seguira ampliandose en la FASE de contenido, pero la tuberia de mecanicas y persistencia ya esta operativa para prototipos.

---

## [0.4.0] - 2026-03-18

### Agregado - FASE 4: Frontend de juego

#### Interfaz de Juego
- ✅ Pantalla de inicio con acciones para nueva partida, ranking e historial
- ✅ Flujo de seleccion de dificultad (facil, normal, dificil) con tiempos asociados
- ✅ Pantalla de juego con HUD (timer, nivel de alerta, dificultad actual)
- ✅ Mapa operativo simplificado de Santiago Centro (grid de sectores)
- ✅ Barra lateral con lista de objetivos de la mision
- ✅ Log de eventos de la operacion (actividad reciente)

#### Logica de Juego (frontend)
- ✅ Sistema local de sesion de juego (stub) sin dependencias de backend
- ✅ Timer de cuenta regresiva por dificultad con estados de alerta
- ✅ Marcado y desmarcado de objetivos con actualizacion visual
- ✅ Botones de control: avanzar turno, marcar objetivo, terminar operacion
- ✅ Mensajes de estado en pantalla para feedback al jugador

#### Estructura Frontend
- ✅ `frontend/js/utils.js` con helpers de UI (DOM, mensajes, cambio de pantallas)
- ✅ `frontend/js/api.js` con stub local para login/registro y sesion de juego
- ✅ `frontend/js/ui.js` con HUD de juego, mapa y manejo de objetivos
- ✅ `frontend/js/main.js` como orquestador de autenticacion y flujo de pantallas
- ✅ `frontend/css/game.css` extendido con layout y estilos del HUD y mapa

> Nota: La logica de backend y mecanicas avanzadas del juego se implementaran en la **FASE 5**.

---

## [0.3.0] - 2026-03-17

### Agregado - FASE 3: Documentacion y Panel Admin

#### Backend Admin
- ✅ Endpoints GET, POST, PUT, DELETE para usuarios
- ✅ Endpoints para gestionar auditoria
- ✅ Endpoints para gestionar configuracion del sistema
- ✅ Middleware de validacion y autorizacion
- ✅ Validacion completa de entrada (joi schemas)
- ✅ Manejo de errores estructurado
- ✅ Rate limiting en rutas sensibles

#### Frontend Admin
- ✅ Componente Dashboard con metricas clave
- ✅ Tabla de Usuarios con busqueda y filtrado
- ✅ Modales de confirmacion para operaciones criticas
- ✅ Seccion de Auditoria con detalles de todas las acciones
- ✅ Seccion de Configuracion con parametros editables
- ✅ Sistema de alertas con notificaciones de exito/error
- ✅ Estilos coherentes con tema dark
- ✅ Responsive design (mobile-ready)

#### Documentacion
- ✅ README principal con descripcion del proyecto
- ✅ SETUP.md con instrucciones de instalacion
- ✅ API.md con documentacion completa de endpoints
- ✅ ADMIN_PANEL.md con guia de uso del panel administrativo
- ✅ CHANGELOG.md (este archivo)

#### Devops
- ✅ Docker Compose para desarrollo local (backend + BD + redis)
- ✅ Dockerfile con multistage para optimizacion
- ✅ Healthchecks configurados
- ✅ Volumenes para persistencia de datos
- ✅ Networking entre servicios

---

## [0.2.0] - 2026-03-16

### Agregado - FASE 2: Backend Autenticacion

#### Backend Autenticacion
- ✅ Sistema de registro de usuarios
- ✅ Sistema de login con JWT
- ✅ Refresh tokens y rotacion de tokens
- ✅ Rutas protegidas con middleware de autenticacion
- ✅ Hash de contraseñas con bcrypt
- ✅ Validacion de email
- ✅ Recuperacion de contraseña (WIP)

#### BD
- ✅ Tablas de usuarios y sesiones
- ✅ Indices de performance
- ✅ Relaciones entre tablas

---

## [0.1.0] - 2026-03-15

### Agregado - FASE 1: Setup Inicial

#### Backend
- ✅ Proyecto Express.js basico
- ✅ Configuracion de variables de entorno
- ✅ BD PostgreSQL con migraciones
- ✅ Redis para cache y sesiones
- ✅ Logger estructurado
- ✅ Health check endpoint

#### Frontend
- ✅ Estructura HTML/CSS base en `frontend/`
- ✅ Pantallas de login, home y seleccion de dificultad

#### DevOps
- ✅ Docker Compose para servicios
- ✅ .env.example como template
- ✅ .gitignore configurado

---

## Leyes de Versionado Semantico

- **MAJOR** (X.0.0): Cambios incompatibles en la API
- **MINOR** (0.Y.0): Funcionalidad nueva pero compatible
- **PATCH** (0.0.Z): Correcciones de bugs

## Ciclo de Desarrollo

1. **FASE 1**: Setup inicial (0.1.0)
2. **FASE 2**: Backend autenticacion (0.2.0)
3. **FASE 3**: Documentacion y panel admin (0.3.0)
4. **FASE 4**: Frontend de juego (0.4.0)
5. **FASE 5**: Backend de mecanicas de juego (0.5.0)
6. **FASE 6**: Testing y optimizaciones (0.6.0) ✅ **ACTUAL**
7. **FASE 7**: Deployment a produccion (1.0.0)

---

*Mantener este archivo actualizado con cada release importante.*
