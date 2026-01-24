import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { OAuthConfigService } from '../services/oauth-config.service';

/**
 * 微信OAuth策略
 * 使用passport-oauth2实现微信网页授权登录
 *
 * 微信OAuth2.0授权流程：
 * 1. 用户访问 GET /auth/wechat，重定向到微信授权页面
 * 2. 用户同意授权后，微信重定向到 GET /auth/wechat/callback?code=xxx&state=xxx
 * 3. 后端使用code换取access_token和用户信息
 */
@Injectable()
export class WechatStrategy extends PassportStrategy(Strategy, 'wechat') {
  constructor(private readonly oauthConfigService: OAuthConfigService) {
    const config = oauthConfigService.getWechatConfig();

    super({
      // 微信授权URL
      authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
      // 微信token获取URL
      tokenURL: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      clientID: config.appId || '',
      clientSecret: config.appSecret || '',
      callbackURL: config.callbackURL || '',
      // 微信需要的特殊参数
      customHeaders: {},
      // 禁用state验证（我们会在Controller中手动验证Redis中的state）
      state: false,
      // 微信使用appid和secret作为参数名
      passReqToCallback: true,
    });
  }

  /**
   * 验证回调，从微信API获取用户信息
   * 注意：微信OAuth2与标准OAuth2有差异，需要手动处理token交换
   */
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ): Promise<void> {
    try {
      // 微信返回的profile可能为空，需要从accessToken响应中获取openid
      // 然后调用用户信息API获取完整profile
      // 这里先返回基本信息，具体用户信息获取在Controller中处理
      const user = {
        accessToken,
        refreshToken,
        profile,
        provider: 'wechat' as const,
      };

      done(null, user);
    } catch (error) {
      done(new UnauthorizedException('微信授权验证失败'), undefined);
    }
  }
}

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
