import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

// QUÉ ES: el módulo de pagos informados de las inscripciones.
// NIVEL: módulo — junta el controller y el service de pagos.
// DÓNDE SE USA: lo importa AppModule.

// PrismaService no se declara acá: llega solo porque PrismaModule es global.
@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
