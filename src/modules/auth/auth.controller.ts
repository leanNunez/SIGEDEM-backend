import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PublicUser } from '../users/entities/user.entity.js';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

// QUÉ ES: las rutas de autenticación (/api/auth).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra AuthModule.

@Controller('auth')
export class AuthController {
  // Nest crea AuthService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register — registra un usuario nuevo.
   * Es la única ruta para crear usuarios (POST /api/users ya no existe).
   * Si el mail ya está registrado responde 409, y si falta un dato, 400.
   * @param createUserDto - El body del pedido, ya validado por ValidationPipe.
   * @returns El usuario creado, sin la contraseña (responde 201).
   */
  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.authService.register(createUserDto);
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
