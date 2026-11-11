import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { BookingsService } from './bookings.service.js';
import { BookingWithRenter, Renter } from './entities/booking.entity.js';

// QUÉ ES: los tests unitarios de BookingsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const RENTER: Renter = {
  id: 1,
  dni: '30111222',
  fullName: 'Ana Gómez',
  phone: '381 555-0101',
};

const BOOKING: BookingWithRenter = {
  id: 1,
  courtId: 'futbol-5',
  courtNumber: 1,
  date: new Date('2026-11-05'),
  hour: 20,
  renterId: 1,
  isMember: true,
  price: new Prisma.Decimal(15000),
  renter: RENTER,
};

describe('BookingsService', () => {
  let service: BookingsService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    booking: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    renter: { upsert: vi.fn() },
    // $transaction recibe una función y la corre con el mismo cliente falso.
    $transaction: vi.fn(
      (work: (tx: unknown) => Promise<unknown>): Promise<unknown> =>
        work(prisma)
    ),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // useValue reemplaza el PrismaService real por el falso.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('findAll devuelve las reservas con quien alquila', async () => {
    prisma.booking.findMany.mockResolvedValue([BOOKING]);
    await expect(service.findAll()).resolves.toEqual([BOOKING]);
    expect(prisma.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ include: { renter: true } })
    );
  });

  it('findOne responde 404 si la reserva no existe', async () => {
    prisma.booking.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create guarda a quien alquila por DNI y la reserva con su renterId', async () => {
    prisma.renter.upsert.mockResolvedValue(RENTER);
    prisma.booking.create.mockResolvedValue(BOOKING);
    await service.create({
      courtId: 'futbol-5',
      date: '2026-11-05',
      hour: 20,
      fullName: 'Ana Gómez',
      dni: '30111222',
      phone: '381 555-0101',
      price: 15000,
    });
    expect(prisma.renter.upsert).toHaveBeenCalledWith({
      where: { dni: '30111222' },
      create: { dni: '30111222', fullName: 'Ana Gómez', phone: '381 555-0101' },
      update: { fullName: 'Ana Gómez', phone: '381 555-0101' },
    });
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: {
        courtId: 'futbol-5',
        date: new Date('2026-11-05'),
        hour: 20,
        price: 15000,
        renterId: 1,
      },
      include: { renter: true },
    });
  });

  it('update deja a quien alquila como estaba si no vienen sus datos', async () => {
    prisma.booking.findUnique.mockResolvedValue(BOOKING);
    prisma.renter.upsert.mockResolvedValue(RENTER);
    prisma.booking.update.mockResolvedValue(BOOKING);
    await service.update(1, { hour: 21 });
    expect(prisma.renter.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { dni: '30111222' } })
    );
  });

  it('update responde 400 si cambia el DNI sin nombre ni teléfono', async () => {
    prisma.booking.findUnique.mockResolvedValue(BOOKING);
    await expect(service.update(1, { dni: '29123456' })).rejects.toThrow(
      BadRequestException
    );
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('update no toca la base si la reserva no existe', async () => {
    prisma.booking.findUnique.mockResolvedValue(null);
    await expect(service.update(99, { hour: 21 })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('remove borra la reserva si existe', async () => {
    prisma.booking.findUnique.mockResolvedValue(BOOKING);
    prisma.booking.delete.mockResolvedValue(BOOKING);
    await expect(service.remove(1)).resolves.toEqual(BOOKING);
    expect(prisma.booking.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { renter: true },
    });
  });
});
