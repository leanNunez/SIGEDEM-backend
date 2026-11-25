import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../src/shared/database/prisma.service.js';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto.js';
import { PublicUser } from '../../../src/modules/users/entities/user.entity.js';
import { UsersService } from '../../../src/modules/users/users.service.js';

// QUÉ ES: los tests unitarios de UsersService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const NEW_USER: CreateUserDto = {
  roleId: 1,
  fullName: 'Marta Quiroga',
  email: 'marta@example.com',
  password: 'claveSegura123',
};

const PUBLIC_USER: PublicUser = {
  id: 1,
  roleId: 1,
  fullName: 'Marta Quiroga',
  email: 'marta@example.com',
  isActive: true,
  createdAt: new Date('2026-11-20T12:00:00Z'),
};

describe('UsersService', () => {
  let service: UsersService;
  // Un PrismaService falso: cada función es un vi.fn() que el test controla.
  const prisma = {
    user: {
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
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('create guarda el hash de la contraseña, nunca la contraseña', async () => {
    prisma.user.create.mockResolvedValue(PUBLIC_USER);
    await service.create(NEW_USER);

    const { data } = prisma.user.create.mock.calls[0][0];
    expect(data).not.toHaveProperty('password');
    expect(data.passwordHash).not.toBe(NEW_USER.password);
    // bcrypt.compare confirma que el hash guardado es de esa contraseña.
    await expect(
      bcrypt.compare(NEW_USER.password, data.passwordHash)
    ).resolves.toBe(true);
  });

  it('create le pide a Prisma que no devuelva el hash', async () => {
    prisma.user.create.mockResolvedValue(PUBLIC_USER);
    await expect(service.create(NEW_USER)).resolves.toEqual(PUBLIC_USER);
    expect(prisma.user.create.mock.calls[0][0].omit).toEqual({
      passwordHash: true,
    });
  });

  it('findByEmail busca por mail y trae el hash (lo necesita el login)', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findByEmail('nadie@example.com')).resolves.toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nadie@example.com' },
    });
  });

  it('findOne responde 404 si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('update hashea la contraseña nueva si llega una', async () => {
    prisma.user.findUnique.mockResolvedValue(PUBLIC_USER);
    prisma.user.update.mockResolvedValue(PUBLIC_USER);
    await service.update(1, { password: 'otraClave456' });

    const { data } = prisma.user.update.mock.calls[0][0];
    expect(data).not.toHaveProperty('password');
    await expect(
      bcrypt.compare('otraClave456', data.passwordHash)
    ).resolves.toBe(true);
  });

  it('update no toca la contraseña si no llega una', async () => {
    prisma.user.findUnique.mockResolvedValue(PUBLIC_USER);
    prisma.user.update.mockResolvedValue(PUBLIC_USER);
    await service.update(1, { fullName: 'Marta Q.' });

    const { data } = prisma.user.update.mock.calls[0][0];
    expect(data.passwordHash).toBeUndefined();
  });

  it('remove no toca la base si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });
});
