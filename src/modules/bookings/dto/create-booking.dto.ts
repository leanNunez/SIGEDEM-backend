import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../../shared/validation/date-pattern.js';

// QUÉ ES: los datos que hay que mandar en el body para reservar una cancha.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: BookingsController lo recibe en POST /api/bookings.
// Los datos se guardan en la tabla bookings, salvo fullName, dni y phone, que
// van a la tabla renters (una fila por DNI; ver BookingsService).

// Cada decorador repite una regla de las tablas bookings y renters
// (database/schema.sql).
// Así el error se detecta acá y la API responde 400 con un mensaje claro,
// antes de que el dato llegue a la base.

// Regex del DNI, la misma del CHECK de la columna renters.dni.
//   ^ y $    → la regla se aplica al texto completo.
//   [0-9]    → cada carácter es un número.
//   {7,8}    → tiene que haber 7 u 8 números.
// Ejemplos: '30111222' pasa; '30.111.222' no (tiene puntos).
const DNI_PATTERN = /^[0-9]{7,8}$/;

// Los turnos van de 0 a 23, igual que el CHECK (hour BETWEEN 0 AND 23).
const FIRST_HOUR = 0;
const LAST_HOUR = 23;

// El número más grande que entra en una columna SMALLINT.
const SMALLINT_MAX = 32_767;

// El monto más grande que entra en NUMERIC(10, 2): 8 cifras enteras y 2 decimales.
const MAX_PRICE = 99_999_999.99;

export class CreateBookingDto {
  // El id de la cancha es un texto, por ejemplo 'futbol-5' (VARCHAR(30)).
  // Si la cancha no existe, la FK de la tabla lo rechaza y la API responde 409.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  courtId: string;

  // Cuál de las canchas iguales se reserva. @IsOptional deja que no venga;
  // si no viene, la tabla usa 1. @IsPositive repite el CHECK (court_number > 0).
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(SMALLINT_MAX)
  courtNumber?: number;

  // La fecha llega en texto, por ejemplo '2026-11-05'.
  // @IsDateString con strict: true rechaza días que no existen ('2026-02-30').
  // @Matches exige AAAA-MM-DD, sin hora ni zona horaria (ver date-pattern.ts).
  // BookingsService la convierte en Date antes de guardarla.
  @IsDateString(
    { strict: true },
    { message: 'La fecha tiene que ser AAAA-MM-DD' }
  )
  @Matches(DATE_ONLY_PATTERN, { message: 'La fecha tiene que ser AAAA-MM-DD' })
  date: string;

  @IsInt()
  @Min(FIRST_HOUR)
  @Max(LAST_HOUR)
  hour: number;

  // Cada @MaxLength coincide con el VARCHAR de su columna.
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName: string;

  @IsString()
  @Matches(DNI_PATTERN, {
    message: 'El DNI tiene que tener 7 u 8 números, sin puntos',
  })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  // Si no viene, la tabla usa FALSE (no es socio).
  @IsOptional()
  @IsBoolean()
  isMember?: boolean;

  // @IsNumber con maxDecimalPlaces: 2 rechaza precios como 100.555 (la columna
  // guarda 2 decimales). @Min(0) repite el CHECK (price >= 0).
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio tiene que ser un número con hasta 2 decimales' }
  )
  @Min(0)
  @Max(MAX_PRICE)
  price: number;
}
