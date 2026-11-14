import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { Payment } from './entities/payment.entity.js';
import { PaymentsService } from './payments.service.js';

// QUÉ ES: los tests unitarios de PaymentsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const PAYMENT: Payment = {
  id: 1,
  enrollmentId: 1,
  method: 'transferencia',
  amount: new Prisma.Decimal(18000),
  paidOn: new Date('2026-10-01'),
  operationNumber: 'OP-100001',
  status: 'acreditado',
  verifiedBy: 2,
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    payment: {
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
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('findAll devuelve los pagos de la base', async () => {
    prisma.payment.findMany.mockResolvedValue([PAYMENT]);
    await expect(service.findAll()).resolves.toEqual([PAYMENT]);
  });

  it('findOne devuelve el pago si existe', async () => {
    prisma.payment.findUnique.mockResolvedValue(PAYMENT);
    await expect(service.findOne(1)).resolves.toEqual(PAYMENT);
  });

  it('findOne responde 404 si el pago no existe', async () => {
    prisma.payment.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create convierte la fecha del pago en Date', async () => {
    prisma.payment.create.mockResolvedValue(PAYMENT);
    await service.create({
      enrollmentId: 1,
      amount: 18000,
      paidOn: '2026-10-01',
      operationNumber: 'OP-100001',
    });
    expect(prisma.payment.create).toHaveBeenCalledWith({
      data: {
        enrollmentId: 1,
        amount: 18000,
        paidOn: new Date('2026-10-01'),
        operationNumber: 'OP-100001',
      },
    });
  });

  it('update no toca la base si el pago no existe', async () => {
    prisma.payment.findUnique.mockResolvedValue(null);
    await expect(service.update(99, { status: 'acreditado' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });

  it('remove borra el pago si existe', async () => {
    prisma.payment.findUnique.mockResolvedValue(PAYMENT);
    prisma.payment.delete.mockResolvedValue(PAYMENT);
    await expect(service.remove(1)).resolves.toEqual(PAYMENT);
    expect(prisma.payment.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
