import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthConfigService } from './oauth-config.service';
import { randomUUID } from 'crypto';

/**
 * Google用户信息接口返回类型
 */
export interface GoogleUserInfo {
  id: string; // Google User ID (sub)
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

/**
 * Google access_token响应类型
 */
export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

/**
 * Google OAuth服务
 * 处理Google授权URL生成、code换取token、获取用户信息等逻辑
 */
@Injectable()
export class GoogleOAuthService {
  private readonly clientID: string;
  private readonly clientSecret: string;
  private readonly callbackURL: string;

  constructor(private readonly oauthConfigService: OAuthConfigService) {
    const config = this.oauthConfigService.getGoogleConfig();
    this.clientID = config.clientID || '';
    this.clientSecret = config.clientSecret || '';
    this.callbackURL = config.callbackURL || '';
  }

  /**
   * 生成Google授权URL
   * @param state CSRF防护的state参数
   * @returns Google授权页面URL
   */
  generateAuthorizationURL(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientID,
      redirect_uri: this.callbackURL,
      response_type: 'code',
      scope: 'profile email',
      state: state,
      access_type: 'offline', // 获取refresh_token
      prompt: 'consent', // 强制显示同意页面以获取refresh_token
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * 使用授权码换取access_token
   * @param code Google回调返回的授权码
   * @returns Google token响应
   */
  async getAccessToken(code: string): Promise<GoogleTokenResponse> {
    const url = 'https://oauth2.googleapis.com/token';

    const body = new URLSearchParams({
      client_id: this.clientID,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.callbackURL,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      const data = (await response.json()) as GoogleTokenResponse;

      // 检查Google API错误
      if (data.error) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: `Google授权失败: ${data.error_description || data.error}`,
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
        message: 'Google授权请求失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 获取Google用户信息
   * @param accessToken 访问令牌
   * @returns Google用户信息
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      if (!response.ok) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: '获取Google用户信息失败',
          timestamp: new Date().toISOString(),
        });
      }

      const data = (await response.json()) as GoogleUserInfo;

      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: '获取Google用户信息失败，请重试',
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
