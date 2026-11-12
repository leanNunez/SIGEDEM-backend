import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { CourtsService } from './courts.service.js';
import { CreateCourtDto } from './dto/create-court.dto.js';
import { UpdateCourtDto } from './dto/update-court.dto.js';

// QUÉ ES: las rutas de canchas (/api/courts).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra CourtsModule.

// @Controller('courts') hace que todas estas rutas empiecen con /api/courts
// (el /api lo agrega setupApp para toda la app).
@Controller('courts')
export class CourtsController {
  // Nest crea CourtsService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly courtsService: CourtsService) {}

  /**
   * GET /api/courts — lista todas las canchas.
   * @returns Un mensaje provisorio (en el TP 11, la lista de las canchas).
   */
  @Get()
  findAll(): PlaceholderResponse {
    return this.courtsService.findAll();
  }

  /**
   * GET /api/courts/:id — devuelve una cancha.
   * @param id - El id que viene en la URL (/api/courts/futbol-5 → 'futbol-5').
   * @returns Un mensaje con el id pedido.
   */
  @Get(':id')
  findOne(@Param('id') id: string): PlaceholderResponse {
    return this.courtsService.findOne(id);
  }

  /**
   * POST /api/courts — crea una cancha.
   * @param createCourtDto - El body del pedido, ya validado por ValidationPipe.
   * @returns Un mensaje con los datos recibidos (responde 201).
   */
  @Post()
  create(
    @Body() createCourtDto: CreateCourtDto
  ): PlaceholderResponse<CreateCourtDto> {
    return this.courtsService.create(createCourtDto);
  }

  /**
   * PATCH /api/courts/:id — edita una cancha.
   * @param id - El id que viene en la URL.
   * @param updateCourtDto - Solo los campos que cambian.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourtDto: UpdateCourtDto
  ): PlaceholderResponse<UpdateCourtDto> {
    return this.courtsService.update(id, updateCourtDto);
  }

  /**
   * DELETE /api/courts/:id — borra una cancha.
   * @param id - El id que viene en la URL.
   * @returns Un mensaje con el id pedido.
   */
  @Delete(':id')
  remove(@Param('id') id: string): PlaceholderResponse {
    return this.courtsService.remove(id);
  }
}
