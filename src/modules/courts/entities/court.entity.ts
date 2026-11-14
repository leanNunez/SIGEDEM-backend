// QUÉ ES: cómo es un tipo de cancha en alquiler.
// NIVEL: entity — refleja la tabla courts (prisma/schema.prisma).
// DÓNDE SE USA: CourtsService y CourtsController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Court de prisma/schema.prisma.
// Campos: id, activity, name, detail, units, memberPrice y publicPrice.
// Los precios son NUMERIC(10, 2) en la tabla y Prisma los trae como Decimal
// (un número exacto, sin errores de redondeo). En el JSON de la respuesta salen
// como texto: "15000" en vez de 15000.
export type { Court } from '../../../generated/prisma/client.js';
