import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar un plan.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PlansController lo recibe en PATCH /api/plans/:id.

// PartialType copia las reglas de CreatePlanDto pero vuelve todos los campos
// opcionales: se manda solo lo que cambia. OmitType saca el id, porque el id
// va en la URL y no se puede cambiar (otras tablas lo usan como FK).
export class UpdatePlanDto extends PartialType(
  OmitType(CreatePlanDto, ['id'] as const)
) {}
