import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto.js';

// QUÉ ES: los datos que se pueden mandar en el body para editar una reserva.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: BookingsController lo recibe en PATCH /api/bookings/:id.

// PartialType copia las reglas de CreateBookingDto pero vuelve todos los
// campos opcionales: se manda solo lo que cambia (por ejemplo, la hora).
export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
