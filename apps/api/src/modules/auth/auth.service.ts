import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { AnalyticsService } from '../analytics/analytics.service';

interface UserPayload {
  id: string;
  username: string;
  tokenVersion?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

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

    // Generate tokens
    const tokens = await this.generateTokens({
      id: user.id,
      username: user.username,
      tokenVersion: (user as any).tokenVersion,
    });

    // Track registration event
    void this.analyticsService.track(
      { eventName: 'user_registered', metadata: { username: user.username } },
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
