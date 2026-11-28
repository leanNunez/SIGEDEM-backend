import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from '../../../src/modules/plans/plans.controller.js';
import { PlansService } from '../../../src/modules/plans/plans.service.js';

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

  // Acá se llama al método directo, sin pasar por HTTP: el id ya llega como
  // número (en la API real lo convierte ParseIntPipe; eso lo prueba el e2e).
  it('findOne le pasa el id de la URL al service', async () => {
    plansService.findOne.mockResolvedValue({ id: 2 });
    await expect(controller.findOne(2)).resolves.toEqual({ id: 2 });
    expect(plansService.findOne).toHaveBeenCalledWith(2);
  });
});
