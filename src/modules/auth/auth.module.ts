import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../shared/config/env.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

// QUÉ ES: el módulo de autenticación (registro y login).
// NIVEL: módulo — junta el controller y el service de auth.
// DÓNDE SE USA: lo importa AppModule.

// Importa UsersModule para poder usar UsersService (lo exporta ese módulo).
// JwtModule.register configura JwtService: con qué clave se firman los
// tokens (JWT_SECRET del .env) y cuánto duran (1 hora).
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: env.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
