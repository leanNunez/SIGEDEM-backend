import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller.js';
import { EnrollmentsService } from './enrollments.service.js';

// QUÉ ES: los tests unitarios de EnrollmentsController.
// NIVEL: test — revisa que el controller le pase el trabajo al service.
// DÓNDE SE USA: los corre npm test.

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  // Un EnrollmentsService falso: el controller no tiene lógica propia que probar.
  const enrollmentsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        { provide: EnrollmentsService, useValue: enrollmentsService },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
  });

  it('findOne le pasa el id de la URL al service', () => {
    enrollmentsService.findOne.mockReturnValue({ id: 1 });
    expect(controller.findOne(1)).toEqual({ id: 1 });
    expect(enrollmentsService.findOne).toHaveBeenCalledWith(1);
  });
});
