import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PublicUser } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

// QUÉ ES: las rutas de usuarios (/api/users).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra UsersModule.

// Acá no hay POST: los usuarios se crean solo con POST /api/auth/register
// (TP 12), así no hay dos rutas que hagan lo mismo.
@Controller('users')
export class UsersController {
  // Nest crea UsersService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users — lista todos los usuarios (sin contraseñas).
   * @returns Los usuarios.
   */
  @Get()
  findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /api/users/:id — devuelve un usuario (sin contraseña).
   * @param id - El id que viene en la URL (/api/users/1 → 1).
   * @returns El usuario encontrado.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return this.usersService.findOne(id);
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
   * @param id - El id que viene en la URL.
   * @returns El usuario borrado.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return this.usersService.remove(id);
  }
}
