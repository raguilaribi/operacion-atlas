# Documentacion API Administrativa

## Indice
- [Autenticacion](#autenticacion)
- [Gestion de Usuarios](#gestion-de-usuarios)
- [Registro de Auditoria](#registro-de-auditoria)
- [Configuracion del Sistema](#configuracion-del-sistema)
- [Estadisticas](#estadisticas)

---

## Autenticacion

Todos los endpoints admin requieren:
- Token JWT valido en header `Authorization: Bearer <token>`
- Rol de administrador (`role = 'admin'`)

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Gestion de Usuarios

### Listar Usuarios

**GET** `/api/v1/admin/users`

Obtiene lista paginada de todos los usuarios del sistema.

**Parametros Query:**
- `limit` (int, opcional): Items por pagina (default: 50, max: 100)
- `offset` (int, opcional): Numero de items a saltar (default: 0)
- `search` (string, opcional): Buscar por username o email

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "jugador1",
      "email": "player@example.com",
      "role": "player",
      "is_active": 1,
      "created_at": "2026-03-17T10:30:00Z",
      "last_login": "2026-03-17T15:45:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Errores:**
- `401`: Token no proporcionado
- `403`: No tienes permisos de administrador

---

### Obtener Detalles de Usuario

**GET** `/api/v1/admin/users/:id`

Obtiene informacion detallada de un usuario especifico.

**Parametros Path:**
- `id` (int): ID del usuario

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "jugador1",
    "email": "player@example.com",
    "role": "player",
    "is_active": 1,
    "created_at": "2026-03-17T10:30:00Z",
    "last_login": "2026-03-17T15:45:00Z",
    "password_hash": "..."
  },
  "statistics": {
    "user_id": 1,
    "games_played": 25,
    "games_completed": 23,
    "total_correct_captures": 45,
    "total_incorrect_captures": 10,
    "win_rate": 81.8,
    "total_playtime_minutes": 480,
    "average_game_duration_minutes": 20,
    "best_capture_time_seconds": 3,
    "last_game_played": "2026-03-17T15:30:00Z"
  }
}
```

**Errores:**
- `404`: Usuario no encontrado
- `403`: No tienes permisos

---

### Editar Usuario

**PUT** `/api/v1/admin/users/:id`

Actualiza informacion de un usuario.

**Parametros Path:**
- `id` (int): ID del usuario

**Body:**
```json
{
  "email": "newemail@example.com",
  "role": "moderator"
}
```

**Campos Permitidos:**
- `email` (string): Nuevo email del usuario
- `role` (string): Nuevo rol - 'admin', 'player', 'moderator'

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado"
}
```

**Restricciones:**
- No puedes cambiar tu propio rol
- El email debe ser valido y unico

---

### Eliminar Usuario

**DELETE** `/api/v1/admin/users/:id`

Elimina un usuario del sistema permanentemente.

**Parametros Path:**
- `id` (int): ID del usuario a eliminar

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado"
}
```

**Restricciones:**
- No puedes eliminarte a ti mismo
- Esta accion se registra en el audit log

---

### Banear Usuario

**POST** `/api/v1/admin/users/:id/ban`

Banea a un usuario, impidiendo su acceso al sistema.

**Parametros Path:**
- `id` (int): ID del usuario a banear

**Body:**
```json
{
  "reason": "Comportamiento inadecuado"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario baneado"
}
```

**Restricciones:**
- No puedes banear a ti mismo
- El motivo es opcional pero recomendado

---

### Desbanear Usuario

**POST** `/api/v1/admin/users/:id/unban`

Desbanea a un usuario previamente baneado.

**Parametros Path:**
- `id` (int): ID del usuario a desbanear

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario desbaneado"
}
```

---

## Registro de Auditoria

### Obtener Registro de Auditoria

**GET** `/api/v1/admin/audit-log`

Obtiene el historial de cambios y acciones administrativas en el sistema.

**Parametros Query:**
- `limit` (int, opcional): Items por pagina (default: 50, max: 100)
- `offset` (int, opcional): Numero de items a saltar (default: 0)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "admin_user_id": 1,
      "action": "update",
      "table_name": "users",
      "record_id": "5",
      "new_data": "{\"email\":\"newemail@example.com\"}",
      "old_data": "{\"email\":\"oldemail@example.com\"}",
      "changes_description": "Usuario actualizado por administrador",
      "ip_address": "192.168.1.1",
      "created_at": "2026-03-17T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Acciones Registradas:**
- `create` - Creacion de registros
- `update` - Actualizacion de registros
- `delete` - Eliminacion de registros
- `ban` - Baneo de usuarios
- `unban` - Desbane de usuarios

---

## Configuracion del Sistema

### Obtener Configuracion

**GET** `/api/v1/admin/config`

Obtiene todos los parametros configurables del sistema.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "config": [
    {
      "id": 1,
      "key": "game_max_duration_minutes",
      "value": "10",
      "type": "number",
      "description": "Duracion maxima de una sesion de juego",
      "is_editable": 1,
      "default_value": "10"
    }
  ]
}
```

---

### Actualizar Configuracion

**PUT** `/api/v1/admin/config`

Actualiza un parametro de configuracion del sistema.

**Body:**
```json
{
  "key": "game_max_duration_minutes",
  "value": "15"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Configuracion actualizada"
}
```

**Restricciones:**
- Solo parametros con `is_editable = 1` pueden modificarse
- El tipo de dato se valida segun el tipo configurado
- Todas las modificaciones se registran en audit log

---

## Estadisticas

### Obtener Estadisticas del Sistema

**GET** `/api/v1/admin/statistics`

Obtiene metricas globales del sistema.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 150,
    "activeUsers": 45,
    "totalGames": 2500,
    "completedGames": 2200,
    "globalWinRate": 78.5
  }
}
```

**Metricas Incluidas:**
- `totalUsers` - Cantidad total de usuarios registrados
- `activeUsers` - Usuarios con login en los ultimos 7 dias
- `totalGames` - Sesiones de juego totales
- `completedGames` - Sesiones completadas exitosamente
- `globalWinRate` - Porcentaje promedio de exito global

---

## Codigos de Error

| Codigo | Descripcion |
|--------|-------------|
| 200 | Solicitud exitosa |
| 400 | Solicitud invalida (datos faltantes o invalidos) |
| 401 | No autenticado (token faltante o invalido) |
| 403 | No autorizado (permisos insuficientes) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Ejemplos con cURL

### Listar usuarios
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.example.com/api/v1/admin/users?limit=20&offset=0
```

### Banear usuario
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Violacion de terminos"}' \
  https://api.example.com/api/v1/admin/users/5/ban
```

### Actualizar configuracion
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"game_max_duration_minutes","value":"20"}' \
  https://api.example.com/api/v1/admin/config
```

---

## Notas de Seguridad

1. **Proteccion de Datos**: Las contrasenas hasheadas nunca se retornan en respuestas
2. **Auditoria Completa**: Todas las acciones admin se registran con timestamp e IP
3. **Validacion de Entrada**: Todos los parametros se validan antes de procesarse
4. **Rate Limiting**: Los endpoints admin estan sujetos a rate limiting
5. **HTTPS Requerido**: Usar siempre conexiones HTTPS en produccion

---

*Ultima actualizacion: 17 de Marzo 2026*
