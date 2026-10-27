import type { INestApplication } from '@nestjs/common';
import { env } from './env.js';

// Configuración global de la app. Vive acá para que main.ts quede limpio y
// los tests e2e levanten la app con la misma configuración.
export function setupApp(app: INestApplication): void {
  // Todas las rutas quedan bajo /api (ej.: GET /api/plans).
  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.frontendUrl });
}
