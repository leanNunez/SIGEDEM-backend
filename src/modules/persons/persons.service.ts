import { Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';

// QUÉ ES: el servicio de las personas: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PersonsController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla persons con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PersonsService {
  /**
   * Lista las personas. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return {
      message: 'Acá se van a listar las personas (todavía no hay base)',
    };
  }

  /**
   * Busca una persona por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id de la persona, por ejemplo 1.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: number): PlaceholderResponse {
    return {
      message: 'Acá se va a mostrar la persona pedida (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe una persona nueva. Por ahora devuelve los datos sin guardarlos.
   * @param createPersonDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   */
  create(
    createPersonDto: CreatePersonDto
  ): PlaceholderResponse<CreatePersonDto> {
    return {
      message: 'Persona recibida (todavía no se guarda en la base)',
      data: createPersonDto,
    };
  }

  /**
   * Recibe los cambios de una persona. Por ahora los devuelve sin guardarlos.
   * @param id - El id de la persona a editar.
   * @param updatePersonDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: number,
    updatePersonDto: UpdatePersonDto
  ): PlaceholderResponse<UpdatePersonDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updatePersonDto,
    };
  }

  /**
   * Recibe el pedido para borrar una persona. Por ahora no borra nada.
   * @param id - El id de la persona a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: number): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }
}
