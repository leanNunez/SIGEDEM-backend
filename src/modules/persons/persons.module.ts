import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller.js';
import { PersonsService } from './persons.service.js';

// QUÉ ES: el módulo del padrón de personas (vecinos).
// NIVEL: módulo — junta el controller y el service de personas.
// DÓNDE SE USA: lo importa AppModule.

@Module({
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
