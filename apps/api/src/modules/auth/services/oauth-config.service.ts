import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * OAuth配置服务
 * 统一管理微信和Google OAuth配置
 */
@Injectable()
export class OAuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 获取微信OAuth配置
   */
  getWechatConfig() {
    return {
      appId: this.configService.get<string>('WECHAT_APP_ID'),
      appSecret: this.configService.get<string>('WECHAT_APP_SECRET'),
      callbackURL: this.configService.get<string>('WECHAT_CALLBACK_URL'),
    };
  }

  /**
   * 获取Google OAuth配置
   */
  getGoogleConfig() {
    return {
      clientID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    };
  }

  /**
   * 获取Redis配置
   */
  getRedisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    };
  }
}
