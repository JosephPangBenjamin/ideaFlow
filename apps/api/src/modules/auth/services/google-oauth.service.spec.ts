import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleOAuthService } from './google-oauth.service';
import { OAuthConfigService } from './oauth-config.service';

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;

  const mockGoogleConfig = {
    clientID: 'test_client_id',
    clientSecret: 'test_client_secret',
    callbackURL: 'http://localhost:3000/ideaFlow/api/v1/auth/google/callback',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleOAuthService,
        {
          provide: OAuthConfigService,
          useValue: {
            getGoogleConfig: jest.fn().mockReturnValue(mockGoogleConfig),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleOAuthService>(GoogleOAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAuthorizationURL', () => {
    it('应该生成正确的Google授权URL', () => {
      const state = 'test-state-123';
      const url = service.generateAuthorizationURL(state);

      // 验证URL基础路径
      expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');

      // 验证必要参数
      expect(url).toContain(`client_id=${mockGoogleConfig.clientID}`);
      expect(url).toContain(`redirect_uri=${encodeURIComponent(mockGoogleConfig.callbackURL)}`);
      expect(url).toContain('response_type=code');
      expect(url).toContain('scope=profile+email');
      expect(url).toContain(`state=${state}`);
      expect(url).toContain('access_type=offline');
      expect(url).toContain('prompt=consent');
    });

    it('应该对回调URL进行URL编码', () => {
      const state = 'test-state';
      const url = service.generateAuthorizationURL(state);

      // 验证redirect_uri被正确编码
      const encodedCallback = encodeURIComponent(mockGoogleConfig.callbackURL);
      expect(url).toContain(`redirect_uri=${encodedCallback}`);
    });
  });

  describe('generateState', () => {
    it('应该生成格式为 uuid:timestamp 的state', () => {
      const state = service.generateState();

      // 验证格式: uuid:timestamp
      const parts = state.split(':');
      expect(parts.length).toBe(2);

      // 验证UUID格式 (36字符，包含4个连字符)
      const uuid = parts[0];
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );

      // 验证时间戳是有效数字
      const timestamp = parseInt(parts[1], 10);
      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('每次调用应该生成不同的state', () => {
      const state1 = service.generateState();
      const state2 = service.generateState();

      expect(state1).not.toBe(state2);
    });
  });

  describe('getAccessToken', () => {
    const mockCode = 'test_authorization_code';

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('应该成功获取access_token', async () => {
      const mockTokenResponse = {
        access_token: 'test_access_token',
        expires_in: 3600,
        refresh_token: 'test_refresh_token',
        scope: 'profile email',
        token_type: 'Bearer',
        id_token: 'test_id_token',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockTokenResponse),
      });

      const result = await service.getAccessToken(mockCode);

      expect(result).toEqual(mockTokenResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // 验证请求URL和方法
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];

      expect(calledUrl).toBe('https://oauth2.googleapis.com/token');
      expect(calledOptions.method).toBe('POST');
      expect(calledOptions.headers['Content-Type']).toBe('application/x-www-form-urlencoded');

      // 验证请求体包含正确参数
      const body = calledOptions.body;
      expect(body).toContain(`client_id=${mockGoogleConfig.clientID}`);
      expect(body).toContain(`client_secret=${mockGoogleConfig.clientSecret}`);
      expect(body).toContain(`code=${mockCode}`);
      expect(body).toContain('grant_type=authorization_code');
    });

    it('Google API返回错误时应该抛出UnauthorizedException', async () => {
      const mockErrorResponse = {
        error: 'invalid_grant',
        error_description: 'Code was already redeemed',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
      });

      await expect(service.getAccessToken(mockCode)).rejects.toThrow(UnauthorizedException);
    });

    it('网络请求失败时应该抛出UnauthorizedException', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getAccessToken(mockCode)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserInfo', () => {
    const mockAccessToken = 'test_access_token';

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('应该成功获取用户信息', async () => {
      const mockUserInfo = {
        id: 'google_user_id_123',
        email: 'test@gmail.com',
        verified_email: true,
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        picture: 'https://lh3.googleusercontent.com/avatar.jpg',
        locale: 'zh-CN',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUserInfo),
      });

      const result = await service.getUserInfo(mockAccessToken);

      expect(result).toEqual(mockUserInfo);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // 验证请求URL和Authorization header
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];

      expect(calledUrl).toBe('https://www.googleapis.com/oauth2/v2/userinfo');
      expect(calledOptions.headers.Authorization).toBe(`Bearer ${mockAccessToken}`);
    });

    it('API返回非200状态时应该抛出UnauthorizedException', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(service.getUserInfo(mockAccessToken)).rejects.toThrow(UnauthorizedException);
    });

    it('网络请求失败时应该抛出UnauthorizedException', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getUserInfo(mockAccessToken)).rejects.toThrow(UnauthorizedException);
    });
  });
});
