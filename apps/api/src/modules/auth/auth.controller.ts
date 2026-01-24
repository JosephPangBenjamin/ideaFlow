import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Get,
  Query,
  ForbiddenException,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { WechatOAuthService } from './services/wechat-oauth.service';
import { SocialAuthService } from './services/social-auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { OAuthStateService } from './services/oauth-state.service';
import { ConflictException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly wechatOAuthService: WechatOAuthService,
    private readonly socialAuthService: SocialAuthService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly oauthStateService: OAuthStateService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(registerDto);

    // Set refresh token as HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result.data;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto);

    // Set refresh token as HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result.data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const user = (req as any).user;
    if (user) {
      await this.authService.logout(user.id);
    }

    // Clear refresh token cookie
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: '退出成功' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshTokens(refreshToken);

    // Set refresh token as HttpOnly cookie
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken: result.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return (req as any).user;
  }

  // ==================== 微信OAuth端点 ====================

  /**
   * 微信登录入口
   * 重定向到微信授权页面
   * AC: 1 - 微信登录入口
   */
  @Get('wechat')
  async wechatLogin(@Res() response: Response) {
    // 生成state用于CSRF防护
    const state = this.wechatOAuthService.generateState();

    // 将state存储到Redis (AC: 8 - CSRF防护)
    await this.oauthStateService.storeState(state, 'wechat');

    // 生成微信授权URL并重定向
    const authorizationURL = this.wechatOAuthService.generateAuthorizationURL(state);
    response.redirect(authorizationURL);
  }

  /**
   * 微信回调处理
   * 接收微信授权回调，获取用户信息并登录
   * AC: 2, 3 - 微信授权流程和账号绑定逻辑
   */
  @Get('wechat/callback')
  async wechatCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // 验证必要参数
    if (!code) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '微信授权失败：未收到授权码',
        timestamp: new Date().toISOString(),
      });
    }

    // 验证state参数防止CSRF攻击 (AC: 8)
    const stateValidation = await this.oauthStateService.validateAndConsumeState(state, 'wechat');
    if (!stateValidation.valid) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'CSRF验证失败',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      // 1. 使用code换取access_token
      const tokenResponse = await this.wechatOAuthService.getAccessToken(code);

      // 2. 获取微信用户信息
      const userInfo = await this.wechatOAuthService.getUserInfo(
        tokenResponse.access_token,
        tokenResponse.openid
      );

      // 3. 使用unionid作为providerUserId（如果有），否则使用openid
      // 注意：unionid在多应用场景下是唯一的，openid仅在单应用内唯一
      const providerUserId = userInfo.unionid || userInfo.openid;

      // 4. 查找或创建用户
      const user = await this.socialAuthService.findOrCreateUser('wechat', providerUserId, {
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl,
      });

      // 5. 生成JWT Token
      const tokens = await this.socialAuthService.generateTokensForUser(user);

      // 6. 设置refresh token cookie
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 7. 重定向到前端回调页面，携带用户信息和token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const userParam = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          username: user.username,
          nickname: (user as any).nickname,
        })
      );
      const tokenParam = encodeURIComponent(tokens.accessToken);

      return response.redirect(
        `${frontendUrl}/#/oauth/callback?user=${userParam}&token=${tokenParam}`
      );
    } catch (error) {
      // 错误已经在WechatOAuthService中处理，这里直接抛出
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: '微信登录失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ==================== Google OAuth端点 ====================

  /**
   * Google登录入口
   * 重定向到Google授权页面
   * AC: 4 - Google登录入口
   */
  @Get('google')
  async googleLogin(@Res() response: Response) {
    // 生成state用于CSRF防护
    const state = this.googleOAuthService.generateState();

    // 将state存储到Redis (AC: 8 - CSRF防护)
    await this.oauthStateService.storeState(state, 'google');

    // 生成Google授权URL并重定向
    const authorizationURL = this.googleOAuthService.generateAuthorizationURL(state);
    response.redirect(authorizationURL);
  }

  /**
   * Google回调处理
   * 接收Google授权回调，获取用户信息并登录
   * AC: 5, 6 - Google授权流程和账号绑定逻辑
   */
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // 处理用户拒绝授权的情况
    if (error) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: error === 'access_denied' ? '您已取消Google授权' : `Google授权失败: ${error}`,
        timestamp: new Date().toISOString(),
      });
    }

    // 验证必要参数
    if (!code) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Google授权失败：未收到授权码',
        timestamp: new Date().toISOString(),
      });
    }

    // 验证state参数防止CSRF攻击 (AC: 8)
    const stateValidation = await this.oauthStateService.validateAndConsumeState(state, 'google');
    if (!stateValidation.valid) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'CSRF验证失败',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      // 1. 使用code换取access_token
      const tokenResponse = await this.googleOAuthService.getAccessToken(code);

      // 2. 获取Google用户信息
      const userInfo = await this.googleOAuthService.getUserInfo(tokenResponse.access_token);

      // 3. 验证邮箱已验证
      if (!userInfo.verified_email) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Google账号未验证邮箱',
          timestamp: new Date().toISOString(),
        });
      }

      // 4. 查找或创建用户 (使用Google User ID作为providerUserId)
      const user = await this.socialAuthService.findOrCreateUser('google', userInfo.id, {
        name: userInfo.name,
        email: userInfo.email,
        emails: [{ value: userInfo.email, verified: userInfo.verified_email }],
        picture: userInfo.picture,
      });

      // 5. 生成JWT Token
      const tokens = await this.socialAuthService.generateTokensForUser(user);

      // 6. 设置refresh token cookie
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 7. 重定向到前端回调页面，携带用户信息和token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const userParam = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          username: user.username,
          nickname: (user as any).nickname,
          email: (user as any).email,
        })
      );
      const tokenParam = encodeURIComponent(tokens.accessToken);

      return response.redirect(
        `${frontendUrl}/#/oauth/callback?user=${userParam}&token=${tokenParam}`
      );
    } catch (err) {
      // 处理邮箱冲突错误 (AC: 6)
      if (err instanceof ConflictException) {
        throw err;
      }
      // 错误已经在GoogleOAuthService中处理，这里直接抛出
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Google登录失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ==================== 第三方账号绑定/解绑端点 ====================

  /**
   * 获取已登录用户的关联账号列表
   * AC: 7 - 显示已绑定的第三方账号
   */
  @UseGuards(JwtAuthGuard)
  @Get('link')
  async getLinkedAccounts(@Req() req: Request) {
    const user = (req as any).user;
    const accounts = await this.socialAuthService.getLinkedAccounts(user.id);
    return { data: accounts };
  }

  /**
   * 绑定微信账号入口
   * 已登录用户重定向到微信OAuth，绑定成功后返回
   * AC: 7 - 未绑定显示「绑定微信」按钮
   */
  @UseGuards(JwtAuthGuard)
  @Get('link/wechat')
  async linkWechat(@Req() req: Request, @Res() response: Response) {
    const user = (req as any).user;
    const state = this.wechatOAuthService.generateState();

    // 将用户ID存储到Redis state中，用于回调时识别（安全方式）
    await this.oauthStateService.storeState(state, 'wechat', user.id);

    const authorizationURL = this.wechatOAuthService.generateAuthorizationURL(state);
    response.redirect(authorizationURL);
  }

  /**
   * 微信绑定回调
   * AC: 7 - 已登录用户绑定微信账号
   */
  @Get('link/wechat/callback')
  async linkWechatCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) response: Response
  ) {
    // 验证state参数并获取userId
    const stateValidation = await this.oauthStateService.validateAndConsumeState(state, 'wechat');
    if (!stateValidation.valid) {
      throw new ForbiddenException({
        statusCode: 403,
        message: stateValidation.error || 'CSRF验证失败',
        timestamp: new Date().toISOString(),
      });
    }

    const linkUserId = stateValidation.userId;
    if (!linkUserId) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '绑定会话已过期，请重新登录后再试',
        timestamp: new Date().toISOString(),
      });
    }

    if (!code) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '微信授权失败：未收到授权码',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const tokenResponse = await this.wechatOAuthService.getAccessToken(code);
      const userInfo = await this.wechatOAuthService.getUserInfo(
        tokenResponse.access_token,
        tokenResponse.openid
      );

      const providerUserId = userInfo.unionid || userInfo.openid;

      await this.socialAuthService.linkAccount(linkUserId, 'wechat', providerUserId, {
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl,
      });

      return { message: '微信账号绑定成功' };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: '微信账号绑定失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 绑定Google账号入口
   * AC: 7 - 未绑定显示「绑定Google」按钮
   */
  @UseGuards(JwtAuthGuard)
  @Get('link/google')
  async linkGoogle(@Req() req: Request, @Res() response: Response) {
    const user = (req as any).user;
    const state = this.googleOAuthService.generateState();

    // 将用户ID存储到Redis state中，用于回调时识别（安全方式）
    await this.oauthStateService.storeState(state, 'google', user.id);

    const authorizationURL = this.googleOAuthService.generateAuthorizationURL(state);
    response.redirect(authorizationURL);
  }

  /**
   * Google绑定回调
   * AC: 7 - 已登录用户绑定Google账号
   */
  @Get('link/google/callback')
  async linkGoogleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res({ passthrough: true }) response: Response
  ) {
    if (error) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: error === 'access_denied' ? '您已取消Google授权' : `Google授权失败: ${error}`,
        timestamp: new Date().toISOString(),
      });
    }

    // 验证state参数并获取userId
    const stateValidation = await this.oauthStateService.validateAndConsumeState(state, 'google');
    if (!stateValidation.valid) {
      throw new ForbiddenException({
        statusCode: 403,
        message: stateValidation.error || 'CSRF验证失败',
        timestamp: new Date().toISOString(),
      });
    }

    const linkUserId = stateValidation.userId;
    if (!linkUserId) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '绑定会话已过期，请重新登录后再试',
        timestamp: new Date().toISOString(),
      });
    }

    if (!code) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Google授权失败：未收到授权码',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const tokenResponse = await this.googleOAuthService.getAccessToken(code);
      const userInfo = await this.googleOAuthService.getUserInfo(tokenResponse.access_token);

      await this.socialAuthService.linkAccount(linkUserId, 'google', userInfo.id, {
        name: userInfo.name,
        email: userInfo.email,
        emails: [{ value: userInfo.email, verified: userInfo.verified_email }],
        picture: userInfo.picture,
      });

      return { message: 'Google账号绑定成功' };
    } catch (err) {
      if (err instanceof ConflictException || err instanceof BadRequestException) {
        throw err;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Google账号绑定失败，请重试',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * 解绑第三方账号
   * AC: 7 - 已绑定显示「解绑」按钮
   */
  @UseGuards(JwtAuthGuard)
  @Delete('link/:provider')
  @HttpCode(HttpStatus.OK)
  async unlinkAccount(@Param('provider') provider: string, @Req() req: Request) {
    const user = (req as any).user;

    if (provider !== 'wechat' && provider !== 'google') {
      throw new BadRequestException({
        statusCode: 400,
        message: '不支持的第三方账号类型',
        timestamp: new Date().toISOString(),
      });
    }

    return this.socialAuthService.unlinkAccount(user.id, provider);
  }
}
