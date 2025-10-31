import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.http';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { IUserRequest } from '../auth/interfaces/IUserRequest.interface';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    phone: '+201234567890',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOwnData', () => {
    it('should return current user data without password', async () => {
      const mockRequest = {
        user: { _id: '507f1f77bcf86cd799439011' },
      } as IUserRequest;

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOwnData(mockRequest);

      expect(userService.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({
        message: 'User data fetched successfully',
        user: expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
        }),
      });
      expect('password' in result.user).toBe(false);
    });

    it('should propagate errors from user service', async () => {
      const mockRequest = {
        user: { _id: '507f1f77bcf86cd799439011' },
      } as IUserRequest;

      const error = new Error('User not found');
      mockUserService.findOne.mockRejectedValue(error);

      await expect(controller.findOwnData(mockRequest)).rejects.toThrow('User not found');
    });
  });
});