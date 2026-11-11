import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear una inscripción.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: EnrollmentsController lo recibe en POST /api/enrollments.
// A FUTURO: en el TP 11 los datos se guardan en la tabla enrollments (ver EnrollmentsService).

// Cada decorador repite una regla de la tabla enrollments (database/schema.sql).
// loadedAt no va acá: la base lo completa sola con la fecha y hora de carga.

// Los mismos valores que permite el CHECK de la columna status.
export const ENROLLMENT_STATUSES = [
  'pendiente',
  'acreditada',
  'anulada',
] as const;

export class CreateEnrollmentDto {
  // @IsInt + @IsPositive: los id de otras tablas son enteros mayores que 0.
  // Si la persona, el plan o el usuario no existen, la FK de la tabla lo
  // rechaza y la API responde 409.
  @IsInt()
  @IsPositive()
  personId: number;

  // El id del plan es un texto, por ejemplo 'familiar' (VARCHAR(30)).
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  planId: string;

  // El usuario que carga la inscripción.
  @IsInt()
  @IsPositive()
  createdBy: number;

  // @IsOptional deja que el campo no venga; si no viene, la tabla usa 'pendiente'.
  // @IsIn rechaza cualquier valor que no esté en la lista.
  @IsOptional()
  @IsIn(ENROLLMENT_STATUSES, {
    message: 'El estado tiene que ser pendiente, acreditada o anulada',
  })
  status?: (typeof ENROLLMENT_STATUSES)[number];

  // @IsDateString acepta una fecha en texto, por ejemplo '2026-10-01'.
  // En el TP 11, EnrollmentsService la va a convertir en Date antes de guardarla.
  @IsDateString(
    {},
    { message: 'La fecha del trámite tiene que ser AAAA-MM-DD' }
  )
  procedureDate: string;
}
