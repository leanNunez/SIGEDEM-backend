// QUÉ ES: cómo es una solicitud de inscripción al abono.
// NIVEL: entity — refleja la tabla enrollments de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 EnrollmentsService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Enrollment {
  id: number;
  personId: number;
  planId: string;
  // El usuario que cargó la inscripción.
  createdBy: number;
  // Solo puede ser uno de estos valores (igual que el CHECK de la tabla).
  status: 'pendiente' | 'acreditada' | 'anulada';
  // La fecha real del trámite; loadedAt es cuándo se cargó en el sistema.
  procedureDate: Date;
  loadedAt: Date;
}
