import { Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

// QUÉ ES: el servicio de los pagos: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PaymentsController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla payments con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PaymentsService {
  /**
   * Lista los pagos. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return { message: 'Acá se van a listar los pagos (todavía no hay base)' };
  }

  /**
   * Busca un pago por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id del pago, por ejemplo 1.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: number): PlaceholderResponse {
    return {
      message: 'Acá se va a mostrar el pago pedido (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe un pago nuevo. Por ahora devuelve los datos sin guardarlos.
   * @param createPaymentDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   */
  create(
    createPaymentDto: CreatePaymentDto
  ): PlaceholderResponse<CreatePaymentDto> {
    return {
      message: 'Pago recibido (todavía no se guarda en la base)',
      data: createPaymentDto,
    };
  }

  /**
   * Recibe los cambios de un pago. Por ahora los devuelve sin guardarlos.
   * @param id - El id del pago a editar.
   * @param updatePaymentDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: number,
    updatePaymentDto: UpdatePaymentDto
  ): PlaceholderResponse<UpdatePaymentDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updatePaymentDto,
    };
  }

  /**
   * Recibe el pedido para borrar un pago. Por ahora no borra nada.
   * @param id - El id del pago a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: number): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }
}
