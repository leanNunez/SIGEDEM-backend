# SIGEDEM Backend

API del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Le da al [frontend](https://github.com/CNicolas-97/SIGEDEM-frontend) los datos de planes, inscripciones, alquiler de canchas y acceso del personal.

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Tecnologías

| Capa          | Herramienta                         |
| ------------- | ----------------------------------- |
| Framework     | NestJS 12 + TypeScript              |
| Base de datos | PostgreSQL 17 + Prisma 7 (ORM)      |
| Validación    | class-validator + class-transformer |
| Tests         | Vitest (unitarios y e2e)            |
| Calidad       | oxlint + Prettier                   |
| Pruebas API   | Postman (colección en `postman/`)   |

## Inicio rápido

Requisitos: **Node.js 20.19+** (o 22.12+), **npm** y **Docker** (o **PostgreSQL 17+** instalado).

```bash
git clone https://github.com/leanNunez/SIGEDEM-backend.git
cd SIGEDEM-backend
npm install
npm run start:dev
```

`npm install` también corre `prisma generate` (script `postinstall`), que arma el cliente de Prisma en `src/generated/prisma` a partir de `prisma/schema.prisma`. Antes de levantar la API, la base tiene que estar creada con la migración y los datos de ejemplo (ver [Base de datos](#base-de-datos)).

La API queda disponible en http://localhost:4000/api. Para comprobar que anda, abrí esa dirección en el navegador: tiene que responder `API de SIGEDEM funcionando`.

## Base de datos

La estructura de la base se maneja con **migraciones de Prisma**:

| Archivo                | Qué es                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `prisma/schema.prisma` | La fuente de verdad de las tablas: un `model` por tabla               |
| `prisma/migrations/`   | Las migraciones: el SQL que crea y cambia las tablas, en orden        |
| `database/seed.sql`    | Datos de ejemplo, al menos 5 registros por tabla (personas ficticias) |

> `database/schema.sql` **ya no existe**: la migración `init` lo reemplaza. La generó `npx prisma migrate dev --name init --create-only` a partir de `schema.prisma`, y al final se le agregaron a mano los `CHECK` (estados, montos, formato del DNI), porque Prisma no los puede escribir en `schema.prisma`. Así hay una sola fuente para la estructura.

### Crear la base desde cero

1. Levantá PostgreSQL. Con Docker (recomendado), un contenedor con los mismos datos de conexión que usa la API por defecto (usuario `postgres`, contraseña `postgres`, base `sigedem`):

   ```bash
   docker run -d --name sigedem-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sigedem -p 5432:5432 -v sigedem-pgdata:/var/lib/postgresql/data postgres:17-alpine
   ```

   Otro día alcanza con `docker start sigedem-postgres`. Si tenés PostgreSQL instalado, creá la base con `psql -U postgres -c "CREATE DATABASE sigedem"` y poné tu contraseña en `DATABASE_URL` (ver [Variables de entorno](#variables-de-entorno)).

2. Creá las tablas y cargá los datos de ejemplo:

   ```bash
   npx prisma migrate dev   # aplica las migraciones de prisma/migrations
   npx prisma db seed       # corre database/seed.sql
   ```

Para **volver a los datos de ejemplo** (borra todo y vuelve a crear las tablas):

```bash
npx prisma migrate reset --force
npx prisma db seed
```

### Comandos de Prisma

| Comando                                  | Qué hace                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `npx prisma validate`                    | Revisa que `schema.prisma` esté bien escrito                                           |
| `npx prisma generate`                    | Arma el cliente de Prisma en `src/generated/prisma` (también lo corre `npm install`)   |
| `npx prisma migrate dev`                 | Aplica las migraciones pendientes a la base local                                      |
| `npx prisma migrate dev --name <cambio>` | Después de editar `schema.prisma`: crea una migración nueva y la aplica                |
| `npx prisma migrate deploy`              | Aplica las migraciones sin crear nada nuevo: es el que se usa en la base de producción |
| `npx prisma migrate status`              | Muestra qué migraciones están aplicadas                                                |
| `npx prisma db seed`                     | Carga `database/seed.sql`                                                              |

Una migración ya aplicada **no se edita**: si cambia una tabla, se crea otra. Para agregar un `CHECK`, se crea la migración con `--create-only`, se le suma el `ALTER TABLE ... ADD CONSTRAINT ... CHECK (...)` y después se aplica con `npx prisma migrate dev`.

### Si ya tenías una base creada con SQL

Prisma guarda en la tabla `_prisma_migrations` qué migraciones aplicó. Una base creada a mano (con el viejo `schema.sql`) no tiene esa tabla, así que `migrate dev` no la reconoce.

- **Base local:** lo más simple es borrarla y crearla de nuevo (`npx prisma migrate reset --force` y `npx prisma db seed`). Además, las bases creadas antes de este cambio tienen la tabla `bookings` vieja (sin `renters`), así que hay que recrearlas igual.
- **Base que ya tiene exactamente esta estructura** (por ejemplo, la de producción cargada a mano y que no se puede borrar): se la marca como migrada, sin tocar sus tablas:

  ```bash
  npx prisma migrate resolve --applied 20261111194707_init
  ```

  Desde ahí, los cambios nuevos se aplican con `npx prisma migrate deploy`.

Tablas, agrupadas por tema:

| Tema                | Tablas                                                                    |
| ------------------- | ------------------------------------------------------------------------- |
| Personal y accesos  | `roles`, `users`                                                          |
| Vecinos             | `persons`, `family_groups`                                                |
| Planes y precios    | `plans`, `seasons`, `rate_tables`, `prices`                               |
| Inscripciones       | `enrollments`, `payments`, `memberships`, `membership_members`, `carnets` |
| Salud y datos       | `medical_certificates`, `consents`                                        |
| Alquiler de canchas | `courts`, `renters`, `bookings`                                           |

**3FN en el alquiler de canchas.** Antes `bookings` guardaba `full_name` y `phone` junto con el `dni`: esos datos dependen del DNI y no de la reserva (dependencia transitiva), y se repetían en cada reserva de la misma persona. Ahora están en `renters`, una fila por DNI, y `bookings` guarda `renter_id`. `is_member` y `price` se quedan en `bookings` porque son una foto del momento de la reserva (si después cambia el precio o deja de ser socio, la reserva conserva lo que se cobró).

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

Todas las rutas cuelgan de `/api` y leen y escriben en PostgreSQL con Prisma Client. Usuarios e Ingreso todavía son el esqueleto de Nest: llegan en el TP 12.

| Recurso       | Ruta               | Id                 | Estado               |
| ------------- | ------------------ | ------------------ | -------------------- |
| Estado        | `/api`             | —                  | ✅ Funciona          |
| Planes        | `/api/plans`       | texto (`familiar`) | ✅ Funciona          |
| Usuarios      | `/api/users`       | número             | 🚧 Esqueleto (TP 12) |
| Personas      | `/api/persons`     | número             | ✅ Funciona          |
| Inscripciones | `/api/enrollments` | número             | ✅ Funciona          |
| Pagos         | `/api/payments`    | número             | ✅ Funciona          |
| Canchas       | `/api/courts`      | texto (`futbol-5`) | ✅ Funciona          |
| Reservas      | `/api/bookings`    | número             | ✅ Funciona          |
| Ingreso       | `/api/auth`        | —                  | 🚧 Esqueleto (TP 12) |

Métodos de cada recurso CRUD: `GET` lista · `GET /:id` · `POST` · `PATCH /:id` · `DELETE /:id`.

| Respuesta | Cuándo                                                                                        |
| --------- | --------------------------------------------------------------------------------------------- |
| `400`     | El body no cumple las reglas del DTO, trae campos de más, o el id numérico no es un número    |
| `404`     | No existe un registro con ese id                                                              |
| `409`     | Dato repetido (DNI, email, id) o relación inválida (FK inexistente o registro todavía en uso) |

- Las fechas se mandan como `AAAA-MM-DD` (`"2026-11-05"`) y vuelven en formato ISO (`"2026-11-05T00:00:00.000Z"`).
- Los montos (`amount`, `price`, `memberPrice`, `publicPrice`) se mandan como número y vuelven como texto (`"18000"`), porque en la base son `NUMERIC`.
- `bookings` recibe `fullName`, `dni` y `phone` en el body, como antes. La API busca el DNI en `renters`: si ya alquiló, reusa su fila (y actualiza nombre y teléfono); si no, la crea. Las respuestas traen el renter adentro (`"renter": { "id", "dni", "fullName", "phone" }`). Para cambiar el DNI de una reserva hay que mandar también `fullName` y `phone`.

## TP 10: validaciones con DTOs

Cada módulo tiene un `CreateXDto` y un `UpdateXDto` en su carpeta `dto/`. Los campos llevan decoradores de **class-validator** (`@IsString`, `@IsInt`, `@IsBoolean`, `@IsDateString`, `@IsIn`, `@Matches`, `@MaxLength`...) que repiten las reglas de las tablas. El controller recibe el DTO con `@Body()`, y el `ValidationPipe` global (en `src/shared/config/setup-app.ts`) revisa cada body antes de que llegue al controller:

| Caso                                               | Respuesta                                   |
| -------------------------------------------------- | ------------------------------------------- |
| El body cumple todas las reglas                    | `201` con el registro creado                |
| Falta un campo obligatorio                         | `400` con la lista de errores en `message`  |
| Llega texto donde va un número (`"hour": "diez"`)  | `400` (`hour must be an integer number`)    |
| Llega algo que no es booleano (`"isMember": "si"`) | `400` (`isMember must be a boolean value`)  |
| Llega un campo que el DTO no declara               | `400` (`property price should not exist`)   |
| La fecha no existe o trae hora (`"2026-02-30"`)    | `400` (`La fecha tiene que ser AAAA-MM-DD`) |

Para probarlo, en Postman está la carpeta **TP 10 - Validaciones**: por cada módulo, un POST válido (201), un pedido que borra lo que creó, y POST inválidos (400). Los tests e2e (`npm run test:e2e`) prueban los mismos casos; necesitan la base levantada, porque la API se conecta al arrancar.

## TP 11: Prisma

- Paquetes: `prisma` (CLI), `@prisma/client`, `@prisma/adapter-pg` y `pg` (Prisma 7 se conecta a PostgreSQL a través del driver `pg`) y `dotenv` (lee el `.env`).
- `prisma/schema.prisma` describe las tablas; `npx prisma validate` lo revisa y `npx prisma generate` arma el cliente.
- La migración inicial está en `prisma/migrations/20261111194707_init` (`npx prisma migrate dev --name init`).
- `src/shared/database/prisma.service.ts` es la conexión que comparten todos los módulos, y los services de planes, personas, inscripciones, pagos, canchas y reservas hacen el CRUD con Prisma Client (`findMany`, `findUnique`, `create`, `update`, `delete`).

## Pruebas con Postman

En `postman/` están la colección y el entorno, listos para importar:

1. En Postman: **Import** y arrastrá los dos archivos de `postman/`.
2. Arriba a la derecha elegí el entorno **SIGEDEM local**.
3. Con la API levantada (`npm run start:dev`), abrí cualquier pedido y tocá **Send**.

La URL base sale de la variable `baseUrl` del entorno (`http://localhost:4000/api`). Cada pedido trae un test que revisa que la respuesta sea exitosa. Para correrlos todos juntos: clic derecho en la colección → **Run collection**.

Cada carpeta tiene los pedidos en orden: **Listar**, **Ver uno** (un registro del seed), **Crear**, **Editar** y **Borrar**. Editar y Borrar trabajan sobre el registro que acaba de crear Crear, así la base vuelve a quedar como el seed. Para los recursos con id numérico, Crear guarda el id nuevo en una variable de la colección (`personId`, `bookingId`, etc.). En **Alquiler de canchas** hay dos Crear: uno con un DNI que ya alquiló (reusa su fila de `renters`) y otro con un DNI nuevo. Al final está la carpeta **TP 10 - Validaciones**.

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
    config/          env.ts y setup-app.ts
    database/        Conexión a PostgreSQL con Prisma y filtro de errores de la base
  generated/prisma/  Cliente de Prisma (lo genera npm install; no se sube a git)
  main.ts            Solo arranca la app
database/            seed.sql: los datos de ejemplo
prisma/              schema.prisma (las tablas) y migrations/ (el SQL que las crea)
postman/             Colección y entorno de Postman
```

Cada módulo tiene la misma forma (ejemplo con `plans`):

```
plans/
  dto/                    Qué datos se reciben (create-plan.dto.ts, update-plan.dto.ts)
  entities/               Cómo es un plan (plan.entity.ts)
  plans.controller.ts     Rutas: recibe el pedido y devuelve la respuesta
  plans.service.ts        Lógica de negocio
  plans.module.ts         Junta el controller y el service
```

- Las rutas las declara cada controller (`@Controller('plans')`); todas quedan bajo `/api`.
- `main.ts` queda limpio: la configuración global (prefijo `/api`, CORS) está en `shared/config/setup-app.ts`.

## Próximos pasos

- [x] Validar los datos de entrada con DTOs y class-validator (TP 10).
- [x] Conectar la API a PostgreSQL con Prisma y migraciones (TP 11).
- [x] CRUD de planes, personas, inscripciones, pagos, canchas y reservas.
- [ ] Usuarios e ingreso: CRUD de usuarios, login con JWT y permisos por rol (TP 12).
- [ ] Reglas de negocio: crear el abono al acreditar un pago, calcular el precio de una reserva, no reservar turnos pasados.
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
