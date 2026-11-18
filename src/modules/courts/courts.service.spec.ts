import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CourtsService } from './courts.service.js';
import { Court } from './entities/court.entity.js';

// QUÉ ES: los tests unitarios de CourtsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const COURT: Court = {
  id: 'futbol-5',
  activity: 'futbol',
  name: 'Fútbol 5',
  detail: 'Cuatro canchas con iluminación LED',
  units: 4,
  memberPrice: new Prisma.Decimal(15000),
  publicPrice: new Prisma.Decimal(22000),
};

describe('CourtsService', () => {
  let service: CourtsService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    court: {
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
      providers: [CourtsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CourtsService>(CourtsService);
  });

  it('findAll devuelve las canchas de la base', async () => {
    prisma.court.findMany.mockResolvedValue([COURT]);
    await expect(service.findAll()).resolves.toEqual([COURT]);
  });

  it('findOne devuelve la cancha si existe', async () => {
    prisma.court.findUnique.mockResolvedValue(COURT);
    await expect(service.findOne('futbol-5')).resolves.toEqual(COURT);
  });

  it('findOne responde 404 si la cancha no existe', async () => {
    prisma.court.findUnique.mockResolvedValue(null);
    await expect(service.findOne('no-existe')).rejects.toThrow(
      NotFoundException
    );
  });

  it('create responde 400 si el precio al público es menor que el de socios', async () => {
    await expect(
      service.create({
        id: 'futbol-9',
        activity: 'futbol',
        name: 'Fútbol 9',
        detail: 'Cancha de prueba',
        units: 1,
        memberPrice: 30000,
        publicPrice: 20000,
      })
    ).rejects.toThrow(BadRequestException);
    expect(prisma.court.create).not.toHaveBeenCalled();
  });

  it('update compara el precio nuevo con el que ya estaba guardado', async () => {
    prisma.court.findUnique.mockResolvedValue(COURT);
    // El precio para socios guardado es 15000: 10000 al público no puede ser.
    await expect(
      service.update('futbol-5', { publicPrice: 10000 })
    ).rejects.toThrow(BadRequestException);
    expect(prisma.court.update).not.toHaveBeenCalled();
  });

  it('update no toca la base si la cancha no existe', async () => {
    prisma.court.findUnique.mockResolvedValue(null);
    await expect(service.update('no-existe', { name: 'X' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.court.update).not.toHaveBeenCalled();
  });

  it('remove borra la cancha si existe', async () => {
    prisma.court.findUnique.mockResolvedValue(COURT);
    prisma.court.delete.mockResolvedValue(COURT);
    await expect(service.remove('futbol-5')).resolves.toEqual(COURT);
    expect(prisma.court.delete).toHaveBeenCalledWith({
      where: { id: 'futbol-5' },
    });
  });
});
