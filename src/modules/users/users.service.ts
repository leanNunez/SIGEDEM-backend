import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PublicUser } from './entities/user.entity.js';

// QUÉ ES: el servicio de usuarios: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: UsersController lo recibe por inyección de dependencias.
// A FUTURO: el login (AuthModule) va a comparar la contraseña con este hash.

// Los errores de la base (email repetido, usuario en uso) no se manejan acá:
// los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// omit le pide a Prisma que no traiga esa columna. Se usa en todas las
// consultas para que el hash de la contraseña nunca salga en una respuesta.
const WITHOUT_PASSWORD_HASH = { passwordHash: true } as const;

// Bytes al azar de la "sal": hace que dos contraseñas iguales den hashes distintos.
const SALT_BYTES = 16;
// Largo en bytes del hash que devuelve scrypt.
const HASH_BYTES = 64;

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class UsersService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los usuarios, ordenados por nombre.
   * @returns La lista de usuarios, sin el hash de la contraseña.
   */
  findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      omit: WITHOUT_PASSWORD_HASH,
      orderBy: { fullName: 'asc' },
    });
  }

  /**
   * Busca un usuario por su id.
   * @param id - El id del usuario, por ejemplo 1.
   * @returns El usuario encontrado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async findOne(id: number): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: WITHOUT_PASSWORD_HASH,
    });
    // findUnique devuelve null si no lo encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!user) throw new NotFoundException('No existe un usuario con ese id');
    return user;
  }

  /**
   * Crea un usuario nuevo y guarda su contraseña hasheada.
   * @param createUserDto - Los datos del usuario que llegaron en el body.
   * @returns El usuario creado, sin el hash de la contraseña.
   */
  create(createUserDto: CreateUserDto): Promise<PublicUser> {
    // Se separa password del resto: la tabla no tiene esa columna.
    const { password, ...data } = createUserDto;
    return this.prisma.user.create({
      data: { ...data, passwordHash: this.hashPassword(password) },
      omit: WITHOUT_PASSWORD_HASH,
    });
  }

  /**
   * Edita los campos que llegaron de un usuario existente.
   * Si llega una contraseña nueva, se guarda hasheada.
   * @param id - El id del usuario a editar.
   * @param updateUserDto - Solo los campos que cambian.
   * @returns El usuario ya editado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    await this.findOne(id);
    const { password, ...data } = updateUserDto;
    // Si no vino password, passwordHash queda undefined y Prisma no toca la columna.
    const passwordHash = password ? this.hashPassword(password) : undefined;
    return this.prisma.user.update({
      where: { id },
      data: { ...data, passwordHash },
      omit: WITHOUT_PASSWORD_HASH,
    });
  }

  /**
   * Borra un usuario.
   * Si el usuario cargó inscripciones o verificó pagos, la base no deja borrarlo (409).
   * @param id - El id del usuario a borrar.
   * @returns El usuario borrado, sin el hash de la contraseña.
   * @throws NotFoundException si no existe un usuario con ese id.
   */
  async remove(id: number): Promise<PublicUser> {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
      omit: WITHOUT_PASSWORD_HASH,
    });
  }

  /**
   * Convierte una contraseña en un hash que se puede guardar en la base.
   * scrypt es un algoritmo lento a propósito: adivinar contraseñas por fuerza
   * bruta lleva mucho tiempo. Se guarda la sal junto al hash para poder
   * comparar en el login.
   * @param password - La contraseña en texto plano.
   * @returns El texto 'sal:hash', los dos en hexadecimal.
   */
  private hashPassword(password: string): string {
    const salt = randomBytes(SALT_BYTES).toString('hex');
    const hash = scryptSync(password, salt, HASH_BYTES).toString('hex');
    return `${salt}:${hash}`;
  }
}
