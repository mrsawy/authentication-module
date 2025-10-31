import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    phone: '+201234567890',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      phone: '+201234567890',
      password: 'hashedPassword123',
      firstName: 'Test',
      lastName: 'User',
    }),
  };

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      username: 'testuser',
      email: 'test@example.com',
      phone: '+201234567890',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user successfully', async () => {
      const token = 'jwt-token-123';
      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.register(registerDto);

      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'User registered successfully',
        user: expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
        }),
        token,
      });
      expect('password' in result.user).toBe(false);
    });

    it('should throw error if user creation fails', async () => {
      mockUserService.create.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerDto)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'testuser',
      password: 'Password123',
    };

    it('should login user successfully with correct credentials', async () => {
      const token = 'jwt-token-123';
      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(mockUserService.findOne).toHaveBeenCalledWith(loginDto.identifier);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual({
        message: 'Logged in successfully',
        user: expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
        }),
        token,
      });
      expect(result.user.password).toBeUndefined();
    });

    it('should throw error for incorrect password', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow('Wrong Password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow('Wrong Password');
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = { userId: '123', username: 'test' };
      const token = 'jwt-token-123';
      mockJwtService.sign.mockReturnValue(token);

      const result = service.generateToken(payload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const token = 'valid-token';
      const payload = { userId: '123', username: 'test' };
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.verifyToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const token = 'expired-token';
      mockJwtService.verify.mockImplementation(() => {
        const error: any = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(token)).rejects.toThrow('Token expired');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalid-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(token)).rejects.toThrow('Invalid token');
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', () => {
      const token = 'jwt-token';
      const payload = { userId: '123', username: 'test' };
      mockJwtService.decode.mockReturnValue(payload);

      const result = service.decodeToken(token);

      expect(mockJwtService.decode).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });
  });
});
