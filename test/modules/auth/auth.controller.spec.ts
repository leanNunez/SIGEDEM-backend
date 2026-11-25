import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/modules/auth/auth.controller.js';
import { AuthService } from '../../../src/modules/auth/auth.service.js';

// QUÉ ES: los tests unitarios de AuthController.
// NIVEL: test — prueba el controller con un AuthService falso.
// DÓNDE SE USA: los corre npm test.

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      // El controller no se prueba contra la base: alcanza con un service vacío.
      providers: [{ provide: AuthService, useValue: {} }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
