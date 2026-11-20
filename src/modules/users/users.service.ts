import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PublicUser, User } from './entities/user.entity.js';

// QUÉ ES: el servicio de usuarios: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: UsersController y AuthService (registro y login).

// Los errores de la base (mail repetido, rol que no existe) no se manejan acá:
// los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// Cuántas vueltas da bcrypt al calcular el hash (2^10). Más vueltas es más
// seguro pero más lento; 10 es el valor recomendado por la librería.
const SALT_ROUNDS = 10;

// Se le pasa a Prisma en cada consulta para que no traiga el hash de la
// contraseña: así nunca puede salir por la API por error.
const WITHOUT_PASSWORD = { passwordHash: true } as const;

@Injectable()
export class UsersService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los usuarios, ordenados por id, sin el hash de la contraseña.
   * @returns La lista de usuarios (vacía si no hay ninguno).
   */
  findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      omit: WITHOUT_PASSWORD,
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Busca un usuario por su id.
   * @param id - El id del usuario.
   * @returns El usuario encontrado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async findOne(id: number): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: WITHOUT_PASSWORD,
    });
    if (!user) throw new NotFoundException('No existe un usuario con ese id');
    return user;
  }

  /**
   * Busca un usuario por su mail, CON el hash de la contraseña.
   * Es la única función que trae el hash: la usa el login para compararlo
   * con bcrypt.compare. Nunca hay que devolver su resultado por la API.
   * @param email - El mail con el que se registró.
   * @returns El usuario, o null si no hay ninguno con ese mail.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Crea un usuario y guarda su contraseña hasheada.
   * @param createUserDto - Los datos del usuario, con la contraseña en texto plano.
   * @returns El usuario creado, sin el hash de la contraseña.
   */
  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    // La contraseña se separa del resto: a la tabla va solo su hash.
    const { password, ...data } = createUserDto;
    return this.prisma.user.create({
      data: { ...data, passwordHash: await this.hashPassword(password) },
      omit: WITHOUT_PASSWORD,
    });
  }

  /**
   * Edita los campos que llegaron de un usuario existente.
   * Si llega una contraseña nueva, se guarda hasheada.
   * @param id - El id del usuario a editar.
   * @param updateUserDto - Solo los campos que cambian.
   * @returns El usuario editado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    await this.findOne(id);
    const { password, ...data } = updateUserDto;
    // Si no mandaron contraseña, passwordHash queda undefined y Prisma no la toca.
    const passwordHash = password
      ? await this.hashPassword(password)
      : undefined;
    return this.prisma.user.update({
      where: { id },
      data: { ...data, passwordHash },
      omit: WITHOUT_PASSWORD,
    });
  }

  /**
   * Borra un usuario.
   * Si el usuario ya cargó inscripciones, aptos o pagos, la base no deja borrarlo (409).
   * @param id - El id del usuario a borrar.
   * @returns El usuario borrado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async remove(id: number): Promise<PublicUser> {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id }, omit: WITHOUT_PASSWORD });
  }

  /**
   * Calcula el hash de una contraseña con bcrypt.
   * bcrypt le agrega una "sal" al azar: la misma contraseña da un hash distinto
   * cada vez, y no hay forma de volver del hash a la contraseña.
   * @param password - La contraseña en texto plano.
   * @returns El hash, listo para guardar en la columna password_hash.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
}
