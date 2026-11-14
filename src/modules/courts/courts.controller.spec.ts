import { Test, TestingModule } from '@nestjs/testing';
import { CourtsController } from './courts.controller.js';
import { CourtsService } from './courts.service.js';

// QUÉ ES: los tests unitarios de CourtsController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('CourtsController', () => {
  let controller: CourtsController;
  // Un CourtsService falso: el controller no tiene lógica propia que probar.
  const courtsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtsController],
      providers: [{ provide: CourtsService, useValue: courtsService }],
    }).compile();

    controller = module.get<CourtsController>(CourtsController);
  });

  it('findOne le pasa el id de la URL al service', () => {
    courtsService.findOne.mockReturnValue({ id: 'futbol-5' });
    expect(controller.findOne('futbol-5')).toEqual({ id: 'futbol-5' });
    expect(courtsService.findOne).toHaveBeenCalledWith('futbol-5');
  });
});
