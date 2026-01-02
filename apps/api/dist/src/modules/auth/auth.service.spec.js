"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
jest.mock('bcrypt');
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUsersService = {
        findByUsername: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
        verifyAsync: jest.fn(),
    };
    const mockConfigService = {
        get: jest.fn().mockReturnValue('test-jwt-secret'),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('register', () => {
        const registerDto = {
            username: 'testuser',
            password: 'Test1234',
        };
        it('should successfully register a new user', async () => {
            const hashedPassword = 'hashedPassword123';
            const createdUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: hashedPassword,
            };
            mockUsersService.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            mockUsersService.create.mockResolvedValue(createdUser);
            mockJwtService.sign
                .mockReturnValueOnce('access-token-123')
                .mockReturnValueOnce('refresh-token-456');
            const result = await service.register(registerDto);
            expect(result.data.user).toEqual({
                id: 'user-id-123',
                username: 'testuser',
            });
            expect(result.data.accessToken).toBe('access-token-123');
            expect(result.refreshToken).toBe('refresh-token-456');
            expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
            expect(bcrypt.hash).toHaveBeenCalledWith('Test1234', 10);
        });
        it('should throw ConflictException when username already exists', async () => {
            const existingUser = {
                id: 'existing-id',
                username: 'testuser',
                password: 'hashedPassword',
            };
            mockUsersService.findByUsername.mockResolvedValue(existingUser);
            await expect(service.register(registerDto)).rejects.toThrow(common_1.ConflictException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
        it('should hash password with bcrypt cost=10', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            mockUsersService.create.mockResolvedValue({
                id: 'user-id',
                username: 'testuser',
                password: 'hashedPassword',
            });
            mockJwtService.sign.mockReturnValue('token');
            await service.register(registerDto);
            expect(bcrypt.hash).toHaveBeenCalledWith('Test1234', 10);
        });
        it('should generate JWT access token with 15min expiry', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            mockUsersService.create.mockResolvedValue({
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
            });
            mockJwtService.sign.mockReturnValue('token');
            await service.register(registerDto);
            expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 'user-id-123', username: 'testuser' }, { expiresIn: '15m' });
        });
        it('should generate refresh token with 7d expiry', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            mockUsersService.create.mockResolvedValue({
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
            });
            mockJwtService.sign.mockReturnValue('token');
            await service.register(registerDto);
            expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 'user-id-123', username: 'testuser' }, { expiresIn: '7d' });
        });
    });
    describe('login', () => {
        const loginDto = {
            username: 'testuser',
            password: 'Test1234',
        };
        it('should successfully login with valid credentials', async () => {
            const existingUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
            };
            mockUsersService.findByUsername.mockResolvedValue(existingUser);
            bcrypt.compare.mockResolvedValue(true);
            mockJwtService.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');
            const result = await service.login(loginDto);
            expect(result.data.user).toEqual({
                id: 'user-id-123',
                username: 'testuser',
            });
            expect(result.data.accessToken).toBe('access-token');
            expect(result.refreshToken).toBe('refresh-token');
        });
        it('should throw UnauthorizedException when user not found', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException when password is wrong', async () => {
            const existingUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
            };
            mockUsersService.findByUsername.mockResolvedValue(existingUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('validateUser', () => {
        it('should return user when user exists', async () => {
            const userPayload = { id: 'user-id-123', username: 'testuser' };
            const foundUser = { id: 'user-id-123', username: 'testuser' };
            mockUsersService.findById.mockResolvedValue(foundUser);
            const result = await service.validateUser(userPayload);
            expect(result).toEqual(foundUser);
            expect(mockUsersService.findById).toHaveBeenCalledWith('user-id-123');
        });
        it('should return null when user does not exist', async () => {
            const userPayload = { id: 'non-existent', username: 'unknown' };
            mockUsersService.findById.mockResolvedValue(null);
            const result = await service.validateUser(userPayload);
            expect(result).toBeNull();
            expect(mockUsersService.findById).toHaveBeenCalledWith('non-existent');
        });
    });
    describe('refreshTokens', () => {
        it('should return new tokens when refresh token is valid', async () => {
            const userId = 'user-id-123';
            const username = 'testuser';
            const refreshToken = 'valid-refresh-token';
            mockJwtService.verifyAsync = jest.fn().mockResolvedValue({ id: userId, username });
            mockUsersService.findById.mockResolvedValue({ id: userId, username });
            mockJwtService.sign
                .mockReturnValueOnce('new-access-token')
                .mockReturnValueOnce('new-refresh-token');
            const result = await service.refreshTokens(refreshToken);
            expect(result).toEqual({
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
            });
            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
                secret: 'test-jwt-secret',
            });
        });
        it('should throw UnauthorizedException when refresh token is invalid', async () => {
            const refreshToken = 'invalid-token';
            mockJwtService.verifyAsync = jest.fn().mockRejectedValue(new Error('Invalid token'));
            await expect(service.refreshTokens(refreshToken)).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException when user not found during refresh', async () => {
            const refreshToken = 'valid-token-but-no-user';
            mockJwtService.verifyAsync = jest.fn().mockResolvedValue({ id: 'user-id', username: 'user' });
            mockUsersService.findById.mockResolvedValue(null);
            await expect(service.refreshTokens(refreshToken)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('logout', () => {
        it('should successfully logout', async () => {
            const result = await service.logout('user-id');
            expect(result).toBeUndefined();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map