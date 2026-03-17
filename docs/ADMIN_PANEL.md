# Guia del Panel Administrativo

## Acceso al Panel Admin

### URL
```
https://operacion-atlas.com/admin/dashboard
```

### Requisitos
- Usuario con rol de **administrador**
- Token JWT valido
- Sesion activa

### Autenticacion
Si no estas autenticado, seras redirigido automaticamente a `/login`. Usa tus credenciales de administrador.

---

## Navegacion Principal

### Barra de Navegacion Superior

- **Logo**: Enlace al dashboard principal
- **Menu de Tabs**: Cambiar entre secciones del panel
- **Menu de Usuario**: Opciones de perfil y logout

```
┌────────────────────────────────────────────────────────────────┐
│ 🎮 Operacion Atlas | 🏠 Dashboard | ⚙️ Panel Admin | 📚 Docs  │
└────────────────────────────────────────────────────────────────┘
```

---

## Secciones del Panel

### 1. 📊 Resumen (Overview)

Pantalla principal con metricas clave del sistema.

**Tarjetas de Estadisticas:**
- 👥 **Usuarios Totales**: Cantidad de usuarios registrados
- ✨ **Usuarios Activos (7d)**: Usuarios que ingresaron en los ultimos 7 dias
- 🎮 **Sesiones Completadas**: Juegos finalizados exitosamente
- 🏆 **Tasa de Exito Global**: Porcentaje promedio de victorias

**Uso:**
- Monitorear salud general del sistema
- Detectar patrones de uso
- Identificar anomalias

---

### 2. 👥 Usuarios

Gestion completa de usuarios del sistema.

#### Tabla de Usuarios

Muestra:
- **Username**: Nombre de usuario
- **Email**: Correo electronico
- **Rol**: admin, moderator, player
- **Estado**: Activo o Baneado
- **Acciones**: Banear/Desbanear, Eliminar

#### Busqueda y Filtrado

```
┌─────────────────────────────────────────────┐
│ Buscar por usuario o email...        🔍    │
└─────────────────────────────────────────────┘
```

**Ejemplos de Busqueda:**
- `jugador1` - Busca por nombre de usuario
- `player@email.com` - Busca por email
- `admin` - Busca roles de administrador

#### Operaciones Disponibles

**Banear Usuario:**
1. Hacer clic en botton "Banear"
2. Confirmar accion
3. El usuario pierda acceso inmediato
4. Se registra en audit log

**Desbanear Usuario:**
1. Hacer clic en "Desbanear" (aparece si esta baneado)
2. Confirmar accion
3. Usuario recupera acceso
4. Se registra en audit log

**Eliminar Usuario:**
1. Hacer clic en "Eliminar"
2. Confirmar advertencia (irreversible)
3. Usuario y datos se eliminan
4. Se registra en audit log

#### Paginacion

```
← Anterior | Pagina 1 de 5 | Siguiente →
```

- Mostrar 50 usuarios por pagina
- Navegar entre paginas
- Total de usuarios visible

---

### 3. 📋 Auditoria

Registro detallado de todas las acciones administrativas.

#### Informacion Registrada

| Campo | Descripcion |
|-------|-------------|
| **Fecha/Hora** | Timestamp exacto de la accion |
| **Administrador** | ID del admin que realizo la accion |
| **Accion** | CREATE, UPDATE, DELETE, BAN, UNBAN |
| **Tabla** | Tabla de BD afectada (users, system_config, etc) |
| **ID Registro** | ID del registro modificado |
| **Descripcion** | Detalle de qué cambio |

#### Codigos de Color

```
🟢 CREATE  - Nueva entrada creada
🔵 UPDATE  - Registro actualizado
🔴 DELETE  - Registro eliminado
🟡 BAN     - Usuario baneado
🟣 UNBAN   - Usuario desbaneado
```

#### Uso

- Investigar cambios recientes
- Verificar acciones de administradores
- Rastrear modificaciones de configuracion
- Documentar cambios para auditorias

---

### 4. ⚙️ Configuracion

Gestion de parametros del sistema.

#### Parametros Disponibles

**game_max_duration_minutes**
- Tipo: Número
- Default: 10
- Descripcion: Duracion maxima de una sesion de juego
- Editable: Sí

**max_login_attempts**
- Tipo: Número
- Default: 5
- Descripcion: Intentos maximos de login antes de bloqueo
- Editable: Sí

