// QUÉ ES: cómo es una reserva de cancha (un turno de una hora).
// NIVEL: entity — refleja la tabla bookings de database/schema.sql.
// DÓNDE SE USA: BookingsService y BookingsController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Booking de prisma/schema.prisma.
// Campos: id, courtId, courtNumber, date, hour, fullName, dni, phone, isMember
// y price. date sale en el JSON como texto ISO ('2026-11-05T00:00:00.000Z').
// price es NUMERIC(10, 2) en la tabla y Prisma lo trae como Decimal (un número
// exacto, sin errores de redondeo). En el JSON sale como texto: "15000".
export type { Booking } from '../../../generated/prisma/client.js';
