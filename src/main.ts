import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { env } from './shared/config/env.js';
import { setupApp } from './shared/config/setup-app.js';

// Punto de entrada: crea la app, le aplica la configuración global y la
// pone a escuchar. Las rutas las declara cada módulo en sus controllers.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.listen(env.port);
}
await bootstrap();
