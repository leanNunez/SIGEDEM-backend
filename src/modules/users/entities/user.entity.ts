import type { User } from '../../../generated/prisma/client.js';

// QUÉ ES: cómo es un usuario del sistema (una cuenta del personal).
// NIVEL: entity — refleja la tabla users de database/schema.sql.
// DÓNDE SE USA: UsersService y UsersController devuelven objetos con esta forma.

// El tipo User lo genera Prisma a partir del model User de prisma/schema.prisma.
// Campos: id, roleId, fullName, email, passwordHash, isActive y createdAt.
export type { User };

// Lo que la API devuelve de un usuario: todo menos passwordHash.
// Omit<Tipo, 'campo'> arma un tipo nuevo igual al original pero sin ese campo,
// así TypeScript avisa si alguna respuesta intenta incluir el hash.
export type PublicUser = Omit<User, 'passwordHash'>;
