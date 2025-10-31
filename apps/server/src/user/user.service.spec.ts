import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    phone: '+201234567890',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockUserModel = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));

    jest.clearAllMocks();
    process.env.SALT_ROUNDS = '10';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      phone: '+201234567890',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should create a new user with hashed password', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException for duplicate email', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const duplicateError: any = new Error('Duplicate key');
      duplicateError.code = 11000;
      duplicateError.keyValue = { email: 'test@example.com' };
      
      mockUserModel.create.mockRejectedValue(duplicateError);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow(
        'email "test@example.com" already exists.',
      );
    });

    it('should throw ConflictException for duplicate username', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const duplicateError: any = new Error('Duplicate key');
      duplicateError.code = 11000;
      duplicateError.keyValue = { username: 'testuser' };
      
      mockUserModel.create.mockRejectedValue(duplicateError);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow(
        'username "testuser" already exists.',
      );
    });

    it('should propagate other errors', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const error = new Error('Database error');
      mockUserModel.create.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should find user by valid ObjectId', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should find user by email', async () => {
      const email = 'test@example.com';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email }, { username: email }, { phone: email }],
      });
      expect(result).toEqual(mockUser);
    });

    it('should find user by username', async () => {
      const username = 'testuser';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: username }, { username }, { phone: username }],
      });
      expect(result).toEqual(mockUser);
    });

    it('should find user by phone', async () => {
      const phone = '+201234567890';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(phone);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: phone }, { username: phone }, { phone }],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId)).rejects.toThrow('User Not Found');
    });

    it('should throw NotFoundException if user not found by identifier', async () => {
      const email = 'nonexistent@example.com';
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.findOne(email)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(email)).rejects.toThrow('User Not Found');
    });
  });
});
