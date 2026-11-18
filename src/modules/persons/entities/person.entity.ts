// QUÉ ES: cómo es una persona del padrón de vecinos.
// NIVEL: entity — refleja la tabla persons (prisma/schema.prisma).
// DÓNDE SE USA: PersonsService y PersonsController devuelven objetos con esta forma.

// El tipo lo genera Prisma a partir del model Person de prisma/schema.prisma.
// Campos: id, familyGroupId, dni, firstName, lastName, birthDate, email y phone
// (familyGroupId, email y phone pueden ser null). birthDate es un Date y en el
// JSON de la respuesta sale como texto ISO ('1990-07-08T00:00:00.000Z').
export type { Person } from '../../../generated/prisma/client.js';
