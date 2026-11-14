import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { Payment } from './entities/payment.entity.js';
import { PaymentsService } from './payments.service.js';

// QUÉ ES: las rutas de pagos (/api/payments).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra PaymentsModule.

// @Controller('payments') hace que todas estas rutas empiecen con /api/payments
// (el /api lo agrega setupApp para toda la app).
@Controller('payments')
export class PaymentsController {
  // Nest crea PaymentsService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * GET /api/payments — lista todos los pagos.
   * @returns Los pagos.
   */
  @Get()
  findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  /**
   * GET /api/payments/:id — devuelve un pago.
   * @param id - El id que viene en la URL (/api/payments/1 → 1).
   * @returns El pago encontrado.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  /**
   * POST /api/payments — registra un pago.
   * @param createPaymentDto - El body del pedido, ya validado por ValidationPipe.
   * @returns El pago creado (responde 201).
   */
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  /**
   * PATCH /api/payments/:id — edita un pago.
   * @param id - El id que viene en la URL.
   * @param updatePaymentDto - Solo los campos que cambian.
   * @returns El pago editado.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  /**
   * DELETE /api/payments/:id — borra un pago.
   * @param id - El id que viene en la URL.
   * @returns El pago borrado.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.remove(id);
  }
}
