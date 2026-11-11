import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';

// QUÉ ES: traduce los errores de la base a respuestas HTTP claras.
// NIVEL: filtro de excepciones — se ejecuta cuando un service tira un error de Prisma.
// DÓNDE SE USA: setupApp lo registra para toda la app.

// Sin este filtro, un dato repetido (por ejemplo, un DNI que ya existe)
// respondería 500. Con el filtro responde 409 con un mensaje en español,
// y los services no tienen que repetir el mismo try/catch.

// Códigos de error de Prisma: https://www.prisma.io/docs/orm/reference/error-reference
const PRISMA_ERRORS: Record<string, () => HttpException> = {
  // Se viola un UNIQUE de la tabla (id, dni, email, etc. repetido).
  P2002: () => new ConflictException('Ya existe un registro con esos datos'),
  // Una FK no se cumple: el registro relacionado no existe o el registro
  // a borrar todavía está en uso en otra tabla.
  P2003: () =>
    new ConflictException(
      'El registro está relacionado con otro que no existe o que todavía lo usa'
    ),
  // update o delete no encontraron el registro.
  P2025: () => new NotFoundException('No existe el registro pedido'),
};

// @Catch(...) indica qué errores atrapa este filtro: solo los conocidos de Prisma.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  /**
   * Convierte el error de Prisma en una excepción HTTP de Nest.
   * Si el código no está en la lista, deja que Nest responda 500.
   * @param error - El error que tiró Prisma.
   * @param host - El contexto del pedido (lo da Nest).
   */
  catch(
    error: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost
  ): void {
    const toHttpError = PRISMA_ERRORS[error.code];
    super.catch(toHttpError ? toHttpError() : error, host);
  }
}
