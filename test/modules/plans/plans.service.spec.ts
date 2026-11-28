import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/shared/database/prisma.service.js';
import { Plan } from '../../../src/modules/plans/entities/plan.entity.js';
import { PlansService } from '../../../src/modules/plans/plans.service.js';

// QUÉ ES: los tests unitarios de PlansService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const PLAN: Plan = {
  id: 2,
  name: 'Familiar',
  type: 'familiar',
  people: 'Hasta 4 personas',
  description: 'Para el grupo familiar',
  discountNote: null,
  badge: null,
};

describe('PlansService', () => {
  let service: PlansService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    plan: {
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
      providers: [PlansService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('findAll devuelve los planes de la base', async () => {
    prisma.plan.findMany.mockResolvedValue([PLAN]);
    await expect(service.findAll()).resolves.toEqual([PLAN]);
  });

  it('findOne devuelve el plan si existe', async () => {
    prisma.plan.findUnique.mockResolvedValue(PLAN);
    await expect(service.findOne(2)).resolves.toEqual(PLAN);
  });

  it('findOne responde 404 si el plan no existe', async () => {
    prisma.plan.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('update no toca la base si el plan no existe', async () => {
    prisma.plan.findUnique.mockResolvedValue(null);
    await expect(service.update(999, { name: 'X' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.plan.update).not.toHaveBeenCalled();
  });

  it('remove borra el plan si existe', async () => {
    prisma.plan.findUnique.mockResolvedValue(PLAN);
    prisma.plan.delete.mockResolvedValue(PLAN);
    await expect(service.remove(2)).resolves.toEqual(PLAN);
    expect(prisma.plan.delete).toHaveBeenCalledWith({
      where: { id: 2 },
    });
  });
});
