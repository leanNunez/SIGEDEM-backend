import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

// QUÉ ES: la ruta raíz de la API (GET /api).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra AppModule.

// @Controller() sin nombre deja la ruta en /api (el /api lo agrega setupApp).
@Controller()
export class AppController {
  // Nest crea AppService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly appService: AppService) {}

  /**
   * GET /api — sirve para comprobar que la API está levantada.
   * @returns El mensaje de estado de la API.
   */
  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }
}
