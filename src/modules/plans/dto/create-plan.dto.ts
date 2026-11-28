import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear un plan.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PlansController lo recibe en POST /api/plans.
// Los datos se guardan en la tabla plans (ver PlansService).

// Cada decorador repite una regla de la tabla plans (prisma/schema.prisma y los
// CHECK de la migración init).
// Así el error se detecta acá y la API responde 400 con un mensaje claro,
// antes de que el dato llegue a la base.

// Los mismos valores que permite el CHECK de la columna type.
export const PLAN_TYPES = ['individual', 'familiar'] as const;

// El id no se manda: lo pone la base (autoincremental). Si llega en el body,
// forbidNonWhitelisted lo rechaza con 400 porque el DTO no lo declara.
export class CreatePlanDto {
  // Cada @MaxLength coincide con el VARCHAR de su columna.
  // name es el texto que identifica al plan ('Familiar'): es único en la tabla,
  // así que un nombre repetido responde 409.
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
