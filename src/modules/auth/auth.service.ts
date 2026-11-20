import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { PublicUser } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

// QUÉ ES: el servicio de autenticación: registro de usuarios (y, a futuro, login).
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: AuthController lo recibe por inyección de dependencias.
// A FUTURO: login con bcrypt.compare y JwtService (segunda parte del TP 12).

@Injectable()
export class AuthService {
  // UsersService llega desde UsersModule, que lo exporta.
  constructor(private readonly usersService: UsersService) {}

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

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
