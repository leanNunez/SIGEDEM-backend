import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { BookingModule } from '../booking/booking.module.js';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { PlansModule } from '../plans/plans.module.js';
import { UsersModule } from '../users/users.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// QUÉ ES: el módulo raíz: reúne todos los módulos de la API.
// NIVEL: módulo — junta controllers, services y otros módulos.
// DÓNDE SE USA: main.ts lo usa para crear la app; también los tests e2e.

// @Module le dice a Nest qué módulos importa y qué controllers y services
// tiene este. Cada módulo importado declara sus propias rutas.
@Module({
  imports: [
    AuthModule,
    UsersModule,
    PlansModule,
    EnrollmentModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
