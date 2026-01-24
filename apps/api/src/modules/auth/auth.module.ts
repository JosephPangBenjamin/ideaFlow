import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { OAuthConfigService } from './services/oauth-config.service';
import { SocialAuthService } from './services/social-auth.service';
import { WechatOAuthService } from './services/wechat-oauth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { OAuthStateService } from './services/oauth-state.service';
import { WechatStrategy } from './strategies/wechat.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    AnalyticsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'ideaflow-jwt-secret-dev',
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    OAuthConfigService,
    SocialAuthService,
    WechatOAuthService,
    GoogleOAuthService,
    OAuthStateService,
    WechatStrategy,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    JwtModule,
    OAuthConfigService,
    SocialAuthService,
    WechatOAuthService,
    GoogleOAuthService,
    OAuthStateService,
  ],
})
export class AuthModule {}
