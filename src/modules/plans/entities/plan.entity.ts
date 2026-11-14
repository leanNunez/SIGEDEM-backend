// QUÉ ES: cómo es un plan del abono.
// NIVEL: entity — refleja la tabla plans de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 PlansService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Plan {
  // Identificador fijo y legible ('individual', 'familiar'), el mismo del front.
  id: string;
  name: string;
  // Solo puede ser uno de estos dos valores (igual que el CHECK de la tabla).
  type: 'individual' | 'familiar';
  people: string;
  description: string;
  // null = la columna está vacía (en la tabla puede ser NULL).
  discountNote: string | null;
  badge: string | null;
}
