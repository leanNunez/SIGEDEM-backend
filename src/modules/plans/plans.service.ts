import { Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { UpdatePlanDto } from './dto/update-plan.dto.js';

// QUÉ ES: el servicio de los planes: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PlansController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla plans con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PlansService {
  /**
   * Lista los planes. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return { message: 'Acá se van a listar los planes (todavía no hay base)' };
  }

  /**
   * Busca un plan por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id del plan, por ejemplo 'familiar'.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: string): PlaceholderResponse {
    return {
      message: 'Acá se va a mostrar el plan pedido (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe un plan nuevo. Por ahora devuelve los datos sin guardarlos.
   * @param createPlanDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   */
  create(createPlanDto: CreatePlanDto): PlaceholderResponse<CreatePlanDto> {
    return {
      message: 'Plan recibido (todavía no se guarda en la base)',
      data: createPlanDto,
    };
  }

  /**
   * Recibe los cambios de un plan. Por ahora los devuelve sin guardarlos.
   * @param id - El id del plan a editar.
   * @param updatePlanDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: string,
    updatePlanDto: UpdatePlanDto
  ): PlaceholderResponse<UpdatePlanDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updatePlanDto,
    };
  }

  /**
   * Recibe el pedido para borrar un plan. Por ahora no borra nada.
   * @param id - El id del plan a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: string): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }
}
