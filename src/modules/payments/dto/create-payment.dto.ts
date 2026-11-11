import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../../shared/validation/date-pattern.js';

// QUÉ ES: los datos que hay que mandar en el body para registrar un pago.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PaymentsController lo recibe en POST /api/payments.
// A FUTURO: en el TP 11 los datos se guardan en la tabla payments (ver PaymentsService).

// Cada decorador repite una regla de la tabla payments (database/schema.sql).
// Así el error se detecta acá y la API responde 400 con un mensaje claro,
// antes de que el dato llegue a la base.

// Los mismos valores que permite el CHECK de la columna status.
export const PAYMENT_STATUSES = [
  'pendiente',
  'acreditado',
  'rechazado',
] as const;

// El monto más grande que entra en NUMERIC(10, 2): 8 cifras enteras y 2 decimales.
const MAX_AMOUNT = 99_999_999.99;

export class CreatePaymentDto {
  // @IsInt + @IsPositive: el id de la inscripción es un entero mayor que 0.
  // Si la inscripción no existe, la FK de la tabla lo rechaza y la API responde 409.
  @IsInt()
  @IsPositive()
  enrollmentId: number;

  // La tabla no limita los valores (no tiene CHECK); si no viene, usa 'transferencia'.
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  method?: string;

  // @IsNumber con maxDecimalPlaces: 2 rechaza montos como 100.555 (la columna
  // guarda 2 decimales). @IsPositive repite el CHECK (amount > 0).
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto tiene que ser un número con hasta 2 decimales' }
  )
  @IsPositive()
  @Max(MAX_AMOUNT)
  amount: number;

  // La fecha llega en texto, por ejemplo '2026-10-01'.
  // @IsDateString con strict: true rechaza días que no existen ('2026-02-30').
  // @Matches exige AAAA-MM-DD, sin hora ni zona horaria (ver date-pattern.ts).
  // En el TP 11, PaymentsService la va a convertir en Date antes de guardarla.
  @IsDateString(
    { strict: true },
    { message: 'La fecha del pago tiene que ser AAAA-MM-DD' }
  )
  @Matches(DATE_ONLY_PATTERN, {
    message: 'La fecha del pago tiene que ser AAAA-MM-DD',
  })
  paidOn: string;

  // La columna es UNIQUE: un comprobante repetido responde 409.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  operationNumber: string;

  // @IsOptional deja que el campo no venga; si no viene, la tabla usa 'pendiente'.
  // @IsIn rechaza cualquier valor que no esté en la lista.
  @IsOptional()
  @IsIn(PAYMENT_STATUSES, {
    message: 'El estado tiene que ser pendiente, acreditado o rechazado',
  })
  status?: (typeof PAYMENT_STATUSES)[number];

  // El usuario que verificó el pago; queda vacío mientras nadie lo revisó.
  @IsOptional()
  @IsInt()
  @IsPositive()
  verifiedBy?: number;
}
