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
│   └── data/               # Contenido de juego (sospechosos, locaciones, pistas)
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
├── docs/                  # Documentación extendida (API, panel admin, etc.)
├── PLAN_DESARROLLO.md    # Plan completo de fases
├── PROGRESO_DESARROLLO.md# Seguimiento de fases
├── CHANGELOG.md          # Historial de versiones
├── README.md             # Este archivo
├── package.json
├── .env.example          # Variables de entorno
└── .gitignore
```

---

## 🚀 Inicio Rápido (Desarrollo)

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación local

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

# 5. Iniciar servidor en modo desarrollo
npm start

# 6. Abrir en navegador
# http://localhost:3000
```

### Tests automatizados

```bash
npm test        # Ejecuta Jest en modo secuencial (--runInBand)
```

---

## ☁️ Despliegue (FASE 7)

La aplicación está pensada para correr como **un único servicio Node.js** que sirve:

- API REST (`/api/v1/*`) desde `backend/server.js`
- Archivos estáticos del frontend (`frontend/`) desde el mismo servidor Express (configurado en el backend)

### Despliegue básico en servidor Linux

1. **Copiar código al servidor**

```bash
ssh usuario@mi-servidor
mkdir -p /opt/operacion-atlas
cd /opt/operacion-atlas
# Copiar archivos del repo a este directorio (git clone o rsync)
```

2. **Instalar dependencias y preparar entorno**

```bash
npm install --production
cp .env.example .env
# Editar .env con valores seguros (JWT_SECRET, CORS_ORIGIN, etc.)
node backend/db/init.js
```

3. **Levantar el servidor con un process manager (ej: pm2)**

```bash
npm install -g pm2
pm2 start backend/server.js --name operacion-atlas
pm2 save
pm2 startup            # Opcional: arranque automático al boot
```

4. **Configurar Nginx como reverse proxy (opcional)**

Ejemplo de bloque de servidor:

```nginx
server {
    listen 80;
    server_name mi-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Recomendado: añadir HTTPS vía Let’s Encrypt (certbot) en el mismo Nginx.

---

## 📄 Fases de Desarrollo (resumen)

El proyecto se desarrolla en varias fases. El detalle y estado actual se mantiene en:

- [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)
- [PROGRESO_DESARROLLO.md](./PROGRESO_DESARROLLO.md)
- [CHANGELOG.md](./CHANGELOG.md)

Consulta estos archivos para ver qué incluye cada fase (FASE 1–7) y qué está pendiente.

---

## 📝 API Endpoints (visión general)

La API real utiliza el prefijo `/api/v1`. La documentación completa vive en los archivos de `docs/`.

### Autenticación (ejemplo)

```http
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Juego (ejemplo)

```http
POST   /api/v1/games/start
GET    /api/v1/games/:gameId
POST   /api/v1/games/:gameId/action
POST   /api/v1/games/:gameId/submit
```

Para los endpoints de admin y leaderboard ver la documentación específica en `docs/`.

---

## 🦖 Testing

### Manual

1. Registrar nuevo usuario desde la interfaz
2. Seleccionar dificultad
3. Realizar acciones de investigación
4. Enviar acusación desde el flujo de juego
5. Verificar el resultado y la puntuación

### Automatizado

```bash
npm test
```

- Ejecuta Jest con suites para autenticación, administrador y mecánicas de juego.

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

**Última actualización**: 22 de Marzo, 2026  
**Versión**: 0.6.0
