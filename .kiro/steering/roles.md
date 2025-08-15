# Sistema de Roles y Permisos

## Roles Disponibles

### 🔐 **admin**

- **Acceso completo** al sistema
- Gestión de usuarios (crear, ver, actualizar, eliminar)
- Gestión completa de contenido turístico
- Acceso a logs del sistema
- Puede cambiar contraseñas de cualquier usuario

### 🏛️ **turismo**

- **Gestión completa de contenido turístico**:
  - Lugares turísticos (CRUD)
  - Eventos (CRUD)
  - Locales/negocios (CRUD)
  - Rutas turísticas (CRUD)
  - Atracciones (CRUD)
  - Imágenes (CRUD)
  - Tipos de local (CRUD)
  - Suscripciones de eventos (CRUD)
  - Suscripciones de locales (CRUD)
- **Restricciones**:
  - ❌ No puede gestionar usuarios
  - ❌ No puede acceder a logs del sistema
- Puede cambiar solo su propia contraseña

### 👤 **usuario**

- **Acceso limitado**:
  - Solo lectura de contenido público
  - Puede cambiar su propia contraseña
- **Restricciones**:
  - ❌ No puede crear, actualizar o eliminar contenido
  - ❌ No puede gestionar usuarios
  - ❌ No puede acceder a logs

## Implementación

### Guards y Decoradores

- `@Roles('admin')` - Solo administradores
- `@Roles('admin', 'turismo')` - Administradores y personal de turismo
- `@UseGuards(JwtAuthGuard, RolesGuard)` - Autenticación + autorización

### Endpoints por Rol

#### Solo Admin

- `/users/*` - Gestión de usuarios
- `/logs/*` - Gestión de logs

#### Admin + Turismo

- `/lugares-turisticos/*` (POST, PATCH, DELETE)
- `/eventos/*` (POST, PATCH, DELETE)
- `/locales/*` (POST, PATCH, DELETE)
- `/rutas-turisticas/*` (POST, PATCH, DELETE)
- `/attractions/*` (POST, PATCH, DELETE)
- `/image-item/*` (POST, PATCH, DELETE)
- `/tipo-local/*` (POST, PATCH, DELETE)
- `/suscribe/*` (GET, PATCH, DELETE)
- `/suscripcion-local/*` (PATCH, DELETE)

#### Público (sin autenticación)

- Todos los endpoints GET de consulta
- POST `/suscribe` - Crear suscripciones
- POST `/suscripcion-local` - Crear suscripciones de locales
