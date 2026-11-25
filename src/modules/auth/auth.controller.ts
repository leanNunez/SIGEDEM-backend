import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PublicUser } from '../users/entities/user.entity.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

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

  /**
   * POST /api/auth/login — inicia sesión y devuelve un JWT.
   * Responde 401 si el mail o la contraseña no coinciden.
   * @param loginDto - El mail y la contraseña, ya validados por ValidationPipe.
   * @returns { access_token } con el token (responde 200).
   */
  @Post('login')
  // Un POST responde 201 (creado) por defecto. El login no crea nada en la
  // base, así que @HttpCode lo cambia a 200 (OK).
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
