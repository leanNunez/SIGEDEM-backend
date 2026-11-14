import { Test, TestingModule } from '@nestjs/testing';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { PersonsService } from './persons.service.js';

// QUÉ ES: los tests unitarios de PersonsService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_PERSON: CreatePersonDto = {
  familyGroupId: 5,
  dni: '39123456',
  firstName: 'Sofía',
  lastName: 'Vega',
  birthDate: '1996-04-10',
};

describe('PersonsService', () => {
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonsService],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_PERSON).data).toEqual(NEW_PERSON);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne(1).id).toBe(1);
  });

  it('update devuelve el id y los cambios', () => {
    expect(service.update(1, { phone: '381 555-0110' })).toMatchObject({
      id: 1,
      data: { phone: '381 555-0110' },
    });
  });
});
