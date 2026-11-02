import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module.js';
import { env } from './shared/config/env.js';
import { setupApp } from './shared/config/setup-app.js';

// QUÉ ES: el punto de entrada de la API: la crea y la pone a escuchar.
// NIVEL: arranque — solo inicia la app; la configuración está en setup-app.ts.
// DÓNDE SE USA: lo ejecutan npm run start:dev y npm run start:prod.

/**
 * Crea la app de Nest, le aplica la configuración global y la pone a escuchar
 * en el puerto del .env.
 * @returns Una promesa que se cumple cuando la API ya está escuchando.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.listen(env.port);
  console.log(`API disponible en ${env.apiBaseUrl}`);
}

// Con "type": "module" se puede usar await fuera de una función.
await bootstrap();
