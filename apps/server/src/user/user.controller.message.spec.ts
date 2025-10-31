import { Test, TestingModule } from '@nestjs/testing';
import { UserControllerMessage } from './user.controller.message';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

describe('UserControllerMessage', () => {
    let controller: UserControllerMessage;
    let userService: UserService;

    const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        phone: '+201234567890',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
    };

    const mockUserService = {
        findOne: jest.fn(),
    };

    const mockAuthGuard = {
        canActivate: jest.fn().mockReturnValue(true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserControllerMessage],
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

        controller = module.get<UserControllerMessage>(UserControllerMessage);
        userService = module.get<UserService>(UserService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findOwnData', () => {
        it('should return user data via RPC', async () => {
            const mockContext = {
                userPayload: { _id: '507f1f77bcf86cd799439011' },
            };

            mockUserService.findOne.mockResolvedValue(mockUser);

            const result = await controller.findOwnData(mockContext as any);

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
    });
});
