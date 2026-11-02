import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { BookingModule } from '../booking/booking.module.js';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { PlansModule } from '../plans/plans.module.js';
import { UsersModule } from '../users/users.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Módulo raíz: reúne los módulos del dominio. Cada uno declara sus rutas.
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
