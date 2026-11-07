import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { PublicUser } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

// QUÉ ES: los tests unitarios de UsersService.
// NIVEL: test — prueba la lógica del service sin tocar la base.
// DÓNDE SE USA: los corre npm test.

const USER: PublicUser = {
  id: 1,
  roleId: 1,
  fullName: 'Marta Quiroga',
  email: 'operador@example.com',
  isActive: true,
  createdAt: new Date('2026-10-01T12:00:00Z'),
};

const OMIT_HASH = { passwordHash: true };

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

  it('findAll devuelve los usuarios sin el hash', async () => {
    prisma.user.findMany.mockResolvedValue([USER]);
    await expect(service.findAll()).resolves.toEqual([USER]);
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ omit: OMIT_HASH })
    );
  });

  it('findOne devuelve el usuario si existe', async () => {
    prisma.user.findUnique.mockResolvedValue(USER);
    await expect(service.findOne(1)).resolves.toEqual(USER);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      omit: OMIT_HASH,
    });
  });

  it('findOne responde 404 si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('create guarda la contraseña hasheada, no en texto plano', async () => {
    prisma.user.create.mockResolvedValue(USER);
    await service.create({
      roleId: 1,
      fullName: 'Marta Quiroga',
      email: 'operador@example.com',
      password: 'clave-segura-123',
    });

    const { data, omit } = prisma.user.create.mock.calls[0][0];
    expect(data.password).toBeUndefined();
    expect(data.passwordHash).not.toBe('clave-segura-123');
    // El formato guardado es 'sal:hash', los dos en hexadecimal.
    expect(data.passwordHash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(omit).toEqual(OMIT_HASH);
  });

  it('update vuelve a hashear la contraseña si viene una nueva', async () => {
    prisma.user.findUnique.mockResolvedValue(USER);
    prisma.user.update.mockResolvedValue(USER);
    await service.update(1, { password: 'otra-clave-456' });

    const { data, omit } = prisma.user.update.mock.calls[0][0];
    expect(data.passwordHash).not.toBe('otra-clave-456');
    expect(data.passwordHash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    expect(omit).toEqual(OMIT_HASH);
  });

  it('update no toca la base si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.update(99, { fullName: 'X' })).rejects.toThrow(
      NotFoundException
    );
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('remove borra el usuario si existe', async () => {
    prisma.user.findUnique.mockResolvedValue(USER);
    prisma.user.delete.mockResolvedValue(USER);
    await expect(service.remove(1)).resolves.toEqual(USER);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      omit: OMIT_HASH,
    });
  });
});
