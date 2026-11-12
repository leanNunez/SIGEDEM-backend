import { BadRequestException, Injectable } from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreateCourtDto } from './dto/create-court.dto.js';
import { UpdateCourtDto } from './dto/update-court.dto.js';

// QUÉ ES: el servicio de las canchas: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: CourtsController lo recibe por inyección de dependencias.
// A FUTURO: en el TP 11 se conecta a la tabla courts con Prisma. Por ahora
// no guarda nada: responde un mensaje y los datos que llegaron, ya validados.
// Al editar, la regla de los precios se va a revisar contra la cancha guardada.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class CourtsService {
  /**
   * Lista las canchas. Por ahora solo responde un mensaje, porque no hay base.
   * @returns Un mensaje que explica qué va a devolver esta ruta.
   */
  findAll(): PlaceholderResponse {
    return { message: 'Acá se van a listar las canchas (todavía no hay base)' };
  }

  /**
   * Busca una cancha por su id. Por ahora solo devuelve el id que llegó.
   * @param id - El id de la cancha, por ejemplo 'futbol-5'.
   * @returns Un mensaje con el id pedido.
   */
  findOne(id: string): PlaceholderResponse {
    return {
      message: 'Acá se va a mostrar la cancha pedida (todavía no hay base)',
      id,
    };
  }

  /**
   * Recibe una cancha nueva. Por ahora devuelve los datos sin guardarlos.
   * @param createCourtDto - Los datos que llegaron en el body, ya validados.
   * @returns Un mensaje con los datos recibidos.
   * @throws BadRequestException si el precio para el público es menor que el de socios.
   */
  create(createCourtDto: CreateCourtDto): PlaceholderResponse<CreateCourtDto> {
    this.checkPrices(createCourtDto.memberPrice, createCourtDto.publicPrice);
    return {
      message: 'Cancha recibida (todavía no se guarda en la base)',
      data: createCourtDto,
    };
  }

  /**
   * Recibe los cambios de una cancha. Por ahora los devuelve sin guardarlos.
   * @param id - El id de la cancha a editar.
   * @param updateCourtDto - Solo los campos que cambian, ya validados.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  update(
    id: string,
    updateCourtDto: UpdateCourtDto
  ): PlaceholderResponse<UpdateCourtDto> {
    return {
      message: 'Cambios recibidos (todavía no se guardan en la base)',
      id,
      data: updateCourtDto,
    };
  }

  /**
   * Recibe el pedido para borrar una cancha. Por ahora no borra nada.
   * @param id - El id de la cancha a borrar.
   * @returns Un mensaje con el id pedido.
   */
  remove(id: string): PlaceholderResponse {
    return { message: 'Pedido de borrado recibido (todavía no hay base)', id };
  }

  /**
   * Revisa la misma regla que el CHECK (public_price >= member_price) de la
   * tabla courts, para responder 400 con un mensaje claro.
   * @param memberPrice - El precio para socios.
   * @param publicPrice - El precio para el público.
   * @throws BadRequestException si el precio para el público es menor que el de socios.
   */
  private checkPrices(memberPrice: number, publicPrice: number): void {
    if (publicPrice >= memberPrice) return;
    throw new BadRequestException(
      'El precio para el público no puede ser menor que el precio para socios'
    );
  }
}
