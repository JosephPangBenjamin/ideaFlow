import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { AnalyticsService } from '../analytics/analytics.service';
import { TeamsService } from '../teams/teams.service';

interface UserPayload {
  id: string;
  username: string;
  tokenVersion?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService,
    private readonly teamsService: TeamsService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password, inviteToken } = registerDto;

    // Check if username already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException({
        statusCode: 409,
        message: '该账号已注册',
        errors: [{ field: 'username', message: '用户名已存在' }],
        timestamp: new Date().toISOString(),
      });
    }

    // Hash password with bcrypt (cost=10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    // 如果提供了 inviteToken，自动加入团队
    let redirectUrl: string | undefined;
    let inviteWarning: string | undefined;
    if (inviteToken) {
      try {
        await this.teamsService.joinByShareToken(user.id, inviteToken);
        redirectUrl = `/shared/canvases/${inviteToken}`;
      } catch (error: any) {
        // 如果加入失败，记录错误但不阻止注册
        this.logger.error('Failed to join team:', error.message || error);
        // 返回警告信息，告知用户邀请链接无效
        inviteWarning = '注册成功，但未能加入团队（邀请链接可能已失效）';
        // 不抛出异常，用户可以正常注册，但不会自动加入
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      username: user.username,
      tokenVersion: (user as any).tokenVersion,
    });

    // Track registration event
    void this.analyticsService.track(
      {
        eventName: 'user_registered',
        metadata: { username: user.username, inviteToken: inviteToken || null },
      },
      user.id
    );

    const result: any = {
      data: {
        user: {
          id: user.id,
          username: user.username,
        },
        accessToken: tokens.accessToken,
      },
      refreshToken: tokens.refreshToken,
    };

    // 如果成功加入团队，返回重定向 URL
    if (redirectUrl) {
      result.data.redirectUrl = redirectUrl;
    }

    // 如果有邀请警告信息，添加到响应中
    if (inviteWarning) {
      result.data.warning = inviteWarning;
    }

    return result;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '账号或密码错误',
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ 检查用户是否有密码（第三方登录用户可能无密码）
    if (!user.password) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '该账号使用第三方登录，请使用微信或Google登录',
        timestamp: new Date().toISOString(),
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: '账号或密码错误',
        timestamp: new Date().toISOString(),
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      username: user.username,
      tokenVersion: (user as any).tokenVersion,
    });

    // Track login event
    void this.analyticsService.track(
      { eventName: 'user_logged_in', metadata: { username: user.username } },
      user.id
    );

    return {
      data: {
        user: {
          id: user.id,
          username: user.username,
        },
        accessToken: tokens.accessToken,
      },
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(payload: UserPayload) {
    const user = await this.usersService.findById(payload.id);
    if (user && (user as any).tokenVersion !== payload.tokenVersion) {
      return null;
    }
    return user;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'ideaflow-jwt-secret-dev';
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: secret,
      });
      const user = await this.usersService.findById(payload.id);
      if (!user || (user as any).tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException('Invalid token version');
      }
      return this.generateTokens({
        id: user.id,
        username: user.username,
        tokenVersion: (user as any).tokenVersion,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  /**
   * 生成JWT Token（供第三方登录使用）
   * @param user 用户对象
   * @returns { accessToken, refreshToken }
   */
  async generateTokensForUser(user: any) {
    return this.generateTokens({
      id: user.id,
      username: user.username,
      tokenVersion: (user as any).tokenVersion || 0,
    });
  }

  private async generateTokens(payload: UserPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async logout(_userId: string) {
    // Placeholder for future token blacklisting or revocation
    return;
  }
}
