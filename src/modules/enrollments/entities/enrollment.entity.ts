// QUÉ ES: cómo es una solicitud de inscripción al abono.
// NIVEL: entity — refleja la tabla enrollments (prisma/schema.prisma).
// DÓNDE SE USA: EnrollmentsService y EnrollmentsController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Enrollment de prisma/schema.prisma.
// Campos: id, personId, planId, createdBy, status, procedureDate y loadedAt.
// procedureDate es la fecha real del trámite; loadedAt la pone la base al
// cargar la fila (DEFAULT NOW()). Las dos salen en el JSON como texto ISO.
export type { Enrollment } from '../../../generated/prisma/client.js';
