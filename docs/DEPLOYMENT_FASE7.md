# FASE 7 - Deployment a produccion

Esta fase describe un flujo de despliegue basico para OPERACION ATLAS en un servidor Linux con Node.js 18+, SQLite y (opcionalmente) Nginx como reverse proxy.

## Objetivos

- Ejecutar el backend Express (API + estaticos) en un servidor persistente.
- Asegurar configuracion separada por entorno via `.env`.
- Sugerir uso de pm2 o servicio del sistema para mantener el proceso vivo.
- Sugerir Nginx delante del nodo para HTTPS y balanceo basico.

## Flujo recomendado

1. Provisionar servidor (ej: VPS o VM on-premise) con Node.js 18+ y npm.
2. Copiar el repositorio `operacion-atlas` al servidor (git clone o rsync).
3. Configurar `.env` con valores de produccion (JWT_SECRET fuerte, CORS_ORIGIN, etc.).
4. Inicializar base de datos SQLite (`node backend/db/init.js`).
5. Instalar dependencias con `npm install --production`.
6. Levantar el servidor con pm2 o systemd.
7. (Opcional) Configurar Nginx como reverse proxy en el puerto 80/443 apuntando a `http://127.0.0.1:3000`.

## Notas

- SQLite almacena los datos en un archivo, por lo que se recomienda colocar el repo (y especialmente `backend/db/`) en un volumen/persistencia respaldada.
- Para multi-instances / escalamiento horizontal seria necesario migrar a una BD compartida (PostgreSQL, etc.), lo cual queda fuera del alcance de esta fase.

Ver tambien la seccion de despliegue del `README.md` para comandos concretos.
