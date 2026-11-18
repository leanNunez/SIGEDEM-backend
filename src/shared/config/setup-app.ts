import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaExceptionFilter } from '../database/prisma-exception.filter.js';
import { env } from './env.js';

// QUÉ ES: la configuración global de la app (prefijo, CORS, validación y errores).
// NIVEL: configuración — vive acá para que main.ts quede limpio.
// DÓNDE SE USA: main.ts y los tests e2e, así los dos levantan la app igual.

/**
 * Aplica la configuración que comparten todas las rutas de la API.
 * @param app - La app de Nest recién creada.
 */
export function setupApp(app: INestApplication): void {
  // Todas las rutas quedan bajo /api (ej.: GET /api/plans).
  app.setGlobalPrefix('api');
  app.enableCors({ origin: env.frontendUrl });
  // ValidationPipe revisa cada body contra los decoradores de su DTO
  // (class-validator) y responde 400 si algún campo no cumple.
  // whitelist + forbidNonWhitelisted: si llega un campo que el DTO no declara,
  // responde 400. Así nadie puede mandar, por ejemplo, un id o un hash a mano.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  // El filtro necesita el adaptador HTTP para poder armar la respuesta.
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));
}
