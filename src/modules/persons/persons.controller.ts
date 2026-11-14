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
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { PersonsService } from './persons.service.js';

// QUÉ ES: las rutas de personas (/api/persons).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra PersonsModule.

// @Controller('persons') hace que todas estas rutas empiecen con /api/persons
// (el /api lo agrega setupApp para toda la app).
@Controller('persons')
export class PersonsController {
  // Nest crea PersonsService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly personsService: PersonsService) {}

  /**
   * GET /api/persons — lista todas las personas.
   * @returns Un mensaje provisorio (en el TP 11, la lista de las personas).
   */
  @Get()
  findAll(): PlaceholderResponse {
    return this.personsService.findAll();
  }

  /**
   * GET /api/persons/:id — devuelve una persona.
   * @param id - El id que viene en la URL (/api/persons/1 → 1).
   * @returns Un mensaje con el id pedido.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.personsService.findOne(id);
  }

  /**
   * POST /api/persons — crea una persona.
   * @param createPersonDto - El body del pedido, ya validado por ValidationPipe.
   * @returns Un mensaje con los datos recibidos (responde 201).
   */
  @Post()
  create(
    @Body() createPersonDto: CreatePersonDto
  ): PlaceholderResponse<CreatePersonDto> {
    return this.personsService.create(createPersonDto);
  }

  /**
   * PATCH /api/persons/:id — edita una persona.
   * @param id - El id que viene en la URL.
   * @param updatePersonDto - Solo los campos que cambian.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto
  ): PlaceholderResponse<UpdatePersonDto> {
    return this.personsService.update(id, updatePersonDto);
  }

  /**
   * DELETE /api/persons/:id — borra una persona.
   * @param id - El id que viene en la URL.
   * @returns Un mensaje con el id pedido.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.personsService.remove(id);
  }
}
