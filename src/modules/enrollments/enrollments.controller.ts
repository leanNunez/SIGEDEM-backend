import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { EnrollmentsService } from './enrollments.service.js';

// QUÉ ES: las rutas de inscripciones (/api/enrollments).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra EnrollmentsModule.

// @Controller('enrollments') hace que todas estas rutas empiecen con
// /api/enrollments (el /api lo agrega setupApp para toda la app).
@Controller('enrollments')
export class EnrollmentsController {
  // Nest crea EnrollmentsService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * GET /api/enrollments — lista todas las inscripciones.
   * @returns Un mensaje provisorio (en el TP 11, la lista de las inscripciones).
   */
  @Get()
  findAll(): PlaceholderResponse {
    return this.enrollmentsService.findAll();
  }

  /**
   * GET /api/enrollments/:id — devuelve una inscripción.
   * @param id - El id que viene en la URL (/api/enrollments/1 → 1).
   * @returns Un mensaje con el id pedido.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.enrollmentsService.findOne(id);
  }

  /**
   * POST /api/enrollments — crea una inscripción.
   * @param createEnrollmentDto - El body del pedido, ya validado por ValidationPipe.
   * @returns Un mensaje con los datos recibidos (responde 201).
   */
  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto
  ): PlaceholderResponse<CreateEnrollmentDto> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  /**
   * PATCH /api/enrollments/:id — edita una inscripción.
   * @param id - El id que viene en la URL.
   * @param updateEnrollmentDto - Solo los campos que cambian.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ): PlaceholderResponse<UpdateEnrollmentDto> {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  /**
   * DELETE /api/enrollments/:id — borra una inscripción.
   * @param id - El id que viene en la URL.
   * @returns Un mensaje con el id pedido.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.enrollmentsService.remove(id);
  }
}
