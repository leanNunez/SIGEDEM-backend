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
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { EnrollmentsService } from './enrollments.service.js';
import { Enrollment } from './entities/enrollment.entity.js';

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
   * @returns Las inscripciones.
   */
  @Get()
  findAll(): Promise<Enrollment[]> {
    return this.enrollmentsService.findAll();
  }

  /**
   * GET /api/enrollments/:id — devuelve una inscripción.
   * @param id - El id que viene en la URL (/api/enrollments/1 → 1).
   * @returns La inscripción encontrada.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Enrollment> {
    return this.enrollmentsService.findOne(id);
  }

  /**
   * POST /api/enrollments — crea una inscripción.
   * @param createEnrollmentDto - El body del pedido, ya validado por ValidationPipe.
   * @returns La inscripción creada (responde 201).
   */
  @Post()
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto
  ): Promise<Enrollment> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  /**
   * PATCH /api/enrollments/:id — edita una inscripción.
   * @param id - El id que viene en la URL.
   * @param updateEnrollmentDto - Solo los campos que cambian.
   * @returns La inscripción editada.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  /**
   * DELETE /api/enrollments/:id — borra una inscripción.
   * Si la inscripción tiene pagos o un abono, la base no deja borrarla (409).
   * @param id - El id que viene en la URL.
   * @returns La inscripción borrada.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Enrollment> {
    return this.enrollmentsService.remove(id);
  }
}
