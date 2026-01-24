import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthConfigService } from './oauth-config.service';
import { randomUUID } from 'crypto';

/**
 * 微信用户信息接口返回类型
 */
export interface WechatUserInfo {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}

/**
 * 微信access_token响应类型
 */
export interface WechatTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

/**
 * 微信OAuth服务
 * 处理微信授权URL生成、code换取token、获取用户信息等逻辑
 */
@Injectable()
export class WechatOAuthService {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly callbackURL: string;

  constructor(
    private readonly oauthConfigService: OAuthConfigService,
    private readonly configService: ConfigService
  ) {
    const config = this.oauthConfigService.getWechatConfig();
    this.appId = config.appId || '';
    this.appSecret = config.appSecret || '';
    this.callbackURL = config.callbackURL || '';
  }

  /**
   * 生成微信授权URL
   * @param state CSRF防护的state参数
   * @returns 微信授权页面URL
   */
  generateAuthorizationURL(state: string): string {
    const params = new URLSearchParams({
      appid: this.appId,
      redirect_uri: this.callbackURL,
      response_type: 'code',
      scope: 'snsapi_userinfo', // 获取用户信息权限
      state: state,
    });

    // 微信授权URL需要添加 #wechat_redirect 后缀
    return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
  }

  /**
   * 使用授权码换取access_token
   * @param code 微信回调返回的授权码
   * @returns 微信token响应
   */
  async getAccessToken(code: string): Promise<WechatTokenResponse> {
    const url = new URL('https://api.weixin.qq.com/sns/oauth2/access_token');
    url.searchParams.set('appid', this.appId);
    url.searchParams.set('secret', this.appSecret);
    url.searchParams.set('code', code);
    url.searchParams.set('grant_type', 'authorization_code');

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      const data = (await response.json()) as WechatTokenResponse;

      // 检查微信API错误
      if (data.errcode) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: `微信授权失败: ${data.errmsg || '未知错误'}`,
          timestamp: new Date().toISOString(),
        });
      }

      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: '微信授权请求失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 获取微信用户信息
   * @param accessToken 访问令牌
   * @param openid 用户openid
   * @returns 微信用户信息
   */
  async getUserInfo(accessToken: string, openid: string): Promise<WechatUserInfo> {
    const url = new URL('https://api.weixin.qq.com/sns/userinfo');
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('openid', openid);
    url.searchParams.set('lang', 'zh_CN');

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      const data = (await response.json()) as WechatUserInfo & {
        errcode?: number;
        errmsg?: string;
      };

      // 检查微信API错误
      if ((data as any).errcode) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: `获取微信用户信息失败: ${(data as any).errmsg || '未知错误'}`,
          timestamp: new Date().toISOString(),
        });
      }

      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: '获取微信用户信息失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 生成随机state用于CSRF防护
   * 格式: uuid:timestamp
   */
  generateState(): string {
    return `${randomUUID()}:${Date.now()}`;
  }
}
