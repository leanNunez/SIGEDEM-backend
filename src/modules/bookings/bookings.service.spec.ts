import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { BookingsService } from './bookings.service.js';
import { Booking } from './entities/booking.entity.js';

// QUÉ ES: los tests unitarios de BookingsService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const BOOKING: Booking = {
  id: 1,
  courtId: 'futbol-5',
  courtNumber: 1,
  date: new Date('2026-11-05'),
  hour: 20,
  fullName: 'Ana Gómez',
  dni: '30111222',
  phone: '381 555-0101',
  isMember: true,
  price: new Prisma.Decimal(15000),
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

  it('findAll devuelve las reservas de la base', async () => {
    prisma.booking.findMany.mockResolvedValue([BOOKING]);
    await expect(service.findAll()).resolves.toEqual([BOOKING]);
  });

  it('findOne devuelve la reserva si existe', async () => {
    prisma.booking.findUnique.mockResolvedValue(BOOKING);
    await expect(service.findOne(1)).resolves.toEqual(BOOKING);
  });

  it('findOne responde 404 si la reserva no existe', async () => {
    prisma.booking.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create convierte la fecha de la reserva en Date', async () => {
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
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: {
        courtId: 'futbol-5',
        date: new Date('2026-11-05'),
        hour: 20,
        fullName: 'Ana Gómez',
        dni: '30111222',
        phone: '381 555-0101',
        price: 15000,
      },
    });
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
    expect(prisma.booking.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
