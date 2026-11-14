import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { env } from '../config/env.js';

// QUÉ ES: la conexión a PostgreSQL que comparten todos los módulos.
// NIVEL: base de datos — es el cliente de Prisma, preparado para Nest.
// DÓNDE SE USA: cada service lo recibe en su constructor (ej.: PlansService).

// Al heredar de PrismaClient, este service tiene un atributo por tabla:
// this.plan, this.person, this.booking, etc. (los models de prisma/schema.prisma).
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Crea el cliente de Prisma con el adaptador de PostgreSQL y la URL del .env.
   */
  constructor() {
    // Prisma 7 se conecta a la base a través de un "adaptador" (el driver pg).
    super({ adapter: new PrismaPg({ connectionString: env.databaseUrl }) });
  }

  /**
   * Abre la conexión cuando arranca la app, así un error de conexión se ve
   * enseguida y no en el primer pedido.
   * @returns Una promesa que se cumple cuando la conexión está abierta.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Cierra la conexión cuando la app se apaga.
   * @returns Una promesa que se cumple cuando la conexión está cerrada.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
