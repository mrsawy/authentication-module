import { Test, TestingModule } from '@nestjs/testing';
import { AuthControllerMessage } from './auth.controller.message';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthControllerMessage', () => {
    let controller: AuthControllerMessage;
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
        },
        token: 'jwt-token-123',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthControllerMessage],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthControllerMessage>(AuthControllerMessage);
        authService = module.get<AuthService>(AuthService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
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

        it('should register a new user via RPC', async () => {
            mockAuthService.register.mockResolvedValue(mockAuthResponse);

            const result = await controller.register(registerDto);

            expect(authService.register).toHaveBeenCalledWith(registerDto);
            expect(result).toEqual(mockAuthResponse);
        });

        it('should handle errors via handleRpcError', async () => {
            const error = new Error('Registration failed');
            mockAuthService.register.mockRejectedValue(error);

            await expect(controller.register(registerDto)).rejects.toThrow();
        });
    });

    describe('login', () => {
        const loginDto: LoginDto = {
            identifier: 'testuser',
            password: 'Password123',
        };

        it('should login a user via RPC', async () => {
            const loginResponse = {
                ...mockAuthResponse,
                message: 'Logged in successfully',
            };
            mockAuthService.login.mockResolvedValue(loginResponse);

            const result = await controller.login(loginDto);

            expect(authService.login).toHaveBeenCalledWith(loginDto);
            expect(result).toEqual(loginResponse);
        });

        it('should handle errors via handleRpcError', async () => {
            const error = new Error('Login failed');
            mockAuthService.login.mockRejectedValue(error);

            await expect(controller.login(loginDto)).rejects.toThrow();
        });
    });
});