import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar un pago.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: PaymentsController lo recibe en PATCH /api/payments/:id.

// PartialType copia las reglas de CreatePaymentDto pero vuelve todos los
// campos opcionales: se manda solo lo que cambia (por ejemplo, el estado y
// quién lo verificó).
export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
