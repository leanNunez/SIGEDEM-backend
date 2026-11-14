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
import type { PlaceholderResponse } from '../../shared/types/placeholder-response.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

// QUÉ ES: las rutas de reservas de canchas (/api/bookings).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra BookingsModule.

// @Controller('bookings') hace que todas estas rutas empiecen con /api/bookings
// (el /api lo agrega setupApp para toda la app).
@Controller('bookings')
export class BookingsController {
  // Nest crea BookingsService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * GET /api/bookings — lista todas las reservas.
   * @returns Un mensaje provisorio (en el TP 11, la lista de las reservas).
   */
  @Get()
  findAll(): PlaceholderResponse {
    return this.bookingsService.findAll();
  }

  /**
   * GET /api/bookings/:id — devuelve una reserva.
   * @param id - El id que viene en la URL (/api/bookings/1 → 1).
   * @returns Un mensaje con el id pedido.
   */
  @Get(':id')
  // ParseIntPipe convierte "1" en 1 y responde 400 si no es un número.
  findOne(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.bookingsService.findOne(id);
  }

  /**
   * POST /api/bookings — crea una reserva.
   * @param createBookingDto - El body del pedido, ya validado por ValidationPipe.
   * @returns Un mensaje con los datos recibidos (responde 201).
   */
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto
  ): PlaceholderResponse<CreateBookingDto> {
    return this.bookingsService.create(createBookingDto);
  }

  /**
   * PATCH /api/bookings/:id — edita una reserva.
   * @param id - El id que viene en la URL.
   * @param updateBookingDto - Solo los campos que cambian.
   * @returns Un mensaje con el id y los cambios recibidos.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto
  ): PlaceholderResponse<UpdateBookingDto> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  /**
   * DELETE /api/bookings/:id — borra (cancela) una reserva.
   * @param id - El id que viene en la URL.
   * @returns Un mensaje con el id pedido.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): PlaceholderResponse {
    return this.bookingsService.remove(id);
  }
}
