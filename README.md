# SIGEDEM Backend

API del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Le da al [frontend](https://github.com/CNicolas-97/SIGEDEM-frontend) los datos de planes, inscripciones, alquiler de canchas y acceso del personal.

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Tecnologías

| Capa          | Herramienta                         |
| ------------- | ----------------------------------- |
| Framework     | NestJS 12 + TypeScript              |
| Base de datos | PostgreSQL 18                       |
| Tests         | Vitest (unitarios y e2e)            |
| Validación    | class-validator + class-transformer |
| Calidad       | oxlint + Prettier                   |
| Pruebas API   | Postman (colección en `postman/`)   |

## Inicio rápido

Requisitos: **Node.js 20.19+** (o 22.12+), **npm** y **PostgreSQL 18**.

```bash
git clone https://github.com/leanNunez/SIGEDEM-backend.git
cd SIGEDEM-backend
npm install
npm run start:dev
```

La API queda disponible en http://localhost:4000/api. Para comprobar que anda, abrí esa dirección en el navegador: tiene que responder `API de SIGEDEM funcionando`.

## Base de datos

Los scripts están en `database/`:

| Archivo      | Qué hace                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| `schema.sql` | Crea las tablas (si ya existen, las borra y las vuelve a crear)             |
| `seed.sql`   | Carga datos de ejemplo, al menos 5 registros por tabla (personas ficticias) |

Para crear la base desde cero (pide la contraseña del usuario `postgres`):

```bash
psql -U postgres -c "CREATE DATABASE sigedem"
psql -U postgres -d sigedem -f database/schema.sql
psql -U postgres -d sigedem -f database/seed.sql
```

> En Windows, si `psql` no se reconoce, usá la ruta completa: `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`. También se pueden abrir los archivos desde pgAdmin (Query Tool) y ejecutarlos en el mismo orden.

Tablas, agrupadas por tema:

| Tema                | Tablas                                                                    |
| ------------------- | ------------------------------------------------------------------------- |
| Personal y accesos  | `roles`, `users`                                                          |
| Vecinos             | `persons`, `family_groups`                                                |
| Planes y precios    | `plans`, `seasons`, `rate_tables`, `prices`                               |
| Inscripciones       | `enrollments`, `payments`, `memberships`, `membership_members`, `carnets` |
| Salud y datos       | `medical_certificates`, `consents`                                        |
| Alquiler de canchas | `courts`, `bookings`                                                      |

## Variables de entorno

Van en un `.env` en la raíz, que **no** se sube a git. Es opcional: sin `.env` se usan los valores por defecto de `src/shared/config/env.ts`.

| Variable       | Para qué sirve                                    | Por defecto                                             |
| -------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `PORT`         | Puerto donde escucha la API                       | `4000`                                                  |
| `DATABASE_URL` | Conexión a PostgreSQL                             | `postgresql://postgres:postgres@localhost:5432/sigedem` |
| `API_BASE_URL` | URL base de la API                                | `http://localhost:4000/api`                             |
| `FRONTEND_URL` | Origen del front que puede llamar a la API (CORS) | `http://localhost:5173`                                 |

Ejemplo de `.env` (cambiá la contraseña por la tuya de PostgreSQL):

```env
PORT=4000
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sigedem
API_BASE_URL=http://localhost:4000/api
FRONTEND_URL=http://localhost:5173
```

> El puerto es 4000 porque el 3000 lo usa json-server en el front.

## Endpoints

Todas las rutas cuelgan de `/api`. Los módulos ya **validan el body** con su DTO (TP 10), pero **todavía no leen ni escriben la base**: responden un mensaje y los datos que recibieron. La conexión a PostgreSQL con Prisma llega en el TP 11; usuarios e ingreso, en el TP 12.

| Recurso       | Ruta               | Id                 | Estado                  |
| ------------- | ------------------ | ------------------ | ----------------------- |
| Estado        | `/api`             | —                  | ✅ Funciona             |
| Planes        | `/api/plans`       | texto (`familiar`) | 🧪 Valida, sin base aún |
| Personas      | `/api/persons`     | número             | 🧪 Valida, sin base aún |
| Inscripciones | `/api/enrollments` | número             | 🧪 Valida, sin base aún |
| Pagos         | `/api/payments`    | número             | 🧪 Valida, sin base aún |
| Canchas       | `/api/courts`      | texto (`futbol-5`) | 🧪 Valida, sin base aún |
| Reservas      | `/api/bookings`    | número             | 🧪 Valida, sin base aún |
| Usuarios      | `/api/users`       | número             | 🚧 Esqueleto (TP 12)    |
| Ingreso       | `/api/auth`        | —                  | 🚧 Esqueleto (TP 12)    |

Métodos de cada recurso: `GET` lista · `GET /:id` · `POST` · `PATCH /:id` · `DELETE /:id`.

## TP 10: validaciones con DTOs

Cada módulo tiene un `CreateXDto` y un `UpdateXDto` en su carpeta `dto/`. Los campos llevan decoradores de **class-validator** (`@IsString`, `@IsInt`, `@IsBoolean`, `@IsDateString`, `@IsIn`, `@Matches`, `@MaxLength`...) que repiten las reglas de las tablas de `database/schema.sql`. El controller recibe el DTO con `@Body()`.

El `ValidationPipe` global (en `src/shared/config/setup-app.ts`) revisa cada body antes de que llegue al controller:

| Caso                                               | Respuesta                                   |
| -------------------------------------------------- | ------------------------------------------- |
| El body cumple todas las reglas                    | `201` con `{ message, data }`               |
| Falta un campo obligatorio                         | `400` con la lista de errores en `message`  |
| Llega texto donde va un número (`"hour": "diez"`)  | `400` (`hour must be an integer number`)    |
| Llega algo que no es booleano (`"isMember": "si"`) | `400` (`isMember must be a boolean value`)  |
| Llega un campo que el DTO no declara               | `400` (`property price should not exist`)   |
| La fecha no existe o trae hora (`"2026-02-30"`)    | `400` (`La fecha tiene que ser AAAA-MM-DD`) |
| El id numérico de la URL no es un número           | `400` (lo controla `ParseIntPipe`)          |

Algunos mensajes están en español porque el decorador tiene uno propio (por ejemplo, `La fecha tiene que ser AAAA-MM-DD`); los demás son los que trae class-validator, en inglés.

**Cómo probarlo:** levantá la API (`npm run start:dev`) y en Postman abrí la carpeta **TP 10 - Validaciones**. Hay una subcarpeta por módulo con un POST válido (201) y POST inválidos (400); cada pedido trae un test que revisa el código y el mensaje de error. Con clic derecho en la carpeta → **Run folder** se corren todos. Los tests e2e (`npm run test:e2e`) prueban los mismos casos sin Postman.

## Pruebas con Postman

En `postman/` están la colección y el entorno, listos para importar:

1. En Postman: **Import** y arrastrá los dos archivos de `postman/`.
2. Arriba a la derecha elegí el entorno **SIGEDEM local**.
3. Con la API levantada (`npm run start:dev`), abrí cualquier pedido y tocá **Send**.

La URL base sale de la variable `baseUrl` del entorno (`http://localhost:4000/api`). Cada pedido trae un test que revisa que la respuesta sea exitosa. Para correrlos todos juntos: clic derecho en la colección → **Run collection**.

## Estructura

Organizada por dominio, igual que el front: al abrir `src/modules/` se ve de qué trata el sistema. Cada módulo se generó con `nest g resource` y está separado por capas.

```
src/
  modules/
    app/             Módulo raíz: reúne los módulos y expone GET /api
    auth/            Ingreso y permisos
    users/           Personal de la Dirección y sus roles
    persons/         Padrón de vecinos
    plans/           Planes del abono
    enrollments/     Inscripciones
    payments/        Pagos informados de las inscripciones
    courts/          Canchas en alquiler
    bookings/        Reservas de canchas
  shared/            Lo que usan varios módulos
    config/          env.ts y setup-app.ts (prefijo /api, CORS y ValidationPipe)
    database/        Conexión a PostgreSQL (llega en el TP 11)
    types/           Tipos que comparten varios módulos
  main.ts            Solo arranca la app
database/            schema.sql y seed.sql
postman/             Colección y entorno de Postman
```

Cada módulo tiene la misma forma (ejemplo con `plans`):

```
plans/
  dto/                    Qué datos se reciben y sus validaciones (create-plan.dto.ts, update-plan.dto.ts)
  entities/               Cómo es un plan (plan.entity.ts)
  plans.controller.ts     Rutas: recibe el pedido y devuelve la respuesta
  plans.service.ts        Lógica de negocio
  plans.module.ts         Junta el controller y el service
```

- Las rutas las declara cada controller (`@Controller('plans')`); todas quedan bajo `/api`.
- `main.ts` queda limpio: la configuración global (prefijo `/api`, CORS, validación) está en `shared/config/setup-app.ts`.

## Próximos pasos

- [x] Validar los datos de entrada con DTOs y class-validator (TP 10).
- [ ] Conectar la API a PostgreSQL con Prisma (TP 11).
- [ ] Usuarios e ingreso: login con JWT y permisos por rol (TP 12).
- [ ] Conectar el front a esta API en lugar de json-server.

## Flujo de trabajo

| Rama                                         | Uso                                                  |
| -------------------------------------------- | ---------------------------------------------------- |
| `main`                                       | Versión estable (la entrega); recibe PRs desde `dev` |
| `dev`                                        | Integración del equipo                               |
| `feature/*`, `fix/*`, `refactor/*`, `docs/*` | Una rama por tarea, con Pull Request hacia `dev`     |

- Cómo escribimos el código: [docs/CONVENCIONES.md](docs/CONVENCIONES.md).
- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/), en español y en primera persona (`feat(plans): agrego GET /api/plans/:id`).
- Cada Pull Request lo revisa y aprueba otro integrante del equipo antes de mergear.

## Equipo

- [CNicolas-97](https://github.com/CNicolas-97)
- [leanNunez](https://github.com/leanNunez)
- [lourdesrodriguez071102-ui](https://github.com/lourdesrodriguez071102-ui)
