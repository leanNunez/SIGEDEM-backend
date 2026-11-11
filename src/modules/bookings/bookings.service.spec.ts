import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingsService } from './bookings.service.js';

// QUÉ ES: los tests unitarios de BookingsService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_BOOKING: CreateBookingDto = {
  courtId: 'futbol-7',
  date: '2026-11-20',
  hour: 19,
  fullName: 'Pedro Ledesma',
  dni: '29123456',
  phone: '381 555-0201',
  price: 36000,
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_BOOKING).data).toEqual(NEW_BOOKING);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne(1).id).toBe(1);
  });

  it('update devuelve el id y los cambios', () => {
    expect(service.update(1, { hour: 20 })).toMatchObject({
      id: 1,
      data: { hour: 20 },
    });
  });
});
