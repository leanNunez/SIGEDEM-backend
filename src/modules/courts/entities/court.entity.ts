// QUÉ ES: cómo es un tipo de cancha en alquiler.
// NIVEL: entity — refleja la tabla courts de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 CourtsService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Court {
  // Identificador fijo y legible ('futbol-5'), el mismo del front.
  id: string;
  // Solo puede ser uno de estos dos valores (igual que el CHECK de la tabla).
  activity: 'futbol' | 'voley';
  name: string;
  detail: string;
  // Cuántas canchas iguales hay de este tipo.
  units: number;
  memberPrice: number;
  publicPrice: number;
}
