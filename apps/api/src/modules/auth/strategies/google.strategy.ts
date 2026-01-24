import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OAuthConfigService } from '../services/oauth-config.service';

/**
 * Google OAuth 策略
 * 使用 passport-google-oauth20 实现 Google Sign-In 登录
 *
 * Google OAuth 2.0 流程：
 * 1. 用户访问 GET /auth/google，重定向到 Google 授权页面
 * 2. 用户同意授权后，Google 重定向到 GET /auth/google/callback?code=xxx&state=xxx
 * 3. Passport 自动验证 code 并调用 validate 方法
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly oauthConfigService: OAuthConfigService) {
    const config = oauthConfigService.getGoogleConfig();

    super({
      clientID: config.clientID || '',
      clientSecret: config.clientSecret || '',
      callbackURL: config.callbackURL || '',
      scope: ['profile', 'email'], // 获取用户信息和邮箱
    });
  }

  /**
   * 验证回调，Passport 自动获取用户信息
   * @param accessToken Google access token
   * @param refreshToken Google refresh token
   * @param profile Google 用户信息
   * @param done Passport 回调函数
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ): Promise<void> {
    try {
      // 验证邮箱已验证
      const email = profile.emails?.[0];
      if (!email || !email.verified) {
        return done(
          new UnauthorizedException({
            statusCode: 401,
            message: 'Google账号未提供已验证的邮箱',
            timestamp: new Date().toISOString(),
          }),
          undefined
        );
      }

      // 构造用户信息
      const user = {
        provider: 'google' as const,
        providerUserId: profile.id, // Google User ID (sub)
        profile: {
          id: profile.id,
          name: profile.displayName,
          email: email.value,
          emails: [{ value: email.value, verified: email.verified }],
          picture: profile.photos?.[0]?.value,
        },
        accessToken,
        refreshToken,
      };

      done(null, user);
    } catch (error) {
      done(new UnauthorizedException('Google授权验证失败'), undefined);
    }
  }
}
