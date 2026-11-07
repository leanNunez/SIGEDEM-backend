import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear una cancha.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: CourtsController lo recibe en POST /api/courts.
// Los datos se guardan en la tabla courts (ver CourtsService).

// Cada decorador repite una regla de la tabla courts (database/schema.sql).
// La regla que compara dos campos (public_price >= member_price) la revisa
// CourtsService, porque al editar puede venir uno solo de los dos precios.

// Los mismos valores que permite el CHECK de la columna activity.
export const COURT_ACTIVITIES = ['futbol', 'voley'] as const;

// Regex para el id de la cancha, la misma idea que el id de los planes: así se
// puede usar tal cual en la URL (/api/courts/futbol-5).
//   ^ y $      → la regla se aplica al texto completo, de principio a fin.
//   [a-z0-9-]  → cada carácter es una minúscula, un número o un guion.
//   +          → tiene que haber al menos un carácter.
// Ejemplos: 'voley-playa' pasa; 'Vóley Playa' no (mayúscula, tilde y espacio).
// La tabla no tiene esta regla (id es solo VARCHAR(30)): la agrega la API.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

// El número más grande que entra en una columna SMALLINT.
const SMALLINT_MAX = 32_767;

// El monto más grande que entra en NUMERIC(10, 2): 8 cifras enteras y 2 decimales.
const MAX_PRICE = 99_999_999.99;

export class CreateCourtDto {
  // Cada @MaxLength coincide con el VARCHAR de su columna.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  // @Matches valida el texto con la regex y, si no cumple, responde 400 con
  // este mensaje.
  @Matches(SLUG_PATTERN, {
    message: 'El id solo puede tener minúsculas, números y guiones',
  })
  id: string;

  // @IsIn rechaza cualquier valor que no esté en la lista.
  @IsIn(COURT_ACTIVITIES, {
    message: 'La actividad tiene que ser futbol o voley',
  })
  activity: (typeof COURT_ACTIVITIES)[number];

  // La columna es UNIQUE: un nombre repetido responde 409.
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  detail: string;

  // Cuántas canchas iguales hay. @IsPositive repite el CHECK (units > 0).
  @IsInt()
  @IsPositive()
  @Max(SMALLINT_MAX)
  units: number;

  // @IsNumber con maxDecimalPlaces: 2 rechaza precios como 100.555 (la columna
  // guarda 2 decimales). @Min(0) repite el CHECK (member_price >= 0).
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El precio para socios tiene que ser un número con hasta 2 decimales',
    }
  )
  @Min(0)
  @Max(MAX_PRICE)
  memberPrice: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El precio para el público tiene que ser un número con hasta 2 decimales',
    }
  )
  @Min(0)
  @Max(MAX_PRICE)
  publicPrice: number;
}
