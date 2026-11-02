# SIGEDEM Backend

API del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Le da al [frontend](https://github.com/CNicolas-97/SIGEDEM-frontend) los datos de planes, inscripciones, alquiler de canchas y acceso del personal.

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Tecnologías

| Capa          | Herramienta                       |
| ------------- | --------------------------------- |
| Framework     | NestJS 12 + TypeScript            |
| Base de datos | PostgreSQL 18                     |
| Tests         | Vitest (unitarios y e2e)          |
| Calidad       | oxlint + Prettier                 |
| Pruebas API   | Postman (colección en `postman/`) |

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

| Archivo      | Qué hace                                                                  |
| ------------ | ------------------------------------------------------------------------- |
| `schema.sql` | Crea las tablas (si ya existen, las borra y las vuelve a crear)           |
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

Todas las rutas cuelgan de `/api`. Por ahora los módulos tienen la estructura armada pero **sin lógica de negocio**: responden un texto de prueba y todavía no leen la base.

| Recurso      | Ruta              | Métodos                                                         | Estado      |
| ------------ | ----------------- | --------------------------------------------------------------- | ----------- |
| Estado       | `/api`            | `GET`                                                           | ✅ Funciona |
| Planes       | `/api/plans`      | `GET` lista · `GET /:id` · `POST` · `PATCH /:id` · `DELETE /:id` | 🚧 Esqueleto |
| Inscripciones | `/api/enrollment` | ídem                                                            | 🚧 Esqueleto |
| Canchas      | `/api/booking`    | ídem                                                            | 🚧 Esqueleto |
| Usuarios     | `/api/users`      | ídem                                                            | 🚧 Esqueleto |
| Ingreso      | `/api/auth`       | ídem                                                            | 🚧 Esqueleto |

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
    plans/           Planes del abono
    enrollment/      Inscripciones
    booking/         Alquiler de canchas
  shared/            Lo que usan varios módulos
    config/          env.ts y setup-app.ts
    database/        Conexión a PostgreSQL (próximamente)
  main.ts            Solo arranca la app
database/            schema.sql y seed.sql
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

- [ ] Conectar la API a PostgreSQL.
- [ ] Lógica real en planes, inscripciones y alquiler de canchas.
- [ ] Login con JWT y permisos por rol (operador, coordinador, médico, dirección).
- [ ] Conectar el front a esta API en lugar de json-server.

## Flujo de trabajo

| Rama                                   | Uso                                              |
| -------------------------------------- | ------------------------------------------------ |
| `main`                                 | Producción                                       |
| `dev`                                  | Integración del desarrollo                       |
| `feature/*`, `fix/*`, `chore/*`, `docs/*` | Una rama por tarea, con Pull Request hacia `dev` |

- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada Pull Request lo revisa y aprueba otro integrante del equipo antes de mergear.

## Equipo

- [CNicolas-97](https://github.com/CNicolas-97)
- [leanNunez](https://github.com/leanNunez)
- [lourdesrodriguez071102-ui](https://github.com/lourdesrodriguez071102-ui)
