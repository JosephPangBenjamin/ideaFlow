import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AnalyticsService } from '../analytics/analytics.service';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let analyticsService: AnalyticsService;

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockAnalyticsService = {
    track: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
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
      // Arrange
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 'user-id-123',
        username: 'testuser',
        password: hashedPassword,
      };

      mockUsersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token-123')
        .mockReturnValueOnce('refresh-token-456');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result.data.user).toEqual({
        id: 'user-id-123',
        username: 'testuser',
      });
      expect(result.data.accessToken).toBe('access-token-123');
      expect(result.refreshToken).toBe('refresh-token-456');
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.hash).toHaveBeenCalledWith('Test1234', 10);
      expect(mockAnalyticsService.track).toHaveBeenCalledWith(
        { eventName: 'user_registered', metadata: { username: 'testuser' } },
        'user-id-123'
      );
    });

    it('should throw ConflictException when username already exists', async () => {
      // Arrange
      const existingUser = {
        id: 'existing-id',
        username: 'testuser',
        password: 'hashedPassword',
      };
      mockUsersService.findByUsername.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('should hash password with bcrypt cost=10', async () => {
      // Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.create.mockResolvedValue({
        id: 'user-id',
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.register(registerDto);

      // Assert - bcrypt should be called with cost=10
      expect(bcrypt.hash).toHaveBeenCalledWith('Test1234', 10);
    });

    it('should generate JWT access token with 15min expiry', async () => {
      // Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.create.mockResolvedValue({
        id: 'user-id-123',
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.register(registerDto);

      // Assert - first sign call should be access token with 15m expiry
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { id: 'user-id-123', username: 'testuser' },
        { expiresIn: '15m' }
      );
    });

    it('should generate refresh token with 7d expiry', async () => {
      // Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersService.create.mockResolvedValue({
        id: 'user-id-123',
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.register(registerDto);

      // Assert - second sign call should be refresh token with 7d expiry
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { id: 'user-id-123', username: 'testuser' },
        { expiresIn: '7d' }
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'Test1234',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      const existingUser = {
        id: 'user-id-123',
        username: 'testuser',
        password: 'hashedPassword',
      };
      mockUsersService.findByUsername.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result.data.user).toEqual({
        id: 'user-id-123',
        username: 'testuser',
      });
      expect(result.data.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockAnalyticsService.track).toHaveBeenCalledWith(
        { eventName: 'user_logged_in', metadata: { username: 'testuser' } },
        'user-id-123'
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockUsersService.findByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      // Arrange
      const existingUser = {
        id: 'user-id-123',
        username: 'testuser',
        password: 'hashedPassword',
      };
      mockUsersService.findByUsername.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user when user exists', async () => {
      // Arrange
      const userPayload = { id: 'user-id-123', username: 'testuser' };
      const foundUser = { id: 'user-id-123', username: 'testuser' };
      mockUsersService.findById.mockResolvedValue(foundUser);

      // Act
      const result = await service.validateUser(userPayload);

      // Assert
      expect(result).toEqual(foundUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-id-123');
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      const userPayload = { id: 'non-existent', username: 'unknown' };
      mockUsersService.findById.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(userPayload);

      // Assert
      expect(result).toBeNull();
      expect(mockUsersService.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens when refresh token is valid', async () => {
      // Arrange
      const userId = 'user-id-123';
      const username = 'testuser';
      const refreshToken = 'valid-refresh-token';

      mockJwtService.verifyAsync = jest.fn().mockResolvedValue({ id: userId, username });
      mockUsersService.findById.mockResolvedValue({ id: userId, username });
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      // Act
      const result = await service.refreshTokens(refreshToken);

      // Assert
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-jwt-secret',
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      // Arrange
      const refreshToken = 'invalid-token';
      mockJwtService.verifyAsync = jest.fn().mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found during refresh', async () => {
      // Arrange
      const refreshToken = 'valid-token-but-no-user';
      mockJwtService.verifyAsync = jest.fn().mockResolvedValue({ id: 'user-id', username: 'user' });
      mockUsersService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });
  describe('logout', () => {
    it('should successfully logout', async () => {
      // Act
      const result = await service.logout('user-id');

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
