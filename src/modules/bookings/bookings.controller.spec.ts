import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';

// QUÉ ES: los tests unitarios de BookingsController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('BookingsController', () => {
  let controller: BookingsController;
  // Un BookingsService falso: el controller no tiene lógica propia que probar.
  const bookingsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: bookingsService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('findOne le pasa el id de la URL al service', () => {
    bookingsService.findOne.mockReturnValue({ id: 1 });
    expect(controller.findOne(1)).toEqual({ id: 1 });
    expect(bookingsService.findOne).toHaveBeenCalledWith(1);
  });
});
