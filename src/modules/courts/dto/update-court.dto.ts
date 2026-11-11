import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourtDto } from './create-court.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar una cancha.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: CourtsController lo recibe en PATCH /api/courts/:id.

// PartialType copia las reglas de CreateCourtDto pero vuelve todos los campos
// opcionales: se manda solo lo que cambia. OmitType saca el id, porque el id
// va en la URL y no se puede cambiar (bookings lo usa como FK).
export class UpdateCourtDto extends PartialType(
  OmitType(CreateCourtDto, ['id'] as const)
) {}
