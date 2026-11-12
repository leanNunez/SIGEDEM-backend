// QUÉ ES: cómo es una persona del padrón de vecinos.
// NIVEL: entity — refleja la tabla persons de database/schema.sql.
// DÓNDE SE USA: todavía en ningún lado, porque en el TP 10 la API no lee la base.
// A FUTURO: en el TP 11 PersonsService devuelve objetos con esta forma, y el tipo
// lo genera Prisma a partir de prisma/schema.prisma.

export class Person {
  id: number;
  // null = no integra ningún grupo familiar.
  familyGroupId: number | null;
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string | null;
  phone: string | null;
}
