import { Test, TestingModule } from '@nestjs/testing';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { EnrollmentsService } from './enrollments.service.js';

// QUÉ ES: los tests unitarios de EnrollmentsService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_ENROLLMENT: CreateEnrollmentDto = {
  personId: 3,
  planId: 'familiar',
  createdBy: 1,
  procedureDate: '2026-11-07',
};

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentsService],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_ENROLLMENT).data).toEqual(NEW_ENROLLMENT);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne(1).id).toBe(1);
  });

  it('update devuelve el id y los cambios', () => {
    expect(service.update(1, { status: 'anulada' })).toMatchObject({
      id: 1,
      data: { status: 'anulada' },
    });
  });
});
