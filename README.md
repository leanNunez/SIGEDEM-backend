# SIGEDEM Backend

API del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Le da al [frontend](https://github.com/CNicolas-97/SIGEDEM-frontend) los datos de planes, inscripciones, alquiler de canchas y acceso del personal.

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Inicio rápido

Requisitos: **Node.js 20.19+** (o 22.12+) y **npm**.

```bash
git clone https://github.com/leanNunez/SIGEDEM-backend.git
cd SIGEDEM-backend
npm install
npm run start:dev
```

La API queda disponible en http://localhost:3000/api

## Scripts

| Script               | Qué hace                                           |
| -------------------- | -------------------------------------------------- |
| `npm run start:dev`  | Levanta la API y la reinicia al guardar            |
| `npm run build`      | Compila a `dist/`                                  |
| `npm run start:prod` | Corre la versión compilada                         |
| `npm run lint`       | Revisa el código con oxlint                        |
| `npm run format`     | Formatea con Prettier (mismas reglas que el front) |
| `npm test`           | Tests unitarios (Vitest)                           |
| `npm run test:e2e`   | Tests de punta a punta contra la API               |

## Variables de entorno

Van en un `.env` en la raíz, que **no** se sube a git. Es opcional: sin `.env` se usan los valores por defecto de `src/shared/config/env.ts`.

| Variable       | Para qué sirve                                    | Por defecto             |
| -------------- | ------------------------------------------------- | ----------------------- |
| `PORT`         | Puerto donde escucha la API                       | `3000`                  |
| `FRONTEND_URL` | Origen del front que puede llamar a la API (CORS) | `http://localhost:5173` |

## Estructura

Organizada por dominio (screaming architecture), igual que el front: al abrir `src/modules/` se ve de qué trata el sistema. Cada módulo de Nest tiene adentro una carpeta por caso de uso.

```
src/
  modules/
    users/                   Acceso del personal
      login/
      register/
      model/                 Entidades del dominio
      users.module.ts
    plans/                   Planes del abono
      list-plans/
      model/
    enrollment/              Inscripciones
      create-enrollment/
      model/
    booking/                 Alquiler de canchas
      list-available-slots/
      create-booking/
      model/
  shared/                    Lo que usan varios módulos
    config/                  env.ts y setup-app.ts
    database/
    guards/                  Autenticación y roles
  app.module.ts              Reúne los módulos
  main.ts                    Solo arranca la app
```

- Cada carpeta de caso de uso tiene su `controller`, su `service` y sus `dto` (ej.: `users/login/login.controller.ts`).
- Las rutas las declara cada controller (`@Controller('plans')`); todas quedan bajo `/api`.
- `main.ts` queda limpio: la configuración global (prefijo `/api`, CORS) está en `shared/config/setup-app.ts`.
- Los `.gitkeep` mantienen en git las carpetas que todavía no tienen código; se borran cuando llega el primer archivo.

## Flujo de trabajo

| Rama                                   | Uso                                                  |
| -------------------------------------- | ---------------------------------------------------- |
| `main`                                 | Producción                                           |
| `develop`                              | Integración del desarrollo                           |
| `feat/*`, `fix/*`, `chore/*`, `docs/*` | Una rama por tarea, con Pull Request hacia `develop` |

- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada Pull Request lo revisa y aprueba otro integrante del equipo antes de mergear.

## Equipo

- [CNicolas-97](https://github.com/CNicolas-97)
- [leanNunez](https://github.com/leanNunez)
- [lourdesrodriguez071102-ui](https://github.com/lourdesrodriguez071102-ui)
