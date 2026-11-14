import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller.js';
import { PlansService } from './plans.service.js';

// QUÉ ES: los tests unitarios de PlansController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('PlansController', () => {
  let controller: PlansController;
  // Un PlansService falso: el controller no tiene lógica propia que probar.
  const plansService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [{ provide: PlansService, useValue: plansService }],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('findOne le pasa el id de la URL al service', () => {
    plansService.findOne.mockReturnValue({ id: 'familiar' });
    expect(controller.findOne('familiar')).toEqual({ id: 'familiar' });
    expect(plansService.findOne).toHaveBeenCalledWith('familiar');
  });
});
