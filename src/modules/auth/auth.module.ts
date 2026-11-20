import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

// QUÉ ES: el módulo de autenticación (registro y login).
// NIVEL: módulo — junta el controller y el service de auth.
// DÓNDE SE USA: lo importa AppModule.
// A FUTURO: acá se configura JwtModule con env.jwtSecret para el login.

// Importa UsersModule para poder usar UsersService (lo exporta ese módulo).
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
