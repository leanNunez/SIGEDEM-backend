import { Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

// QUÉ ES: el servicio de las reservas: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: BookingsController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla bookings con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class BookingsService {
  /**
   * Lista las reservas. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return {
      message: 'Acá se van a listar las reservas (todavía no hay base)',
    };
  }

  /**
   * Busca una reserva por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id de la reserva, por ejemplo 1.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: number): PlaceholderResponse {
    return {
      message: 'Acá se va a mostrar la reserva pedida (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe una reserva nueva. Por ahora devuelve los datos sin guardarlos.
   * @param createBookingDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   */
  create(
    createBookingDto: CreateBookingDto
  ): PlaceholderResponse<CreateBookingDto> {
    return {
      message: 'Reserva recibida (todavía no se guarda en la base)',
      data: createBookingDto,
    };
  }

  /**
   * Recibe los cambios de una reserva. Por ahora los devuelve sin guardarlos.
   * @param id - El id de la reserva a editar.
   * @param updateBookingDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: number,
    updateBookingDto: UpdateBookingDto
  ): PlaceholderResponse<UpdateBookingDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updateBookingDto,
    };
  }

  /**
   * Recibe el pedido para borrar una reserva. Por ahora no borra nada.
   * @param id - El id de la reserva a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: number): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }
}
