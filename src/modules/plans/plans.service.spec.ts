import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { PlansService } from './plans.service.js';

// QUÉ ES: los tests unitarios de PlansService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_PLAN: CreatePlanDto = {
  id: 'natacion-verano',
  name: 'Natación verano',
  type: 'individual',
  people: '1 persona',
  description: 'Plan de prueba para la temporada de verano.',
};

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlansService],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_PLAN).data).toEqual(NEW_PLAN);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne('familiar').id).toBe('familiar');
  });

  it('update devuelve el id y los cambios', () => {
    expect(service.update('familiar', { badge: 'Nuevo' })).toMatchObject({
      id: 'familiar',
      data: { badge: 'Nuevo' },
    });
  });
});
