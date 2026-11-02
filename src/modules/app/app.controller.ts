import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

// Ruta raíz de la API (GET /api): sirve para comprobar que está levantada.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }
}
