import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { Person } from './entities/person.entity.js';
import { PersonsService } from './persons.service.js';

// QUÉ ES: los tests unitarios de PersonsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const PERSON: Person = {
  id: 1,
  familyGroupId: 4,
  dni: '30111222',
  firstName: 'Ana',
  lastName: 'Gómez',
  birthDate: new Date('1983-05-12'),
  email: 'ana.gomez@example.com',
  phone: '381 555-0101',
};

describe('PersonsService', () => {
  let service: PersonsService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    person: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // useValue reemplaza el PrismaService real por el falso.
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  it('findAll devuelve las personas de la base', async () => {
    prisma.person.findMany.mockResolvedValue([PERSON]);
    await expect(service.findAll()).resolves.toEqual([PERSON]);
  });

  it('findOne devuelve la persona si existe', async () => {
    prisma.person.findUnique.mockResolvedValue(PERSON);
    await expect(service.findOne(1)).resolves.toEqual(PERSON);
  });

  it('findOne responde 404 si la persona no existe', async () => {
    prisma.person.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create convierte la fecha de nacimiento en Date', async () => {
    prisma.person.create.mockResolvedValue(PERSON);
    await service.create({
      dni: '30111222',
      firstName: 'Ana',
      lastName: 'Gómez',
      birthDate: '1983-05-12',
    });
    expect(prisma.person.create).toHaveBeenCalledWith({
      data: {
        dni: '30111222',
        firstName: 'Ana',
        lastName: 'Gómez',
        birthDate: new Date('1983-05-12'),
      },
    });
  });

  it('update no toca la base si la persona no existe', async () => {
    prisma.person.findUnique.mockResolvedValue(null);
    await expect(service.update(99, { phone: '381 555-0000' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.person.update).not.toHaveBeenCalled();
  });

  it('remove borra la persona si existe', async () => {
    prisma.person.findUnique.mockResolvedValue(PERSON);
    prisma.person.delete.mockResolvedValue(PERSON);
    await expect(service.remove(1)).resolves.toEqual(PERSON);
    expect(prisma.person.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
