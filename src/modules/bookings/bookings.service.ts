import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { Booking } from './entities/booking.entity.js';

// QUÉ ES: el servicio de reservas: listar, buscar, reservar, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: BookingsController lo recibe por inyección de dependencias.
// A FUTURO: calcular el precio según la cancha y si es socio, y no dejar
// reservar turnos que ya pasaron.

// Los errores de la base (turno ya reservado, cancha inexistente) no se manejan
// acá: los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// Las fechas llegan en el body como texto ('2026-11-05'), pero Prisma necesita
// un Date para una columna DATE: por eso se convierten con new Date(...).

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class BookingsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las reservas, ordenadas por fecha y hora.
   * @returns La lista de reservas (vacía si no hay ninguna).
   */
  findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      orderBy: [{ date: 'asc' }, { hour: 'asc' }],
    });
  }

  /**
   * Busca una reserva por su id.
   * @param id - El id de la reserva, por ejemplo 1.
   * @returns La reserva encontrada.
   * @throws NotFoundException si no existe una reserva con ese id.
   */
  async findOne(id: number): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    // findUnique devuelve null si no la encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!booking)
      throw new NotFoundException('No existe una reserva con ese id');
    return booking;
  }

  /**
   * Crea una reserva nueva.
   * @param createBookingDto - Los datos de la reserva que llegaron en el body.
   * @returns La reserva creada.
   */
  create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { date, ...data } = createBookingDto;
    return this.prisma.booking.create({
      data: { ...data, date: new Date(date) },
    });
  }

  /**
   * Edita los campos que llegaron de una reserva existente.
   * @param id - El id de la reserva a editar.
   * @param updateBookingDto - Solo los campos que cambian.
   * @returns La reserva ya editada.
   * @throws NotFoundException si no existe una reserva con ese id.
   */
  async update(
    id: number,
    updateBookingDto: UpdateBookingDto
  ): Promise<Booking> {
    await this.findOne(id);
    const { date, ...data } = updateBookingDto;
    return this.prisma.booking.update({
      where: { id },
      // Si no vino la fecha, queda undefined y Prisma no toca la columna.
      data: { ...data, date: date ? new Date(date) : undefined },
    });
  }

  /**
   * Borra (cancela) una reserva.
   * @param id - El id de la reserva a borrar.
   * @returns La reserva borrada.
   * @throws NotFoundException si no existe una reserva con ese id.
   */
  async remove(id: number): Promise<Booking> {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}
