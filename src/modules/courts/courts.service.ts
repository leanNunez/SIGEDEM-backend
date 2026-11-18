import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateCourtDto } from './dto/create-court.dto.js';
import { UpdateCourtDto } from './dto/update-court.dto.js';
import { Court } from './entities/court.entity.js';

// QUÉ ES: el servicio de canchas: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: CourtsController lo recibe por inyección de dependencias.

// Los errores de la base (id o nombre repetido, cancha en uso) no se manejan
// acá: los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class CourtsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las canchas, ordenadas por nombre.
   * @returns La lista de canchas (vacía si no hay ninguna).
   */
  findAll(): Promise<Court[]> {
    return this.prisma.court.findMany({ orderBy: { name: 'asc' } });
  }

  /**
   * Busca una cancha por su id.
   * @param id - El id de la cancha, por ejemplo 'futbol-5'.
   * @returns La cancha encontrada.
   * @throws NotFoundException si no existe una cancha con ese id.
   */
  async findOne(id: string): Promise<Court> {
    const court = await this.prisma.court.findUnique({ where: { id } });
    // findUnique devuelve null si no la encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!court) throw new NotFoundException('No existe una cancha con ese id');
    return court;
  }

  /**
   * Crea una cancha nueva.
   * @param createCourtDto - Los datos de la cancha que llegaron en el body.
   * @returns La cancha creada.
   * @throws BadRequestException si el precio para el público es menor que el de socios.
   */
  async create(createCourtDto: CreateCourtDto): Promise<Court> {
    this.checkPrices(createCourtDto.memberPrice, createCourtDto.publicPrice);
    return this.prisma.court.create({ data: createCourtDto });
  }

  /**
   * Edita los campos que llegaron de una cancha existente.
   * @param id - El id de la cancha a editar.
   * @param updateCourtDto - Solo los campos que cambian.
   * @returns La cancha ya editada.
   * @throws NotFoundException si no existe una cancha con ese id.
   * @throws BadRequestException si el precio para el público queda menor que el de socios.
   */
  async update(id: string, updateCourtDto: UpdateCourtDto): Promise<Court> {
    const court = await this.findOne(id);
    // Si llega uno solo de los precios, se compara con el otro que ya estaba
    // guardado. toNumber() pasa el Decimal de Prisma a un número común.
    this.checkPrices(
      updateCourtDto.memberPrice ?? court.memberPrice.toNumber(),
      updateCourtDto.publicPrice ?? court.publicPrice.toNumber()
    );
    return this.prisma.court.update({ where: { id }, data: updateCourtDto });
  }

  /**
   * Borra una cancha.
   * Si la cancha tiene reservas, la base no deja borrarla (409).
   * @param id - El id de la cancha a borrar.
   * @returns La cancha borrada.
   * @throws NotFoundException si no existe una cancha con ese id.
   */
  async remove(id: string): Promise<Court> {
    await this.findOne(id);
    return this.prisma.court.delete({ where: { id } });
  }

  /**
   * Revisa la misma regla que el CHECK (public_price >= member_price) de la
   * tabla, para responder 400 con un mensaje claro en vez de un error de la base.
   * @param memberPrice - El precio para socios.
   * @param publicPrice - El precio para el público.
   * @throws BadRequestException si el precio para el público es menor que el de socios.
   */
  private checkPrices(memberPrice: number, publicPrice: number): void {
    if (publicPrice >= memberPrice) return;
    throw new BadRequestException(
      'El precio para el público no puede ser menor que el precio para socios'
    );
  }
}
