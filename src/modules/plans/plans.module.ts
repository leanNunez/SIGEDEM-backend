import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller.js';
import { PlansService } from './plans.service.js';

// QUÉ ES: el módulo de planes del abono.
// NIVEL: módulo — junta el controller y el service de planes.
// DÓNDE SE USA: lo importa AppModule.

// PrismaService no se declara acá: llega solo porque PrismaModule es global.
@Module({
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
