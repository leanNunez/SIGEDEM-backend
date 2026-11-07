import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

// QUÉ ES: los tests unitarios de UsersController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('UsersController', () => {
  let controller: UsersController;
  // Un UsersService falso: el controller no tiene lógica propia que probar.
  const usersService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('findOne le pasa el id de la URL al service', async () => {
    usersService.findOne.mockResolvedValue({ id: 1 });
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(usersService.findOne).toHaveBeenCalledWith(1);
  });
});
