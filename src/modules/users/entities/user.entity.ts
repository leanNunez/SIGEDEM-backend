import type { User } from '../../../generated/prisma/client.js';

// QUÉ ES: cómo es un usuario del personal (operador, coordinador, médico...).
// NIVEL: entity — refleja la tabla users (prisma/schema.prisma).
// DÓNDE SE USA: UsersService, UsersController y AuthService.

// El tipo User lo genera Prisma a partir del model User de prisma/schema.prisma.
// Campos: id, roleId, fullName, email, passwordHash, isActive y createdAt.
export type { User };

// Un usuario tal como sale por la API: igual que User pero sin passwordHash.
// El hash de la contraseña nunca se devuelve, ni siquiera a quien lo creó.
export type PublicUser = Omit<User, 'passwordHash'>;
