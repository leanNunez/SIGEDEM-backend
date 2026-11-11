import { Module } from '@nestjs/common';
import { CourtsController } from './courts.controller.js';
import { CourtsService } from './courts.service.js';

// QUÉ ES: el módulo de canchas en alquiler.
// NIVEL: módulo — junta el controller y el service de canchas.
// DÓNDE SE USA: lo importa AppModule.

@Module({
  controllers: [CourtsController],
  providers: [CourtsService],
})
export class CourtsModule {}
