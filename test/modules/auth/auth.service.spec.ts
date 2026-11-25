import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../src/modules/users/users.service.js';
import { AuthService } from '../../../src/modules/auth/auth.service.js';

// QUÉ ES: los tests unitarios de AuthService.
// NIVEL: test — prueba la lógica con UsersService y JwtService falsos.
// DÓNDE SE USA: los corre npm test.

const PASSWORD = 'claveSegura123';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = { create: vi.fn(), findByEmail: vi.fn() };
  const jwtService = { signAsync: vi.fn() };

  // Un usuario como lo devuelve findByEmail: con el hash de PASSWORD.
  const userWithHash = async (isActive = true) => ({
    id: 7,
    roleId: 1,
    fullName: 'Marta Quiroga',
    email: 'marta@example.com',
    passwordHash: await bcrypt.hash(PASSWORD, 10),
    isActive,
    createdAt: new Date(),
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('register le pasa los datos a UsersService.create', async () => {
    const dto = {
      roleId: 1,
      fullName: 'Marta Quiroga',
      email: 'marta@example.com',
      password: PASSWORD,
    };
    usersService.create.mockResolvedValue({ id: 7 });
    await service.register(dto);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('login devuelve el token si el mail y la contraseña coinciden', async () => {
    usersService.findByEmail.mockResolvedValue(await userWithHash());
    jwtService.signAsync.mockResolvedValue('token-de-prueba');

    await expect(
      service.login({ email: 'marta@example.com', password: PASSWORD })
    ).resolves.toEqual({ access_token: 'token-de-prueba' });
    // El token lleva el id, el mail y el rol, nunca la contraseña.
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 7,
      email: 'marta@example.com',
      roleId: 1,
    });
  });

  it('login responde 401 si la contraseña no coincide', async () => {
    usersService.findByEmail.mockResolvedValue(await userWithHash());
    await expect(
      service.login({ email: 'marta@example.com', password: 'otra-clave' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login responde 401 si el mail no está registrado', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(
      service.login({ email: 'nadie@example.com', password: PASSWORD })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login responde 401 si el usuario está dado de baja', async () => {
    usersService.findByEmail.mockResolvedValue(await userWithHash(false));
    await expect(
      service.login({ email: 'marta@example.com', password: PASSWORD })
    ).rejects.toThrow(UnauthorizedException);
  });
});
