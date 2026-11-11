import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

// QUÉ ES: el módulo de alquiler de canchas (las reservas).
// NIVEL: módulo — junta el controller y el service de reservas.
// DÓNDE SE USA: lo importa AppModule.

// PrismaService no se declara acá: llega solo porque PrismaModule es global.
@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
