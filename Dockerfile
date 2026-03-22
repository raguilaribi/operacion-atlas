# Dockerfile multi-stage para Operación Atlas

# Etapa 1: Dependencias
FROM node:18-alpine AS base

WORKDIR /app

# Instalar dependencias del sistema mínimas (por si sqlite3 las requiere)
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración
COPY package.json ./

# Instalar dependencias
# Usamos `npm install` porque el proyecto no mantiene package-lock.json en la raíz
RUN npm install

# Copiar código fuente
COPY backend ./backend
COPY frontend ./frontend
COPY docs ./docs
COPY CHANGELOG.md PLAN_DESARROLLO.md PROGRESO_DESARROLLO.md .env.example ./

# Etapa 2: Producción
FROM node:18-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# Copiar node_modules ya instalados y código
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/backend ./backend
COPY --from=base /app/frontend ./frontend
COPY --from=base /app/docs ./docs
COPY --from=base /app/CHANGELOG.md /app/PLAN_DESARROLLO.md /app/PROGRESO_DESARROLLO.md /app/.env.example ./
COPY package.json ./

# Variables de entorno por defecto (pueden sobrescribirse en docker-compose o runtime)
ENV PORT=3000 \
    HOST=0.0.0.0 \
    DATABASE_PATH=./backend/db/atlas.db \
    DATABASE_BACKUP_PATH=./backend/db/backups \
    CORS_ORIGIN=http://localhost:3000 \
    API_PREFIX=/api/v1

# Crear directorios de base de datos y backups
RUN mkdir -p ./backend/db ./backend/db/backups

EXPOSE 3000

# Comando por defecto: iniciar el servidor Express
CMD ["node", "backend/server.js"]
