// QUÉ ES: cómo es un pago informado (la transferencia de una inscripción).
// NIVEL: entity — refleja la tabla payments de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 PaymentsService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Payment {
  id: number;
  enrollmentId: number;
  method: string;
  amount: number;
  paidOn: Date;
  // El número de la transferencia; es único para detectar comprobantes repetidos.
  operationNumber: string;
  // Solo puede ser uno de estos valores (igual que el CHECK de la tabla).
  status: 'pendiente' | 'acreditado' | 'rechazado';
  // El usuario que verificó el pago; null mientras nadie lo revisó.
  verifiedBy: number | null;
}
