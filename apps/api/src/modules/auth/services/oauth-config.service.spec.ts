import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OAuthConfigService } from './oauth-config.service';

describe('OAuthConfigService', () => {
  let service: OAuthConfigService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<OAuthConfigService>(OAuthConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWechatConfig', () => {
    it('should return WeChat OAuth configuration', () => {
      // Arrange
      mockConfigService.get
        .mockReturnValueOnce('test-app-id')
        .mockReturnValueOnce('test-app-secret')
        .mockReturnValueOnce('http://localhost:3000/callback');

      // Act
      const config = service.getWechatConfig();

      // Assert
      expect(config).toEqual({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        callbackURL: 'http://localhost:3000/callback',
      });
      expect(configService.get).toHaveBeenCalledWith('WECHAT_APP_ID');
      expect(configService.get).toHaveBeenCalledWith('WECHAT_APP_SECRET');
      expect(configService.get).toHaveBeenCalledWith('WECHAT_CALLBACK_URL');
    });
  });

  describe('getGoogleConfig', () => {
    it('should return Google OAuth configuration', () => {
      // Arrange
      mockConfigService.get
        .mockReturnValueOnce('test-client-id')
        .mockReturnValueOnce('test-client-secret')
        .mockReturnValueOnce('http://localhost:3000/callback');

      // Act
      const config = service.getGoogleConfig();

      // Assert
      expect(config).toEqual({
        clientID: 'test-client-id',
        clientSecret: 'test-client-secret',
        callbackURL: 'http://localhost:3000/callback',
      });
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_ID');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_SECRET');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CALLBACK_URL');
    });
  });

  describe('getRedisConfig', () => {
    it('should return Redis configuration with defaults', () => {
      // Arrange
      mockConfigService.get
        .mockReturnValueOnce(undefined) // REDIS_HOST
        .mockReturnValueOnce(undefined) // REDIS_PORT
        .mockReturnValueOnce(undefined); // REDIS_PASSWORD

      // Act
      const config = service.getRedisConfig();

      // Assert
      expect(config).toEqual({
        host: 'localhost',
        port: 6379,
        password: undefined,
      });
    });

    it('should return Redis configuration from environment variables', () => {
      // Arrange
      mockConfigService.get
        .mockReturnValueOnce('redis.example.com')
        .mockReturnValueOnce(6380)
        .mockReturnValueOnce('redis-password');

      // Act
      const config = service.getRedisConfig();

      // Assert
      expect(config).toEqual({
        host: 'redis.example.com',
        port: 6380,
        password: 'redis-password',
      });
    });
  });
});
