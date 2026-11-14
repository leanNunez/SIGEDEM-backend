import { defineConfig } from 'prisma/config';
import { env } from './src/shared/config/env.js';

// QUÉ ES: la configuración de Prisma: el schema, las migraciones, el seed y la base.
// NIVEL: configuración — la usan los comandos de Prisma (generate, migrate, db seed).
// DÓNDE SE USA: npx prisma ... la lee sola desde la raíz del proyecto.

// La URL sale de env.ts, el mismo lugar que usa la API, así no se repite.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    // Cada carpeta de acá adentro es un cambio de la estructura de la base.
    path: 'prisma/migrations',
    // npx prisma db seed carga los datos de ejemplo de database/seed.sql.
    seed: 'prisma db execute --file database/seed.sql',
  },
  datasource: { url: env.databaseUrl },
});
