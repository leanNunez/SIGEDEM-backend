import { Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';

// QUÉ ES: el servicio de las inscripciones: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: EnrollmentsController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla enrollments con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class EnrollmentsService {
  /**
   * Lista las inscripciones. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return {
      message: 'Acá se van a listar las inscripciones (todavía no hay base)',
    };
  }

  /**
   * Busca una inscripción por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id de la inscripción, por ejemplo 1.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: number): PlaceholderResponse {
    return {
      message:
        'Acá se va a mostrar la inscripción pedida (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe una inscripción nueva. Por ahora devuelve los datos sin guardarlos.
   * @param createEnrollmentDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   */
  create(
    createEnrollmentDto: CreateEnrollmentDto
  ): PlaceholderResponse<CreateEnrollmentDto> {
    return {
      message: 'Inscripción recibida (todavía no se guarda en la base)',
      data: createEnrollmentDto,
    };
  }

  /**
   * Recibe los cambios de una inscripción. Por ahora los devuelve sin guardarlos.
   * @param id - El id de la inscripción a editar.
   * @param updateEnrollmentDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: number,
    updateEnrollmentDto: UpdateEnrollmentDto
  ): PlaceholderResponse<UpdateEnrollmentDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updateEnrollmentDto,
    };
  }

  /**
   * Recibe el pedido para borrar una inscripción. Por ahora no borra nada.
   * @param id - El id de la inscripción a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: number): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }
}