**login_attempt_lockout_minutes**
- Tipo: Número
- Default: 15
- Descripcion: Minutos de bloqueo tras intentos fallidos
- Editable: Sí

**maintenance_mode**
- Tipo: Booleano
- Default: false
- Descripcion: Activar modo mantenimiento
- Editable: Sí

**allow_new_registrations**
- Tipo: Booleano
- Default: true
- Descripcion: Permitir registros de nuevos usuarios
- Editable: Sí

**require_email_verification**
- Tipo: Booleano
- Default: true
- Descripcion: Requerir verificacion de email
- Editable: Sí

#### Como Editar Configuracion

1. Localizar el parametro en la grilla
2. Modificar el valor en el campo de entrada
3. Hacer clic en "Guardar"
4. Ver confirmacion de exito (🟢 verde) o error (🔴 rojo)
5. Cambio se registra automaticamente en audit log

#### Cambios en Tiempo Real

La mayoria de cambios se aplican inmediatamente:

```
┌─────────────────────────────────────────┐
│ game_max_duration_minutes              │
│ Duracion maxima de una sesion         │
│ ┌───────────────────────────────────┐ │
│ │ 10    │ [Guardar]                 │ │
│ └───────────────────────────────────┘ │
│ Por defecto: 10                        │
│                                        │
│ ✓ Guardado exitosamente               │
└─────────────────────────────────────────┘
```

---

## Funcionalidades Avanzadas

### Exportar Datos

Actualmente no disponible, planeado para futuras versiones.

### Reportes Personalizados

Actualmente no disponible, planeado para futuras versiones.

### Sistema de Alertas

Actualmente no disponible, planeado para futuras versiones.

---

## Permisos y Restricciones

### Solo Administradores Pueden:
- ✓ Ver lista de usuarios
- ✓ Banear/desbanear usuarios
- ✓ Eliminar usuarios
- ✓ Ver registro de auditoria
- ✓ Modificar configuracion del sistema
- ✓ Ver estadisticas globales

### No Puedes:
- ✗ Banear tu propio usuario
- ✗ Eliminar tu propio usuario
- ✗ Cambiar tu propio rol
- ✗ Editar configuracion no marcada como editable

---

## Atajos de Teclado

| Atajo | Accion |
|-------|--------|
| `Ctrl + S` | Guardar cambios (en formularios) |
| `Esc` | Cerrar dialogo o volver |
| `Enter` | Confirmar accion |

---

## Mejores Practicas

### 1. Revisión Regulatoria
- Revisar audit log semanalmente
- Verificar cambios recientes en configuracion
- Monitorear acciones de otros admins

### 2. Gestion de Usuarios
- Documentar razon al banear usuarios
- Dar advertencia previa si es posible
- Revisar apelaciones de usuarios baneados

### 3. Configuracion del Sistema
- Hacer cambios en horarios de bajo trafico
- Documentar razon del cambio
- Probar cambios en ambiente de staging primero
- Revisar impact en audit log

### 4. Seguridad
- No compartir credenciales de admin
- Logout al terminar sesion
- Cambiar contraseña periodicamente
- Reportar actividad sospechosa

---

## Troubleshooting

### No puedo acceder al panel admin

**Solucion:**
1. Verificar que tengas rol de administrador
2. Verificar que tu token no este expirado (haz logout y login)
3. Verificar URL: `/admin/dashboard`
4. Contactar al super-admin si el problema persiste

### Los cambios en configuracion no se aplicaron

**Solucion:**
1. Verificar que veas el mensaje "Guardado exitosamente"
2. Refrescar la pagina (F5)
3. Verificar el audit log para ver si cambio se registro
4. Intentar nuevamente

### No veo nuevos usuarios en la lista

**Solucion:**
1. Verificar filtro de busqueda (borrar si hay)
2. Hacer clic en "Anterior" para ir a pagina 1
3. Refrescar la pagina
4. Verificar que el nuevo usuario realmente exista (auth logs)

---

## Contacto y Soporte

Para problemas o sugerencias:
- 📧 Email: admin@operacion-atlas.com
- 💬 Discord: #admin-support
- 📞 Telefonico: +56 2 xxxx xxxx

---

*Ultima actualizacion: 17 de Marzo 2026*
*Version: 1.0*
