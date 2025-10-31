import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let authService: AuthService;

    const mockAuthService = {
        verifyToken: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    // ---------- HTTP CONTEXT TESTS ----------
    describe('HTTP context', () => {
        it('should allow request with valid token', async () => {
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('http'),
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({
                        headers: { authorization: 'Bearer valid-token' },
                    }),
                }),
            } as unknown as ExecutionContext;

            const mockPayload = { _id: '123', username: 'test' };
            mockAuthService.verifyToken.mockReturnValue(mockPayload);

            const result = await guard.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
        });

        it('should throw UnauthorizedException if no token provided', async () => {
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('http'),
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({ headers: {} }),
                }),
            } as unknown as ExecutionContext;

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException for invalid token', async () => {
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('http'),
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({
                        headers: { authorization: 'Bearer invalid-token' },
                    }),
                }),
            } as unknown as ExecutionContext;

            mockAuthService.verifyToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    // ---------- RPC CONTEXT TESTS ----------
    describe('RPC context', () => {
        it('should allow RPC request with valid token', async () => {
            const mockContext = { userPayload: undefined };
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('rpc'),
                switchToRpc: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({ authorization: 'valid-token' }),
                    getContext: jest.fn().mockReturnValue(mockContext),
                }),
            } as unknown as ExecutionContext;

            const mockPayload = { _id: '123', username: 'test' };
            mockAuthService.verifyToken.mockResolvedValue(mockPayload);

            const result = await guard.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(mockContext.userPayload).toEqual(mockPayload);
        });

        it('should throw RpcException if no token provided in RPC', async () => {
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('rpc'),
                switchToRpc: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({ authorization: '' }),
                    getContext: jest.fn().mockReturnValue({})
                }),
            } as unknown as ExecutionContext;

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
                RpcException,
            );
        });

        it('should throw RpcException for invalid RPC token', async () => {
            const mockExecutionContext = {
                getType: jest.fn().mockReturnValue('rpc'),
                switchToRpc: jest.fn().mockReturnValue({
                    getData: jest.fn().mockReturnValue({ authorization: 'invalid' }),
                    getContext: jest.fn().mockReturnValue({}),
                }),
            } as unknown as ExecutionContext;

            mockAuthService.verifyToken.mockImplementation(() => {
                throw new Error('invalid token');
            });

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
                RpcException,
            );
        });
    });
});
