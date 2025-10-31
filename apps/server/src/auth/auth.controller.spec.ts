import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.http';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockAuthResponse = {
    message: 'User registered successfully',
    user: {
      _id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      phone: '+201234567890',
      firstName: 'Test',
      lastName: 'User',
    },
    token: 'jwt-token-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (register)', () => {
    const registerDto: RegisterDto = {
      username: 'testuser',
      email: 'test@example.com',
      phone: '+201234567890',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.create(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should propagate errors from auth service', async () => {
      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.create(registerDto)).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'testuser',
      password: 'Password123',
    };

    it('should login a user', async () => {
      const loginResponse = {
        ...mockAuthResponse,
        message: 'Logged in successfully',
      };
      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResponse);
    });

    it('should propagate errors from auth service', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});