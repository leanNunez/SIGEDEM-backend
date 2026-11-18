import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { Payment } from './entities/payment.entity.js';

// QUÉ ES: el servicio de pagos: listar, buscar, registrar, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PaymentsController lo recibe por inyección de dependencias.
// A FUTURO: al acreditar un pago habría que crear el abono de la inscripción.

// Los errores de la base (comprobante repetido, FK inexistente) no se manejan
// acá: los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// Las fechas llegan en el body como texto ('2026-10-01'), pero Prisma necesita
// un Date para una columna DATE: por eso se convierten con new Date(...).

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PaymentsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los pagos, del más nuevo al más viejo.
   * @returns La lista de pagos (vacía si no hay ninguno).
   */
  findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany({ orderBy: { id: 'desc' } });
  }

  /**
   * Busca un pago por su id.
   * @param id - El id del pago, por ejemplo 1.
   * @returns El pago encontrado.
   * @throws NotFoundException si no existe un pago con ese id.
   */
  async findOne(id: number): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    // findUnique devuelve null si no lo encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!payment) throw new NotFoundException('No existe un pago con ese id');
    return payment;
  }

  /**
   * Registra un pago nuevo.
   * @param createPaymentDto - Los datos del pago que llegaron en el body.
   * @returns El pago creado.
   */
  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { paidOn, ...data } = createPaymentDto;
    return this.prisma.payment.create({
      data: { ...data, paidOn: new Date(paidOn) },
    });
  }

  /**
   * Edita los campos que llegaron de un pago existente.
   * @param id - El id del pago a editar.
   * @param updatePaymentDto - Solo los campos que cambian.
   * @returns El pago ya editado.
   * @throws NotFoundException si no existe un pago con ese id.
   */
  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    await this.findOne(id);
    const { paidOn, ...data } = updatePaymentDto;
    return this.prisma.payment.update({
      where: { id },
      // Si no vino la fecha, queda undefined y Prisma no toca la columna.
      data: { ...data, paidOn: paidOn ? new Date(paidOn) : undefined },
    });
  }

  /**
   * Borra un pago.
   * @param id - El id del pago a borrar.
   * @returns El pago borrado.
   * @throws NotFoundException si no existe un pago con ese id.
   */
  async remove(id: number): Promise<Payment> {
    await this.findOne(id);
    return this.prisma.payment.delete({ where: { id } });
  }
}
