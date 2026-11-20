import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

// QUÉ ES: el módulo de usuarios del personal.
// NIVEL: módulo — junta el controller y el service de usuarios.
// DÓNDE SE USA: lo importan AppModule y AuthModule.

// exports deja que otros módulos usen UsersService: AuthModule lo necesita
// para registrar usuarios y, en el login, buscarlos por mail.
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
