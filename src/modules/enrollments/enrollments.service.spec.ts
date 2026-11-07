import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { EnrollmentsService } from './enrollments.service.js';
import { Enrollment } from './entities/enrollment.entity.js';

// QUÉ ES: los tests unitarios de EnrollmentsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const ENROLLMENT: Enrollment = {
  id: 1,
  personId: 1,
  planId: 'individual',
  createdBy: 1,
  status: 'acreditada',
  procedureDate: new Date('2026-10-01'),
  loadedAt: new Date('2026-10-01T12:30:00Z'),
};

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    enrollment: {
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
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  it('findAll devuelve las inscripciones de la base', async () => {
    prisma.enrollment.findMany.mockResolvedValue([ENROLLMENT]);
    await expect(service.findAll()).resolves.toEqual([ENROLLMENT]);
  });

  it('findOne devuelve la inscripción si existe', async () => {
    prisma.enrollment.findUnique.mockResolvedValue(ENROLLMENT);
    await expect(service.findOne(1)).resolves.toEqual(ENROLLMENT);
  });

  it('findOne responde 404 si la inscripción no existe', async () => {
    prisma.enrollment.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create convierte la fecha del trámite en Date', async () => {
    prisma.enrollment.create.mockResolvedValue(ENROLLMENT);
    await service.create({
      personId: 1,
      planId: 'individual',
      createdBy: 1,
      procedureDate: '2026-10-01',
    });
    expect(prisma.enrollment.create).toHaveBeenCalledWith({
      data: {
        personId: 1,
        planId: 'individual',
        createdBy: 1,
        procedureDate: new Date('2026-10-01'),
      },
    });
  });

  it('update no toca la base si la inscripción no existe', async () => {
    prisma.enrollment.findUnique.mockResolvedValue(null);
    await expect(service.update(99, { status: 'anulada' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.enrollment.update).not.toHaveBeenCalled();
  });

  it('remove borra la inscripción si existe', async () => {
    prisma.enrollment.findUnique.mockResolvedValue(ENROLLMENT);
    prisma.enrollment.delete.mockResolvedValue(ENROLLMENT);
    await expect(service.remove(1)).resolves.toEqual(ENROLLMENT);
    expect(prisma.enrollment.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
