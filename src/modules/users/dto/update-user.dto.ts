import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar un usuario.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: UsersController lo recibe en PATCH /api/users/:id.

// PartialType copia las reglas de CreateUserDto pero vuelve todos los campos
// opcionales: se manda solo lo que cambia. Si viene password, UsersService
// la vuelve a hashear.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
