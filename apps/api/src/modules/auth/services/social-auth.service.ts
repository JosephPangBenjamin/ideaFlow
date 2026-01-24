import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../auth.service';

interface SocialProfile {
  nickname?: string;
  name?: string;
  avatar?: string;
  picture?: string;
  email?: string;
  emails?: Array<{ value: string; verified?: boolean }>;
}

/**
 * 第三方登录服务
 * 统一处理微信和Google等第三方账号的登录、绑定、解绑逻辑
 */
@Injectable()
export class SocialAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  /**
   * 查找或创建用户（第三方登录）
   * @param provider 第三方提供商 ('wechat' | 'google')
   * @param providerUserId 第三方用户ID (unionid for WeChat, sub for Google)
   * @param profile 第三方用户信息
   * @returns User对象
   */
  async findOrCreateUser(
    provider: 'wechat' | 'google',
    providerUserId: string,
    profile: SocialProfile
  ) {
    // 1. 查询是否已绑定
    const socialAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
      include: {
        user: true,
      },
    });

    if (socialAccount) {
      // 已绑定，直接返回用户
      return socialAccount.user;
    }

    // 2. Google邮箱冲突检查
    if (provider === 'google') {
      // 验证email存在且已验证
      const email = this.extractVerifiedEmail(profile);

      if (!email) {
        throw new BadRequestException('Google账号未提供已验证的邮箱');
      }

      // 检查邮箱是否已被其他用户使用
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException({
          statusCode: 409,
          message: '该邮箱已注册,请用原方式登录后绑定Google账号',
          errors: [{ field: 'email', message: '邮箱已被其他账号使用' }],
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 3. 未绑定，创建新用户并绑定
    const nickname = profile.nickname || profile.name || `${provider}_${Date.now()}`;
    const avatar = profile.avatar || profile.picture || null;
    const email =
      provider === 'google'
        ? profile.email ||
          (profile.emails?.[0]?.verified ? profile.emails[0].value : profile.emails?.[0]?.value)
        : null;

    const newUser = await this.prisma.user.create({
      data: {
        username: `${provider}_${Date.now()}_${providerUserId.slice(0, 6)}`, // 时间戳避免冲突
        phone: null,
        email: email || null,
        password: null, // 第三方登录用户无密码
        nickname: nickname,
        avatarUrl: avatar,
        socialAccounts: {
          create: {
            provider,
            providerUserId,
            profile: profile as any,
          },
        },
      },
    });

    return newUser;
  }

  /**
   * 已登录用户绑定第三方账号
   * @param userId 当前用户ID
   * @param provider 第三方提供商
   * @param providerUserId 第三方用户ID
   * @param profile 第三方用户信息
   */
  async linkAccount(
    userId: string,
    provider: 'wechat' | 'google',
    providerUserId: string,
    profile: SocialProfile
  ) {
    // 检查该第三方账号是否已被其他用户绑定
    const existingAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId,
        },
      },
    });

    if (existingAccount) {
      if (existingAccount.userId !== userId) {
        throw new ConflictException({
          statusCode: 409,
          message: '该第三方账号已被其他用户绑定',
          timestamp: new Date().toISOString(),
        });
      }
      // 已绑定给当前用户，直接返回
      return existingAccount;
    }

    // Google邮箱冲突检查（如果当前用户已有邮箱，且Google邮箱不同）
    if (provider === 'google') {
      const email = this.extractVerifiedEmail(profile);

      if (email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email },
        });

        if (existingUser && existingUser.id !== userId) {
          throw new ConflictException({
            statusCode: 409,
            message: '该邮箱已被其他账号使用',
            errors: [{ field: 'email', message: '邮箱已被其他账号使用' }],
            timestamp: new Date().toISOString(),
          });
        }

        // 更新用户邮箱（如果用户还没有邮箱）
        const currentUser = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (currentUser && !currentUser.email) {
          await this.prisma.user.update({
            where: { id: userId },
            data: { email },
          });
        }
      }
    }

    // 创建绑定
    return this.prisma.socialAccount.create({
      data: {
        userId,
        provider,
        providerUserId,
        profile: profile as any,
      },
    });
  }

  /**
   * 解绑第三方账号
   * @param userId 当前用户ID
   * @param provider 第三方提供商
   */
  async unlinkAccount(userId: string, provider: 'wechat' | 'google') {
    // 检查用户是否有密码
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialAccounts: true,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 计算解绑后剩余的登录方式
    const hasPassword = !!user.password;
    const currentSocialAccounts = user.socialAccounts || [];
    const currentProviderAccount = currentSocialAccounts.find((acc) => acc.provider === provider);

    if (!currentProviderAccount) {
      throw new BadRequestException('该第三方账号未绑定');
    }

    const remainingSocialAccounts = currentSocialAccounts.filter(
      (acc) => acc.provider !== provider
    );

    // 如果用户无密码且解绑后没有剩余第三方账号，禁止解绑
    if (!hasPassword && remainingSocialAccounts.length === 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: '请先设置密码',
        errors: [
          {
            field: 'password',
            message: '无法解绑最后一个第三方账号，请先设置密码',
          },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    // 删除绑定
    const deleted = await this.prisma.socialAccount.deleteMany({
      where: {
        userId,
        provider,
      },
    });

    if (deleted.count === 0) {
      throw new BadRequestException('该第三方账号未绑定');
    }

    return { message: '解绑成功' };
  }

  /**
   * 生成JWT Token（复用AuthService的方法）
   */
  async generateTokensForUser(user: any) {
    return this.authService.generateTokensForUser(user);
  }

  /**
   * 获取用户已绑定的第三方账号列表
   * @param userId 用户ID
   * @returns 已绑定的第三方账号列表
   */
  async getLinkedAccounts(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerUserId: true,
        profile: true,
        createdAt: true,
      },
    });

    return accounts.map((account) => ({
      id: account.id,
      provider: account.provider,
      // 从profile中提取显示信息
      nickname: (account.profile as any)?.nickname || (account.profile as any)?.name || null,
      avatar: (account.profile as any)?.avatar || (account.profile as any)?.picture || null,
      email: (account.profile as any)?.email || null,
      linkedAt: account.createdAt,
    }));
  }

  /**
   * 从 profile 中提取已验证的邮箱
   * 仅返回 verified 为 true 的邮箱
   */
  private extractVerifiedEmail(profile: SocialProfile): string | null {
    // 优先使用 emails 数组中已验证的邮箱
    if (profile.emails && Array.isArray(profile.emails)) {
      const verifiedEmail = profile.emails.find((e) => e.verified === true);
      if (verifiedEmail?.value) {
        return verifiedEmail.value;
      }
    }

    // 如果没有已验证的邮箱，不返回任何邮箱（安全优先）
    return null;
  }
}
