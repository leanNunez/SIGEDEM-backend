import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller.js';
import { PersonsService } from './persons.service.js';

// QUÉ ES: los tests unitarios de PersonsController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('PersonsController', () => {
  let controller: PersonsController;
  // Un PersonsService falso: el controller no tiene lógica propia que probar.
  const personsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [{ provide: PersonsService, useValue: personsService }],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
  });

  it('findOne le pasa el id de la URL al service', async () => {
    personsService.findOne.mockResolvedValue({ id: 1 });
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(personsService.findOne).toHaveBeenCalledWith(1);
  });
});
