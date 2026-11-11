import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar una inscripción.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: EnrollmentsController lo recibe en PATCH /api/enrollments/:id.

// PartialType copia las reglas de CreateEnrollmentDto pero vuelve todos los
// campos opcionales: se manda solo lo que cambia (por ejemplo, el estado).
export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {}
