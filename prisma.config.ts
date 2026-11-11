import { defineConfig } from 'prisma/config';
import { env } from './src/shared/config/env.js';

// QUÉ ES: la configuración de Prisma (dónde está el schema y a qué base se conecta).
// NIVEL: configuración — la usan los comandos de Prisma (generate, db pull, studio).
// DÓNDE SE USA: npx prisma ... la lee sola desde la raíz del proyecto.

// La URL sale de env.ts, el mismo lugar que usa la API, así no se repite.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: env.databaseUrl },
});
