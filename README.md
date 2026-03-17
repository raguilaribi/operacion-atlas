# 🌄 OPERACIÓN ATLAS

**Juego web narrativo de investigación criminal en Santiago, Chile**

> Un juego de inteligencia donde eres un **Agente Especial** que debe identificar y neutralizar amenazas terroristas en las calles de Santiago, bajo presión de tiempo.

[![Estado: En Desarrollo](https://img.shields.io/badge/Estado-En%20Desarrollo-blue)](./PLAN_DESARROLLO.md)
[![Stack: Node.js + Express](https://img.shields.io/badge/Stack-Node.js%2BExpress-green)](#stack-tecnol%C3%B3gico)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🎮 Concepto

**OPERACIÓN ATLAS** es un thriller interactivo al estilo Carmen Sandiego (1991) donde:

- 🕐 **Dinámica**: Carreras contra el tiempo (5h, 3h, 1h)
- 🗺️ **Escenario**: ~100 locaciones reales de Santiago
- 👥 **Antagonistas**: 5 perfiles extremistas con motivaciones complejas
- 🔍 **Mecánica**: Investigación, deducción, recolecta de pistas
- 🏆 **Competencia**: Ranking global de jugadores
- 📝 **Profundidad**: Diálogos narrativos editables

### Flujo de Juego

```
Login/Registro
     ↓
Seleccionar Dificultad (FÁCIL / NORMAL / DIFÍCIL)
     ↓
Briefing: Recibir misión
     ↓
Investigación: 4 acciones en ~100 locaciones
  • Búsqueda en BD (5 min)
  • Interrogatorio (15 min)
  • Vigilancia (25 min)
  • Análisis (10 min)
     ↓
Acusación: Capturar al sospechoso correcto
     ↓
Resultado: Puntuación + Ranking
```

---

## 🛠️ Stack Tecnológico

### Frontend
```
• HTML5 (semántica pura)
• CSS3 (Grid, Flexbox, animaciones retro)
• JavaScript Vanilla (ES6+, sin frameworks)
```

### Backend
```
• Node.js 18+
• Express.js 4.18+
• SQLite3 (base de datos local)
• JWT para autenticación
• LDAP/Active Directory (opcional)
```

### Datos
```
• ~100 locaciones de Santiago (matriz de coordenadas)
• 5 perfiles extremistas detallados
• 5 edificios objetivo
• Sistema de pistas dinámicas (verdaderas/falsas)
• Diálogos completamente editables en panel admin
```

---

## 📅 Estructura del Proyecto

```
operacion-atlas/
├── backend/                # Servidor Node.js + Express
│   ├── server.js
│   ├── routes/              # Endpoints API
│   ├── middleware/
│   ├── models/
│   ├── db/                 # Base de datos SQLite
│   └── data/               # JSON de contenido (diálogos, locaciones, etc)
│
├── frontend/              # Interfaz web
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   │   ├── main.css           # Estilos base retro
│   │   ├── game.css           # Estilos de juego
│   │   └── admin.css          # Estilos panel admin
│   ├── js/                 # Lógica front
│   └── assets/             # Imágenes, sonidos, fonts
│
├── PLAN_DESARROLLO.md    # Plan completo de 9 fases
├── API.md                # Documentación de endpoints
├── README.md             # Este archivo
├── package.json
├── .env.example          # Variables de entorno
└── .gitignore
```

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/raguilaribi/operacion-atlas.git
cd operacion-atlas

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env según sea necesario

# 4. Inicializar base de datos
node backend/db/init.js

# 5. Iniciar servidor
npm start

# 6. Abrir en navegador
# http://localhost:3000
```

### Credenciales de Prueba
```
Usuario: agente_test
Contraseña: Test123456!
Rol: admin (puede acceder a panel admin)
```

---

## 📄 Fases de Desarrollo

El proyecto se desarrolla en **9 fases iterativas** (sin deadline fijo):

| Fase | Título | Duración | Estado |
|------|--------|----------|--------|
| 1 | Infraestructura Base & Auth | 2 sem | 🔄 EN DESARROLLO |
| 2 | Home & Selectores | 1 sem | ⏳ Pendiente |
| 3 | BD de Contenido | 1.5 sem | ⏳ Pendiente |
| 4 | Lógica de Investigación | 2 sem | ⏳ Pendiente |
| 5 | Mapa & Timer | 1.5 sem | ⏳ Pendiente |
| 6 | Acusación & Resultado | 1 sem | ⏳ Pendiente |
| 7 | Panel de Admin | 2 sem | ⏳ Pendiente |
| 8 | LDAP/Active Directory | 1 sem | ⏳ Pendiente |
| 9 | Testing & Deploy | 2 sem | ⏳ Pendiente |

**Ver detalles en**: [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)

---

## 🎯 Características del Juego

### 4 Acciones Investigativas

| Acción | Tiempo | Información | Precisión |
|--------|--------|------------|------------|
| 📚 Búsqueda en BD | 5 min | Media | 70% |
| 👤 Interrogatorio | 15 min | Variable | 50% |
| 🔍 Vigilancia | 25 min | Alta | 90% |
| 📑 Análisis | 10 min | Específica | 85% |

### 3 Niveles de Dificultad

| Nivel | Tiempo Simulado | Tiempo Real | Multiplicador |
|-------|-----------------|-------------|---------------|
| 🟢 FÁCIL | 5 horas | 300 min | 1.0x |
| 🟡 NORMAL | 3 horas | 180 min | 1.5x |
| 🔴 DIFÍCIL | 1 hora | 60 min | 2.0x |

### 5 Perfiles de Sospechosos

1. **Extrema Derecha** → Objetivo: La Moneda
2. **Extrema Izquierda** → Objetivo: Congreso Nacional
3. **Ecologista Extremo** → Objetivo: Centro Comercial
4. **Religioso Extremo** → Objetivo: Iglesia/Templo
5. **Activista de Género Extremo** → Objetivo: Ministerio

---

## 🕐 Sistema de Puntuación

```
Fórmula: Puntos = Base × Multiplicador_Dificultad × Bonus_Tiempo

Base = 1000 puntos (captura correcta)

Multiplicador:
  - FÁCIL: 1.0x
  - NORMAL: 1.5x
  - DIFÍCIL: 2.0x

Bonus_Tiempo = (Tiempo_Restante / Tiempo_Total) × 500

Ejemplo:
  - Dificultad NORMAL
  - Acertó en 120 de 180 minutos
  - Puntos = 1000 × 1.5 × (60/180 × 500) ≈ 250,000 puntos
```

---

## 📝 API Endpoints

### Autenticación
```
POST   /api/auth/register     # Registrar usuario
POST   /api/auth/login        # Iniciar sesión
POST   /api/auth/logout       # Cerrar sesión
GET    /api/auth/verify       # Verificar token
```

### Juego
```
POST   /api/game/new          # Crear nueva partida
GET    /api/game/current      # Obtener partida actual
POST   /api/game/investigate  # Ejecutar investigación
POST   /api/game/capture      # Capturar sospechoso
GET    /api/game/status       # Estado actual
POST   /api/game/end          # Terminar partida
```

### Ranking
```
GET    /api/leaderboard       # Top 10 global
GET    /api/leaderboard/user  # Estadísticas del usuario
GET    /api/stats/:userId     # Historial de partidas
```

### Admin
```
GET    /api/admin/dialogues       # Obtener diálogos
PUT    /api/admin/dialogues/:sec  # Editar diálogos
PUT    /api/admin/locations       # CRUD locaciones
PUT    /api/admin/suspects        # CRUD sospechosos
PUT    /api/admin/buildings       # CRUD edificios
GET    /api/admin/stats           # Estadísticas admin
```

**Ver documentación completa en**: [API.md](./API.md)

---

## 📢 Panel de Administración

Acceso en: `http://localhost:3000/admin`

### Funcionalidades

- **Editor de Diálogos**: Editar todas las conversaciones del juego por sección
- **Gestor de Locaciones**: CRUD de ~100 locaciones de Santiago
- **Gestor de Sospechosos**: CRUD de 5 perfiles extremistas
- **Gestor de Edificios**: CRUD de 5 objetivos principales
- **Dashboard**: Estadísticas en tiempo real
- **Auditoria**: Log de todos los cambios realizados

---

## 🔐 Autenticación

### Tipos Soportados

1. **Local**: Usuario/Contraseña (predeterminado)
2. **LDAP**: Directorio LDAP empresarial (opcional)
3. **Active Directory**: Integración con AD (futuro)

### Configuración .env

```env
# Servidor
NODE_ENV=development
PORT=3000

# Base de Datos
DB_PATH=./backend/db/atlas.db

# JWT
JWT_SECRET=tu_secreto_aqui_cambiar_en_produccion
JWT_EXPIRE=7d

# LDAP (opcional)
AUTH_TYPE=local  # o "ldap"
LDAP_URL=ldap://ldap.example.com:389
LDAP_BASE=dc=example,dc=com
LDAP_BIND_DN=cn=admin,dc=example,dc=com
LDAP_BIND_PASSWORD=secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 📑 Documentación

- **[PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)**: Plan detallado de 9 fases
- **[API.md](./API.md)**: Documentación completa de endpoints
- **[README.md](./README.md)**: Este archivo

---

## 🦖 Testing

### Manual

1. Registrar nuevo usuario
2. Seleccionar dificultad
3. Realizar investigaciones
4. Acusar sospechoso
5. Verificar puntuación y ranking

### Automatizado (futuro)

```bash
npm test
```

---

## 🚁 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -am 'feat: descripción'`
4. Push: `git push origin feature/mi-feature`
5. Pull Request

---

## 📁 Licencia

MIT License - Ver [LICENSE](./LICENSE)

---

## 📞 Contacto

**Desarrollador**: Rodrigo Alejandro Aguilar Saavedra  
**GitHub**: [@raguilaribi](https://github.com/raguilaribi)  
**Ubicación**: Santiago, Chile  

---

## 📝 Notas de Desarrollo

- Proyecto en desarrollo iterativo
- Cada fase es independiente pero complementaria
- Cambios pueden solicitarse en cualquier momento
- Documentación se actualiza con cada commit
- No hay deadline, pero aprox. 13-14 semanas para MVP

---

**Última actualización**: 17 de Marzo, 2026  
**Versión**: 1.0-alpha
