import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar una persona.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PersonsController lo recibe en PATCH /api/persons/:id.

// PartialType copia las reglas de CreatePersonDto pero vuelve todos los campos
// opcionales: se manda solo lo que cambia.
export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
