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
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { UpdatePlanDto } from './dto/update-plan.dto.js';
import { PlansService } from './plans.service.js';

// QUÉ ES: las rutas de planes (/api/plans).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra PlansModule.

// @Controller('plans') hace que todas estas rutas empiecen con /api/plans
// (el /api lo agrega setupApp para toda la app).
@Controller('plans')
export class PlansController {
  // Nest crea PlansService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly plansService: PlansService) {}

  /**
   * GET /api/plans — lista todos los planes.
   * @returns Un mensaje provisorio (en el TP 11, la lista de los planes).
   */
  @Get()
  findAll(): PlaceholderResponse {
    return this.plansService.findAll();
  }

  /**
   * GET /api/plans/:id — devuelve un plan.
   * @param id - El id que viene en la URL (/api/plans/familiar → 'familiar').
   * @returns Un mensaje con el id pedido.
   */
  @Get(':id')
  findOne(@Param('id') id: string): PlaceholderResponse {
    return this.plansService.findOne(id);
  }

  /**
   * POST /api/plans — crea un plan.
   * @param createPlanDto - El body del pedido, ya validado por ValidationPipe.
   * @returns Un mensaje con los datos recibidos (responde 201).
   */
  @Post()
  create(
    @Body() createPlanDto: CreatePlanDto
  ): PlaceholderResponse<CreatePlanDto> {
    return this.plansService.create(createPlanDto);
  }

  /**
   * PATCH /api/plans/:id — edita un plan.
   * @param id - El id que viene en la URL.
   * @param updatePlanDto - Solo los campos que cambian.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto
  ): PlaceholderResponse<UpdatePlanDto> {
    return this.plansService.update(id, updatePlanDto);
  }

  /**
   * DELETE /api/plans/:id — borra un plan.
   * @param id - El id que viene en la URL.
   * @returns Un mensaje con el id pedido.
   */
  @Delete(':id')
  remove(@Param('id') id: string): PlaceholderResponse {
    return this.plansService.remove(id);
  }
}
