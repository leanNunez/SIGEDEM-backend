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
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PublicUser } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

// QUÉ ES: las rutas de usuarios (/api/users).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra UsersModule.

// @Controller('users') hace que todas estas rutas empiecen con /api/users
// (el /api lo agrega setupApp para toda la app).
@Controller('users')
export class UsersController {
  // Nest crea UsersService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users — lista todos los usuarios.
   * @returns Los usuarios, sin el hash de la contraseña.
   */
  @Get()
  findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /api/users/:id — devuelve un usuario.
   * @param id - El id que viene en la URL (/api/users/1 → 1).
   * @returns El usuario encontrado.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return this.usersService.findOne(id);
  }

  /**
   * POST /api/users — crea un usuario.
   * @param createUserDto - El body del pedido, ya validado por ValidationPipe.
   * @returns El usuario creado (responde 201).
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create(createUserDto);
  }

  /**
   * PATCH /api/users/:id — edita un usuario.
   * @param id - El id que viene en la URL.
   * @param updateUserDto - Solo los campos que cambian.
   * @returns El usuario editado.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<PublicUser> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /api/users/:id — borra un usuario.
   * Si el usuario cargó inscripciones o verificó pagos, la base no deja borrarlo (409).
   * @param id - El id que viene en la URL.
   * @returns El usuario borrado.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return this.usersService.remove(id);
  }
}
