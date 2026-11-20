import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

// QUÉ ES: los tests unitarios de AuthService.
// NIVEL: test — prueba la lógica del service con un UsersService falso.
// DÓNDE SE USA: los corre npm test.

describe('AuthService', () => {
  let service: AuthService;
  const usersService = { create: vi.fn(), findByEmail: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('register le pasa los datos a UsersService.create', async () => {
    const dto = {
      roleId: 1,
      fullName: 'Marta Quiroga',
      email: 'marta@example.com',
      password: 'claveSegura123',
    };
    const created = { id: 7, ...dto, password: undefined };
    usersService.create.mockResolvedValue(created);

    await expect(service.register(dto)).resolves.toBe(created);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });
});
