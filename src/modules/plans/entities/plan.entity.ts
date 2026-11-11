// QUÉ ES: cómo es un plan del abono.
// NIVEL: entity — refleja la tabla plans (prisma/schema.prisma).
// DÓNDE SE USA: PlansService y PlansController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Plan de prisma/schema.prisma,
// así siempre coincide con la tabla y no hay que escribirlo dos veces.
// Campos: id, name, type, people, description, discountNote y badge
// (discountNote y badge pueden ser null).
export type { Plan } from '../../../generated/prisma/client.js';
