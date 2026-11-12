// QUÉ ES: cómo es una reserva de cancha (un turno de una hora).
// NIVEL: entity — refleja la tabla bookings de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 BookingsService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Booking {
  id: number;
  courtId: string;
  // Cuál de las canchas iguales se reservó (1, 2, ...).
  courtNumber: number;
  date: Date;
  // La hora del turno, de 0 a 23.
  hour: number;
  fullName: string;
  dni: string;
  phone: string;
  isMember: boolean;
  price: number;
}
