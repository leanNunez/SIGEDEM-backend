import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCourtDto } from './dto/create-court.dto.js';
import { CourtsService } from './courts.service.js';

// QUÉ ES: los tests unitarios de CourtsService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_COURT: CreateCourtDto = {
  id: 'futbol-9',
  activity: 'futbol',
  name: 'Fútbol 9',
  detail: 'Cancha de prueba',
  units: 1,
  memberPrice: 20000,
  publicPrice: 30000,
};

describe('CourtsService', () => {
  let service: CourtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtsService],
    }).compile();

    service = module.get<CourtsService>(CourtsService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_COURT).data).toEqual(NEW_COURT);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne('futbol-5').id).toBe('futbol-5');
  });

  it('update devuelve el id y los cambios', () => {
    expect(service.update('futbol-5', { publicPrice: 32000 })).toMatchObject({
      id: 'futbol-5',
      data: { publicPrice: 32000 },
    });
  });

  it('create responde 400 si el precio para el público es menor que el de socios', () => {
    // Los mismos datos de NEW_COURT, pero con los precios al revés.
    const wrongPrices: CreateCourtDto = {
      id: 'futbol-9',
      activity: 'futbol',
      name: 'Fútbol 9',
      detail: 'Cancha de prueba',
      units: 1,
      memberPrice: 30000,
      publicPrice: 20000,
    };
    expect(() => service.create(wrongPrices)).toThrow(BadRequestException);
  });
});
