import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

// QUÉ ES: los tests unitarios de PaymentsController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('PaymentsController', () => {
  let controller: PaymentsController;
  // Un PaymentsService falso: el controller no tiene lógica propia que probar.
  const paymentsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: paymentsService }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('findOne le pasa el id de la URL al service', () => {
    paymentsService.findOne.mockReturnValue({ id: 1 });
    expect(controller.findOne(1)).toEqual({ id: 1 });
    expect(paymentsService.findOne).toHaveBeenCalledWith(1);
  });
});
