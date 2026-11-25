import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/modules/users/users.controller.js';
import { UsersService } from '../../../src/modules/users/users.service.js';

// QUÉ ES: los tests unitarios de UsersController.
// NIVEL: test — prueba el controller con un UsersService falso.
// DÓNDE SE USA: los corre npm test.

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      // El controller no se prueba contra la base: alcanza con un service vacío.
      providers: [{ provide: UsersService, useValue: {} }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ya no tiene POST: los usuarios se crean con /api/auth/register', () => {
    // 'in' también mira los métodos de la clase (están en el prototipo).
    expect('create' in controller).toBe(false);
    expect('findAll' in controller).toBe(true);
  });
});
