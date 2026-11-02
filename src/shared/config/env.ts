import { existsSync } from 'node:fs';

// QUÉ ES: las variables de entorno de la API, leídas en un solo lugar.
// NIVEL: configuración — no tiene lógica, solo valores.
// DÓNDE SE USA: main.ts (puerto) y setup-app.ts (CORS).
// A FUTURO: databaseUrl se usa cuando conectemos la API a PostgreSQL.

// Node no lee el .env solo: acá se cargan sus valores en process.env.
if (existsSync('.env')) process.loadEnvFile('.env');

const port = Number(process.env.PORT ?? 4000);

// Variables de entorno leídas en un solo lugar. Si falta el .env, se usan
// estos valores por defecto para desarrollo local.
export const env = {
  port,
  // Conexión a PostgreSQL.
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/sigedem',
  // URL base de la API: todas las rutas cuelgan de acá.
  apiBaseUrl: process.env.API_BASE_URL ?? `http://localhost:${port}/api`,
  // Origen del front que puede llamar a la API (CORS).
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};
