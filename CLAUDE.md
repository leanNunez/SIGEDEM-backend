# SIGEDEM-backend

API en NestJS 12 para SIGEDEM, el sistema de gestión del complejo deportivo. El front está en el repo SIGEDEM-frontend. Es un trabajo práctico de un equipo de estudiantes **sin experiencia laboral**: el código tiene que poder explicarlo cualquiera del equipo.

## Antes de escribir código

**Seguí siempre `docs/CONVENCIONES.md`.** Ahí están las reglas, los formatos de comentario y una plantilla de módulo completa. Si algo no está en la guía, copiá el estilo del módulo más parecido.

Lo más importante:

- Cabecera `QUÉ ES / NIVEL / DÓNDE SE USA / A FUTURO` en cada archivo, y JSDoc en español en cada función.
- Comentarios de línea solo donde algo no es obvio (decoradores, pipes, inyección de dependencias, SQL). No repitas lo que dice el código.
- Funciones cortas, que hagan una sola cosa, con retornos tempranos y tipos explícitos.
- El controller recibe y responde; la lógica va en el service.
- Nombres en inglés; comentarios, errores y valores del dominio en español.
- ESM: los imports propios terminan en `.js`.

## Stack y comandos

- NestJS 12 (ESM), TypeScript, Vitest, oxlint, Prettier.
- Base de datos: PostgreSQL. Los scripts están en `database/` (primero `schema.sql`, después `seed.sql`). Por ahora la API no se conecta a la base.
- Todas las rutas cuelgan de `/api`, como define `src/shared/config/setup-app.ts`. Las variables de entorno se leen en `src/shared/config/env.ts`.

```bash
npm run start:dev   # levanta la API con recarga automática
npm run build       # compila
npm run lint        # oxlint
npm test            # tests unitarios
npm run test:e2e    # tests end-to-end
```

## Cómo trabajar con el equipo

- Las ramas salen de `dev` y vuelven a `dev` por PR: `feature/`, `fix/`, `refactor/` o `docs/`.
- Commits con Conventional Commits, en español y en primera persona: `feat(plans): agrego GET /api/plans/:id`.
- Cuando generes código, explicá brevemente qué hiciste y por qué, como a alguien que recién empieza.
