import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller.js';
import { EnrollmentsService } from './enrollments.service.js';

// QUÉ ES: el módulo de inscripciones al abono.
// NIVEL: módulo — junta el controller y el service de inscripciones.
// DÓNDE SE USA: lo importa AppModule.

// PrismaService no se declara acá: llega solo porque PrismaModule es global.
@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
