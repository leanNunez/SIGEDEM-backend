import type { Booking, Renter } from '../../../generated/prisma/client.js';

// QUÉ ES: cómo es una reserva de cancha (un turno de una hora) y quién la hizo.
// NIVEL: entity — refleja las tablas bookings y renters de database/schema.sql.
// DÓNDE SE USA: BookingsService y BookingsController devuelven objetos con esta forma.

// Los tipos los genera Prisma a partir de los models Booking y Renter de
// prisma/schema.prisma.
// Booking: id, courtId, courtNumber, date, hour, renterId, isMember y price.
// Renter: id, dni, fullName y phone (los datos de quien alquila, uno por DNI).
// date sale en el JSON como texto ISO ('2026-11-05T00:00:00.000Z').
// price es NUMERIC(10, 2) en la tabla y Prisma lo trae como Decimal (un número
// exacto, sin errores de redondeo). En el JSON sale como texto: "15000".
export type { Booking, Renter };

// Lo que devuelve la API: la reserva con los datos de quien alquila adentro.
export type BookingWithRenter = Booking & { renter: Renter };
