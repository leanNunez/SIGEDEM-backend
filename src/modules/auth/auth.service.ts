import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PublicUser } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';

// QUÉ ES: el servicio de autenticación: registro e inicio de sesión.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: AuthController lo recibe por inyección de dependencias.

@Injectable()
export class AuthService {
  // UsersService llega desde UsersModule y JwtService desde JwtModule.
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Registra un usuario nuevo.
   * No repite la lógica de usuarios: le pide a UsersService que lo cree,
   * y ese service es el que guarda la contraseña hasheada.
   * @param createUserDto - Los datos del usuario, ya validados por ValidationPipe.
   * @returns El usuario creado, sin el hash de la contraseña.
   */
  register(createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Inicia sesión: revisa el mail y la contraseña y, si están bien, devuelve un JWT.
   * @param loginDto - El mail y la contraseña que llegaron en el body.
   * @returns El token firmado, en { access_token }.
   * @throws UnauthorizedException (401) si el mail no existe, la contraseña
   * no coincide o el usuario está dado de baja.
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    // bcrypt.compare calcula el hash de la contraseña que llegó y lo compara
    // con el guardado. Si el mail no existe, ni se compara.
    const passwordOk =
      user !== null &&
      (await bcrypt.compare(loginDto.password, user.passwordHash));

    // El mismo mensaje para los tres casos: así no se puede averiguar
    // qué mails están registrados.
    if (!user || !passwordOk || !user.isActive) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // El payload es lo que va adentro del token. "sub" (subject) es el
    // nombre estándar para el id del usuario. Nunca va la contraseña.
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
