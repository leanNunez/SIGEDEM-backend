import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

// QUÉ ES: el módulo de usuarios (las cuentas del personal).
// NIVEL: módulo — junta el controller y el service de usuarios.
// DÓNDE SE USA: lo importa AppModule.

// PrismaService no se declara acá: llega solo porque PrismaModule es global.
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
