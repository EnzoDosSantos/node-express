# 🎭 API REST de Chistes

API REST desarrollada con Node.js, Express, TypeScript y PostgreSQL. Integra APIs externas de chistes (Chuck Norris y Dad Jokes) y proporciona operaciones matemáticas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Docker](#-docker)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Tests](#-tests)
- [Base de Datos](#-base-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

- **Chistes externos**: Integración con APIs de Chuck Norris y Dad Jokes
- **Chistes emparejados**: Endpoint que obtiene 5 pares de chistes en paralelo
- **CRUD de chistes**: Crear, leer, actualizar y eliminar chistes en PostgreSQL
- **Operaciones matemáticas**: Cálculo de MCM e incremento de números
- **Consultas SQL**: 3 consultas específicas por usuario, categoría y combinadas
- **Documentación**: Swagger UI integrado
- **Tests**: Cobertura con Jest siguiendo TDD
- **Logging**: Sistema de logs con Winston

## 🛠 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL
- **Testing**: Jest
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston
- **HTTP Client**: Axios

## 📦 Requisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x (opcional, la API funciona sin BD)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd node-express
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **(Opcional) Configurar PostgreSQL**
```bash
# Crear la base de datos
createdb jokes_db

# Ejecutar migraciones
npm run migrate

# Poblar con datos de ejemplo
npm run seed
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🐳 Docker

### Quick Start con Docker Compose

```bash
# Levantar todos los servicios (API + PostgreSQL + pgAdmin)
docker compose up -d

# Ejecutar migraciones y seed
docker compose exec api npm run migrate
docker compose exec api npm run seed

# Ver logs
docker compose logs -f api
```

### Servicios incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `api` | 3000 | API Node.js con hot-reload |
| `postgres` | 5432 | PostgreSQL 16 |
| `pgadmin` | 5050 | UI para administrar PostgreSQL |

### Accesos

- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api-docs
- **pgAdmin:** http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

### Comandos útiles

```bash
# Levantar en desarrollo
docker compose up -d

# Levantar en producción
npm run build
docker compose -f docker-compose.prod.yml up -d

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (borra datos de BD)
docker compose down -v

# Reconstruir imagen
docker compose build --no-cache

# Ver logs de un servicio
docker compose logs -f api
docker compose logs -f postgres

# Ejecutar comando en contenedor
docker compose exec api npm run migrate
docker compose exec api npm run seed
docker compose exec api npm test
```

### Archivos Docker

| Archivo | Descripción |
|---------|-------------|
| `Dockerfile` | Imagen optimizada para producción |
| `Dockerfile.dev` | Imagen para desarrollo con hot-reload |
| `docker-compose.yml` | Desarrollo: API + PostgreSQL + pgAdmin |
| `docker-compose.prod.yml` | Producción: API + PostgreSQL | 

### Configurar conexión en pgAdmin

1. Acceder a http://localhost:5050

2. **Login en pgAdmin:**
   - Email: `admin@admin.com`
   - Password: `admin`

3. Click derecho en "Servers" → "Register" → "Server..."

4. **Tab "General":**
   - Name: `jokes_db` (o cualquier nombre descriptivo)

5. **Tab "Connection":**

   | Campo | Valor |
   |-------|-------|
   | Host name/address | `postgres` |
   | Port | `5432` |
   | Maintenance database | `jokes_db` |
   | Username | `postgres` |
   | Password | `postgres` |

   > ⚠️ **Importante:** El host es `postgres`

6. Marcar ✅ "Save password" y click en **Save**

## ⚙️ Configuración

Variables de entorno disponibles en `.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jokes_db
DB_USER=postgres
DB_PASSWORD=postgres

# Logging
LOG_LEVEL=info
```

## 📖 Uso

### Iniciar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Documentación interactiva

Accede a Swagger UI en: `http://localhost:3000/api-docs`

## 🔌 Endpoints

### Chistes Externos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/chistes` | Chiste aleatorio de cualquier fuente |
| GET | `/api/chistes/Chuck` | Chiste de Chuck Norris |
| GET | `/api/chistes/Dad` | Dad Joke |
| GET | `/api/chistes/emparejados` | 5 pares de chistes emparejados |

### CRUD de Chistes (Base de Datos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/chistes/db` | Todos los chistes |
| GET | `/api/chistes/db/:id` | Chiste por ID |
| POST | `/api/chistes` | Crear nuevo chiste |
| PUT | `/api/chistes/:number` | Actualizar chiste |
| DELETE | `/api/chistes/:number` | Eliminar chiste |

### Consultas SQL

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/chistes/usuario/:userName` | Consulta 1: Chistes por usuario |
| GET | `/api/chistes/categoria/:categoryName` | Consulta 2: Chistes por categoría |
| GET | `/api/chistes/usuario/:userName/categoria/:categoryName` | Consulta 3: Combinada |

### Matemáticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/math/lcm?numbers=2,3,4` | Mínimo Común Múltiplo |
| GET | `/api/math/increment?number=5` | Número + 1 |

## 🧪 Tests

### Ejecutar todos los tests

```bash
npm test
```

### Tests con cobertura

```bash
npm test -- --coverage
```

### Tests en modo watch

```bash
npm run test:watch
```

### Solo tests unitarios

```bash
npm run test:unit
```

## 💾 Base de Datos

### Estructura

```sql
-- Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías/Temáticas
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chistes
CREATE TABLE jokes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Datos de Seed

El script de seed crea:

**Usuarios:**
- Manolito
- Pepe
- Isabel
- Pedro

**Categorías:**
- humor negro
- humor amarillo
- chistes verdes

**Chistes:** 3 por cada temática por cada usuario (36 total)

### Consultas de ejemplo

```bash
# Consulta 1: Chistes de Manolito
curl http://localhost:3000/api/chistes/usuario/Manolito

# Consulta 2: Chistes de humor negro
curl http://localhost:3000/api/chistes/categoria/humor%20negro

# Consulta 3: Chistes de humor negro de Manolito
curl http://localhost:3000/api/chistes/usuario/Manolito/categoria/humor%20negro
```

## 📁 Estructura del Proyecto

```
node-express/
├── src/
│   ├── controllers/        # Controladores HTTP
│   │   ├── jokes.controller.ts
│   │   └── math.controller.ts
│   ├── services/           # Lógica de negocio
│   │   ├── math.service.ts
│   │   ├── jokes.service.ts
│   │   ├── chuckNorris.service.ts
│   │   ├── dadJoke.service.ts
│   │   ├── externalJokes.service.ts
│   │   └── pairedJokes.service.ts
│   ├── repositories/       # Acceso a datos
│   │   └── joke.repository.ts
│   ├── routes/             # Definición de rutas
│   │   ├── index.ts
│   │   ├── jokes.routes.ts
│   │   └── math.routes.ts
│   ├── database/           # Configuración BD
│   │   ├── connection.ts
│   │   ├── migrate.ts
│   │   └── seed.ts
│   ├── middleware/         # Middlewares
│   │   └── errorHandler.ts
│   ├── utils/              # Utilidades
│   │   └── logger.ts
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── app.ts              # Configuración Express
│   └── index.ts            # Punto de entrada
├── tests/
│   ├── unit/               # Tests unitarios
│   │   └── services/
│   └── setup.ts            # Configuración Jest
├── docs/
│   └── swagger.yaml        # Documentación OpenAPI
├── Dockerfile              # Imagen producción
├── Dockerfile.dev          # Imagen desarrollo
├── docker-compose.yml      # Dev: API + PostgreSQL + pgAdmin
├── docker-compose.prod.yml # Prod: API + PostgreSQL
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🔍 Ejemplos de Uso

### Obtener chiste aleatorio

```bash
curl http://localhost:3000/api/chistes
```

### Obtener chiste de Chuck Norris

```bash
curl http://localhost:3000/api/chistes/Chuck
```

### Obtener chistes emparejados

```bash
curl http://localhost:3000/api/chistes/emparejados
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "chuck": "Chuck Norris counted to infinity. Twice.",
      "dad": "Why did the math book look sad? Because it had too many problems.",
      "combinado": "Chuck Norris counted to infinity. Twice. Also, the math book had too many problems."
    }
  ],
  "count": 5
}
```

### Crear un chiste

```bash
curl -X POST http://localhost:3000/api/chistes \
  -H "Content-Type: application/json" \
  -d '{"text": "Mi nuevo chiste", "userId": 1, "categoryId": 1}'
```

### Actualizar un chiste

```bash
curl -X PUT http://localhost:3000/api/chistes/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Texto actualizado"}'
```

### Eliminar un chiste

```bash
curl -X DELETE http://localhost:3000/api/chistes/1
```

### Calcular MCM

```bash
curl "http://localhost:3000/api/math/lcm?numbers=4,6,8"
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "numbers": [4, 6, 8],
    "lcm": 24
  }
}
```

### Incrementar número

```bash
curl "http://localhost:3000/api/math/increment?number=42"
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "original": 42,
    "result": 43
  }
}
```

## 📝 Scripts npm

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia en modo desarrollo con hot-reload |
| `npm start` | Inicia en modo producción |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm test` | Ejecuta todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:unit` | Solo tests unitarios |
| `npm run migrate` | Ejecuta migraciones de BD |
| `npm run seed` | Puebla la BD con datos de ejemplo |