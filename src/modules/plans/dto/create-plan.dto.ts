import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear un plan.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PlansController lo recibe en POST /api/plans.
// Los datos se guardan en la tabla plans (ver PlansService).

// Cada decorador repite una regla de la tabla plans (database/schema.sql).
// Así el error se detecta acá y la API responde 400 con un mensaje claro,
// antes de que el dato llegue a la base.

// Los mismos valores que permite el CHECK de la columna type.
export const PLAN_TYPES = ['individual', 'familiar'] as const;

// Regex para el id del plan. Sirve para que el id se pueda usar tal cual en la
// URL (/api/plans/familia-numerosa), igual que los id del front.
//   ^ y $      → la regla se aplica al texto completo, de principio a fin.
//   [a-z0-9-]  → cada carácter es una minúscula, un número o un guion.
//   +          → tiene que haber al menos un carácter.
// Ejemplos: 'familia-numerosa' pasa; 'Plan X' no (mayúscula y espacio).
// La tabla no tiene esta regla (id es solo VARCHAR(30)): la agrega la API.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export class CreatePlanDto {
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

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  // @IsIn rechaza cualquier valor que no esté en la lista.
  @IsIn(PLAN_TYPES, { message: 'El tipo tiene que ser individual o familiar' })
  type: (typeof PLAN_TYPES)[number];

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  people: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  // @IsOptional deja que el campo no venga; si viene, se validan las demás reglas.
  // En la tabla es discount_note y puede ser NULL.
  @IsOptional()
  @IsString()
  @MaxLength(200)
  discountNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  badge?: string;
}
