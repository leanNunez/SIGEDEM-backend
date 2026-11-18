import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import type { BookingWithRenter, Renter } from './entities/booking.entity.js';

// QUÉ ES: el servicio de reservas: listar, buscar, reservar, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: BookingsController lo recibe por inyección de dependencias.
// A FUTURO: calcular el precio según la cancha y si es socio, no dejar
// reservar turnos que ya pasaron, y una ruta propia para editar los datos de
// un renter (por ejemplo, PATCH /api/renters/:id).

// Los errores de la base (turno ya reservado, cancha inexistente) no se manejan
// acá: los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// El body sigue trayendo fullName, dni y phone, pero en la base esos datos van
// en la tabla renters (uno por DNI) y la reserva solo guarda renter_id.
// Como todas las reservas de un DNI apuntan a la misma fila, una reserva nunca
// cambia el nombre ni el teléfono del renter: si los cambiara, también
// cambiarían en todas sus reservas anteriores.

// Las fechas llegan en el body como texto ('2026-11-05'), pero Prisma necesita
// un Date para una columna DATE: por eso se convierten con new Date(...).

// Le pide a Prisma que traiga la fila de renters junto con cada reserva.
const WITH_RENTER = { renter: true } as const;

// Los datos de quien alquila, tal como llegan en el body.
type RenterData = Pick<Renter, 'dni' | 'fullName' | 'phone'>;

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class BookingsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las reservas, ordenadas por fecha y hora.
   * @returns La lista de reservas con quien alquila (vacía si no hay ninguna).
   */
  findAll(): Promise<BookingWithRenter[]> {
    return this.prisma.booking.findMany({
      orderBy: [{ date: 'asc' }, { hour: 'asc' }],
      include: WITH_RENTER,
    });
  }

  /**
   * Busca una reserva por su id.
   * @param id - El id de la reserva, por ejemplo 1.
   * @returns La reserva encontrada, con quien alquila.
   * @throws NotFoundException si no existe una reserva con ese id.
   */
  async findOne(id: number): Promise<BookingWithRenter> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: WITH_RENTER,
    });
    // findUnique devuelve null si no la encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!booking)
      throw new NotFoundException('No existe una reserva con ese id');
    return booking;
  }

  /**
   * Crea una reserva nueva. Si el DNI ya alquiló antes, reusa su renter tal
   * como está, aunque el body traiga otro nombre o teléfono.
   * @param createBookingDto - Los datos de la reserva que llegaron en el body.
   * @returns La reserva creada, con quien alquila.
   */
  create(createBookingDto: CreateBookingDto): Promise<BookingWithRenter> {
    const { fullName, dni, phone, date, ...data } = createBookingDto;
    // $transaction hace las dos escrituras juntas: si la reserva falla (por
    // ejemplo, el turno ya está tomado), tampoco queda guardado el renter.
    return this.prisma.$transaction(async (tx) => {
      const renter = await this.findOrCreateRenter(tx, {
        dni,
        fullName,
        phone,
      });
      return tx.booking.create({
        data: { ...data, date: new Date(date), renterId: renter.id },
        include: WITH_RENTER,
      });
    });
  }

  /**
   * Edita los campos que llegaron de una reserva existente.
   * @param id - El id de la reserva a editar.
   * @param updateBookingDto - Solo los campos que cambian.
   * @returns La reserva ya editada, con quien alquila.
   * @throws NotFoundException si no existe una reserva con ese id.
   * @throws BadRequestException si los datos de quien alquila no son válidos
   * (ver resolveRenter).
   */
  async update(
    id: number,
    updateBookingDto: UpdateBookingDto
  ): Promise<BookingWithRenter> {
    const booking = await this.findOne(id);
    const { fullName, dni, phone, date, ...data } = updateBookingDto;
    const renterData = this.resolveRenter(booking.renter, {
      fullName,
      dni,
      phone,
    });
    return this.prisma.$transaction(async (tx) => {
      const renter = await this.findOrCreateRenter(tx, renterData);
      return tx.booking.update({
        where: { id },
        // Si no vino la fecha, queda undefined y Prisma no toca la columna.
        data: {
          ...data,
          date: date ? new Date(date) : undefined,
          renterId: renter.id,
        },
        include: WITH_RENTER,
      });
    });
  }

  /**
   * Borra (cancela) una reserva. El renter queda guardado para otras reservas.
   * @param id - El id de la reserva a borrar.
   * @returns La reserva borrada, con quien alquila.
   * @throws NotFoundException si no existe una reserva con ese id.
   */
  async remove(id: number): Promise<BookingWithRenter> {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id }, include: WITH_RENTER });
  }

  /**
   * Busca a quien alquila por su DNI y, si no existe, lo crea.
   * @param tx - El cliente de Prisma de la transacción en curso.
   * @param renter - El DNI, el nombre y el teléfono.
   * @returns La fila de renters, con su id.
   */
  private findOrCreateRenter(
    tx: Prisma.TransactionClient,
    renter: RenterData
  ): Promise<Renter> {
    // upsert: si el DNI no está, usa create; si ya está, aplica update.
    // update vacío deja la fila existente como estaba (ver la nota de arriba).
    return tx.renter.upsert({
      where: { dni: renter.dni },
      create: renter,
      update: {},
    });
  }

  /**
   * Decide quién alquila la reserva después de editarla. Cambiar el DNI pasa
   * la reserva a otra persona; sin cambiar el DNI, sigue la misma, sin tocar
   * sus datos.
   * @param current - Quien alquila hoy la reserva.
   * @param changes - fullName, dni y phone del body (pueden no venir).
   * @returns El DNI, el nombre y el teléfono de quien alquila después del cambio.
   * @throws BadRequestException si cambia el DNI sin mandar fullName y phone,
   * o si cambia el nombre o el teléfono sin cambiar el DNI.
   */
  private resolveRenter(
    current: Renter,
    changes: Partial<RenterData>
  ): RenterData {
    const { dni, fullName, phone } = changes;
    if (dni === undefined || dni === current.dni) {
      this.checkRenterUnchanged(current, changes);
      return {
        dni: current.dni,
        fullName: current.fullName,
        phone: current.phone,
      };
    }
    // Un DNI nuevo es otra persona: no se le pueden copiar el nombre y el
    // teléfono de la anterior.
    if (!fullName || !phone) {
      throw new BadRequestException(
        'Para cambiar el DNI hay que mandar también fullName y phone'
      );
    }
    return { dni, fullName, phone };
  }

  /**
   * Revisa que el body no intente cambiar el nombre o el teléfono de quien
   * alquila. Ese cambio afectaría a todas sus reservas, así que no se hace
   * desde una reserva.
   * @param current - Quien alquila hoy la reserva.
   * @param changes - fullName y phone del body (pueden no venir).
   * @throws BadRequestException si llega un nombre o un teléfono distinto.
   */
  private checkRenterUnchanged(
    current: Renter,
    changes: Partial<RenterData>
  ): void {
    const isNewName =
      changes.fullName !== undefined && changes.fullName !== current.fullName;
    const isNewPhone =
      changes.phone !== undefined && changes.phone !== current.phone;
    if (isNewName || isNewPhone) {
      throw new BadRequestException(
        'El nombre y el teléfono de quien alquila no se cambian desde una reserva'
      );
    }
  }
}
