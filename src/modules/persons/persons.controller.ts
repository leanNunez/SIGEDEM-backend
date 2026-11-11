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
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { Person } from './entities/person.entity.js';
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
   * @returns Las personas.
   */
  @Get()
  findAll(): Promise<Person[]> {
    return this.personsService.findAll();
  }

  /**
   * GET /api/persons/:id — devuelve una persona.
   * @param id - El id que viene en la URL (/api/persons/1 → 1).
   * @returns La persona encontrada.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personsService.findOne(id);
  }

  /**
   * POST /api/persons — crea una persona.
   * @param createPersonDto - El body del pedido, ya validado por ValidationPipe.
   * @returns La persona creada (responde 201).
   */
  @Post()
  create(@Body() createPersonDto: CreatePersonDto): Promise<Person> {
    return this.personsService.create(createPersonDto);
  }

  /**
   * PATCH /api/persons/:id — edita una persona.
   * @param id - El id que viene en la URL.
   * @param updatePersonDto - Solo los campos que cambian.
   * @returns La persona editada.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto
  ): Promise<Person> {
    return this.personsService.update(id, updatePersonDto);
  }

  /**
   * DELETE /api/persons/:id — borra una persona.
   * Si la persona tiene inscripciones, aptos o abonos, la base no deja borrarla (409).
   * @param id - El id que viene en la URL.
   * @returns La persona borrada.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personsService.remove(id);
  }
}
