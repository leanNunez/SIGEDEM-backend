// QUÉ ES: cómo es un pago informado (la transferencia de una inscripción).
// NIVEL: entity — refleja la tabla payments de database/schema.sql.
// DÓNDE SE USA: PaymentsService y PaymentsController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Payment de prisma/schema.prisma.
// Campos: id, enrollmentId, method, amount, paidOn, operationNumber, status y
// verifiedBy (verifiedBy puede ser null).
// amount es NUMERIC(10, 2) en la tabla y Prisma lo trae como Decimal (un número
// exacto, sin errores de redondeo). En el JSON de la respuesta sale como texto:
// "18000" en vez de 18000.
export type { Payment } from '../../../generated/prisma/client.js';
