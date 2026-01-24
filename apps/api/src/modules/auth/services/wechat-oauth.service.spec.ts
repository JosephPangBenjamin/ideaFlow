import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { WechatOAuthService } from './wechat-oauth.service';
import { OAuthConfigService } from './oauth-config.service';

describe('WechatOAuthService', () => {
  let service: WechatOAuthService;
  let oauthConfigService: OAuthConfigService;

  const mockWechatConfig = {
    appId: 'test_app_id',
    appSecret: 'test_app_secret',
    callbackURL: 'http://localhost:3000/ideaFlow/api/v1/auth/wechat/callback',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WechatOAuthService,
        {
          provide: OAuthConfigService,
          useValue: {
            getWechatConfig: jest.fn().mockReturnValue(mockWechatConfig),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WechatOAuthService>(WechatOAuthService);
    oauthConfigService = module.get<OAuthConfigService>(OAuthConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAuthorizationURL', () => {
    it('应该生成正确的微信授权URL', () => {
      const state = 'test-state-123';
      const url = service.generateAuthorizationURL(state);

      // 验证URL基础路径
      expect(url).toContain('https://open.weixin.qq.com/connect/oauth2/authorize');

      // 验证必要参数
      expect(url).toContain(`appid=${mockWechatConfig.appId}`);
      expect(url).toContain(`redirect_uri=${encodeURIComponent(mockWechatConfig.callbackURL)}`);
      expect(url).toContain('response_type=code');
      expect(url).toContain('scope=snsapi_userinfo');
      expect(url).toContain(`state=${state}`);

      // 验证微信特殊后缀
      expect(url).toContain('#wechat_redirect');
    });

    it('应该对回调URL进行URL编码', () => {
      const state = 'test-state';
      const url = service.generateAuthorizationURL(state);

      // 验证redirect_uri被正确编码
      const encodedCallback = encodeURIComponent(mockWechatConfig.callbackURL);
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
      // 重置fetch mock
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('应该成功获取access_token', async () => {
      const mockTokenResponse = {
        access_token: 'test_access_token',
        expires_in: 7200,
        refresh_token: 'test_refresh_token',
        openid: 'test_openid',
        scope: 'snsapi_userinfo',
        unionid: 'test_unionid',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockTokenResponse),
      });

      const result = await service.getAccessToken(mockCode);

      expect(result).toEqual(mockTokenResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // 验证请求URL包含正确参数
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('api.weixin.qq.com/sns/oauth2/access_token');
      expect(calledUrl).toContain(`appid=${mockWechatConfig.appId}`);
      expect(calledUrl).toContain(`secret=${mockWechatConfig.appSecret}`);
      expect(calledUrl).toContain(`code=${mockCode}`);
      expect(calledUrl).toContain('grant_type=authorization_code');
    });

    it('微信API返回错误时应该抛出UnauthorizedException', async () => {
      const mockErrorResponse = {
        errcode: 40029,
        errmsg: 'invalid code',
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
    const mockOpenid = 'test_openid';

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('应该成功获取用户信息', async () => {
      const mockUserInfo = {
        openid: mockOpenid,
        nickname: '测试用户',
        sex: 1,
        province: '北京',
        city: '北京',
        country: '中国',
        headimgurl: 'https://example.com/avatar.jpg',
        privilege: [],
        unionid: 'test_unionid',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockUserInfo),
      });

      const result = await service.getUserInfo(mockAccessToken, mockOpenid);

      expect(result).toEqual(mockUserInfo);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // 验证请求URL包含正确参数
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain('api.weixin.qq.com/sns/userinfo');
      expect(calledUrl).toContain(`access_token=${mockAccessToken}`);
      expect(calledUrl).toContain(`openid=${mockOpenid}`);
      expect(calledUrl).toContain('lang=zh_CN');
    });

    it('微信API返回错误时应该抛出UnauthorizedException', async () => {
      const mockErrorResponse = {
        errcode: 40001,
        errmsg: 'invalid access_token',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
      });

      await expect(service.getUserInfo(mockAccessToken, mockOpenid)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('网络请求失败时应该抛出UnauthorizedException', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getUserInfo(mockAccessToken, mockOpenid)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
