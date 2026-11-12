import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// QUÉ ES: el módulo que ofrece PrismaService al resto de la API.
// NIVEL: módulo — solo registra y exporta PrismaService.
// DÓNDE SE USA: lo importa AppModule una sola vez.

// @Global() hace que PrismaService se pueda inyectar en cualquier módulo
// sin tener que importar PrismaModule en cada uno. Así hay una sola conexión.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
