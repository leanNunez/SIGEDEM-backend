import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear una persona.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PersonsController lo recibe en POST /api/persons.
// Los datos se guardan en la tabla persons (ver PersonsService).

// Cada decorador repite una regla de la tabla persons (database/schema.sql).
// Así el error se detecta acá y la API responde 400 con un mensaje claro,
// antes de que el dato llegue a la base.

// Regex del DNI, la misma del CHECK de la columna dni.
//   ^ y $    → la regla se aplica al texto completo.
//   [0-9]    → cada carácter es un número.
//   {7,8}    → tiene que haber 7 u 8 números.
// Ejemplos: '30111222' pasa; '30.111.222' no (tiene puntos).
const DNI_PATTERN = /^[0-9]{7,8}$/;

export class CreatePersonDto {
  // @IsOptional deja que el campo no venga: no todos tienen grupo familiar.
  // Si el grupo no existe, la FK de la tabla lo rechaza y la API responde 409.
  @IsOptional()
  @IsInt()
  @IsPositive()
  familyGroupId?: number;

  // La columna es UNIQUE: un DNI repetido responde 409.
  @IsString()
  @Matches(DNI_PATTERN, {
    message: 'El DNI tiene que tener 7 u 8 números, sin puntos',
  })
  dni: string;

  // Cada @MaxLength coincide con el VARCHAR de su columna.
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  lastName: string;

  // @IsDateString acepta una fecha en texto, por ejemplo '1990-07-08'.
  // PersonsService la convierte en Date antes de guardarla.
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento tiene que ser AAAA-MM-DD' }
  )
  birthDate: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
