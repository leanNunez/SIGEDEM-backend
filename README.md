# SIGEDEM Backend

API del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Le da al [frontend](https://github.com/CNicolas-97/SIGEDEM-frontend) los datos de planes, inscripciones, alquiler de canchas y acceso del personal.

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Tecnologías

| Capa          | Herramienta                       |
| ------------- | --------------------------------- |
| Framework     | NestJS 12 + TypeScript            |
| Base de datos | PostgreSQL 17 + Prisma 7 (ORM)    |
| Tests         | Vitest (unitarios y e2e)          |
| Calidad       | oxlint + Prettier                 |
| Pruebas API   | Postman (colección en `postman/`) |

## Inicio rápido

Requisitos: **Node.js 20.19+** (o 22.12+), **npm** y **Docker** (o **PostgreSQL 17+** instalado).

```bash
git clone https://github.com/leanNunez/SIGEDEM-backend.git
cd SIGEDEM-backend
npm install
npm run start:dev
```

`npm install` también corre `prisma generate` (script `postinstall`), que arma el cliente de Prisma en `src/generated/prisma` a partir de `prisma/schema.prisma`. Antes de levantar la API, la base tiene que estar creada (ver [Base de datos](#base-de-datos)).

La API queda disponible en http://localhost:4000/api. Para comprobar que anda, abrí esa dirección en el navegador: tiene que responder `API de SIGEDEM funcionando`.

## Base de datos

Los scripts están en `database/`:

| Archivo      | Qué hace                                                                    |
| ------------ | --------------------------------------------------------------------------- |
| `schema.sql` | Crea las tablas (si ya existen, las borra y las vuelve a crear)             |
| `seed.sql`   | Carga datos de ejemplo, al menos 5 registros por tabla (personas ficticias) |

### Opción 1: con Docker (recomendada)

No hace falta instalar PostgreSQL. Se levanta un contenedor con los mismos datos de conexión que usa la API por defecto (usuario `postgres`, contraseña `postgres`, base `sigedem`):

```bash
docker run -d --name sigedem-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sigedem -p 5432:5432 -v sigedem-pgdata:/var/lib/postgresql/data postgres:17-alpine
docker exec -i sigedem-postgres psql -U postgres -d sigedem < database/schema.sql
docker exec -i sigedem-postgres psql -U postgres -d sigedem < database/seed.sql
```

Los datos quedan guardados en el volumen `sigedem-pgdata`, así que sobreviven aunque se borre el contenedor. Para volver a los datos de ejemplo, se corren otra vez los dos `docker exec`. Otro día alcanza con `docker start sigedem-postgres`.

### Opción 2: con PostgreSQL instalado

Para crear la base desde cero (pide la contraseña del usuario `postgres`):

```bash
psql -U postgres -c "CREATE DATABASE sigedem"
psql -U postgres -d sigedem -f database/schema.sql
psql -U postgres -d sigedem -f database/seed.sql
```

> En Windows, si `psql` no se reconoce, usá la ruta completa: `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`. También se pueden abrir los archivos desde pgAdmin (Query Tool) y ejecutarlos en el mismo orden.

La API se conecta con Prisma: `prisma/schema.prisma` describe cada tabla y `src/shared/database/prisma.service.ts` es la conexión que usan todos los módulos. Las tablas se crean con `schema.sql`, no con migraciones de Prisma.

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

Todas las rutas cuelgan de `/api` y leen y escriben en PostgreSQL. Los siete recursos de datos tienen el CRUD completo; Ingreso todavía es el esqueleto de Nest:

| Recurso       | Ruta               | Id                 | Estado       |
| ------------- | ------------------ | ------------------ | ------------ |
| Estado        | `/api`             | —                  | ✅ Funciona  |
| Planes        | `/api/plans`       | texto (`familiar`) | ✅ Funciona  |
| Usuarios      | `/api/users`       | número             | ✅ Funciona  |
| Personas      | `/api/persons`     | número             | ✅ Funciona  |
| Inscripciones | `/api/enrollments` | número             | ✅ Funciona  |
| Pagos         | `/api/payments`    | número             | ✅ Funciona  |
| Canchas       | `/api/courts`      | texto (`futbol-5`) | ✅ Funciona  |
| Reservas      | `/api/bookings`    | número             | ✅ Funciona  |
| Ingreso       | `/api/auth`        | —                  | 🚧 Esqueleto |

Métodos de cada recurso CRUD: `GET` lista · `GET /:id` · `POST` · `PATCH /:id` · `DELETE /:id`.

| Respuesta | Cuándo                                                                                        |
| --------- | --------------------------------------------------------------------------------------------- |
| `400`     | El body no cumple las reglas del DTO, trae campos de más, o el id numérico no es un número    |
| `404`     | No existe un registro con ese id                                                              |
| `409`     | Dato repetido (DNI, email, id) o relación inválida (FK inexistente o registro todavía en uso) |

- Las fechas se mandan como `AAAA-MM-DD` (`"2026-11-05"`) y vuelven en formato ISO (`"2026-11-05T00:00:00.000Z"`).
- Los montos (`amount`, `price`, `memberPrice`, `publicPrice`) se mandan como número y vuelven como texto (`"18000"`), porque en la base son `NUMERIC`.
- `users` recibe `password` y la guarda hasheada; la API nunca devuelve `passwordHash`.

## Pruebas con Postman

En `postman/` están la colección y el entorno, listos para importar:

1. En Postman: **Import** y arrastrá los dos archivos de `postman/`.
2. Arriba a la derecha elegí el entorno **SIGEDEM local**.
3. Con la API levantada (`npm run start:dev`), abrí cualquier pedido y tocá **Send**.

La URL base sale de la variable `baseUrl` del entorno (`http://localhost:4000/api`). Cada pedido trae un test que revisa que la respuesta sea exitosa. Para correrlos todos juntos: clic derecho en la colección → **Run collection**.

Cada carpeta tiene 5 pedidos que se corren en orden: **Listar**, **Ver uno** (un registro del seed), **Crear**, **Editar** y **Borrar**. Editar y Borrar trabajan sobre el registro que acaba de crear Crear, así la base vuelve a quedar como el seed. Para los recursos con id numérico, Crear guarda el id nuevo en una variable de la colección (`userId`, `personId`, etc.).

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
database/            schema.sql y seed.sql
prisma/              schema.prisma: el mapa de las tablas para Prisma
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

- [x] Conectar la API a PostgreSQL.
- [x] CRUD de planes, usuarios, personas, inscripciones, pagos, canchas y reservas.
- [ ] Reglas de negocio: crear el abono al acreditar un pago, calcular el precio de una reserva, no reservar turnos pasados.
- [ ] Login con JWT y permisos por rol (operador, coordinador, médico, dirección).
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
