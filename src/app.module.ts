import { Module } from '@nestjs/common';
import { BookingModule } from './modules/booking/booking.module.js';
import { EnrollmentModule } from './modules/enrollment/enrollment.module.js';
import { PlansModule } from './modules/plans/plans.module.js';
import { UsersModule } from './modules/users/users.module.js';

// Módulo raíz: reúne los módulos del dominio. Cada uno declara sus rutas.
@Module({
  imports: [UsersModule, PlansModule, EnrollmentModule, BookingModule],
})
export class AppModule {}
