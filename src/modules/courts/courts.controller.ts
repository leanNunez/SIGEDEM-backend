import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourtsService } from './courts.service.js';
import { CreateCourtDto } from './dto/create-court.dto.js';
import { UpdateCourtDto } from './dto/update-court.dto.js';
import { Court } from './entities/court.entity.js';

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
   * @returns Las canchas.
   */
  @Get()
  findAll(): Promise<Court[]> {
    return this.courtsService.findAll();
  }

  /**
   * GET /api/courts/:id — devuelve una cancha.
   * @param id - El id que viene en la URL (/api/courts/futbol-5 → 'futbol-5').
   * @returns La cancha encontrada.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Court> {
    return this.courtsService.findOne(id);
  }

  /**
   * POST /api/courts — crea una cancha.
   * @param createCourtDto - El body del pedido, ya validado por ValidationPipe.
   * @returns La cancha creada (responde 201).
   */
  @Post()
  create(@Body() createCourtDto: CreateCourtDto): Promise<Court> {
    return this.courtsService.create(createCourtDto);
  }

  /**
   * PATCH /api/courts/:id — edita una cancha.
   * @param id - El id que viene en la URL.
   * @param updateCourtDto - Solo los campos que cambian.
   * @returns La cancha editada.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourtDto: UpdateCourtDto
  ): Promise<Court> {
    return this.courtsService.update(id, updateCourtDto);
  }

  /**
   * DELETE /api/courts/:id — borra una cancha.
   * Si la cancha tiene reservas, la base no deja borrarla (409).
   * @param id - El id que viene en la URL.
   * @returns La cancha borrada.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Court> {
    return this.courtsService.remove(id);
  }
}
