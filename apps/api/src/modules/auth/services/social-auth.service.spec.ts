import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { SocialAuthService } from './social-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../auth.service';

describe('SocialAuthService', () => {
  let service: SocialAuthService;
  let prismaService: PrismaService;
  let authService: AuthService;

  const mockPrismaService = {
    socialAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAuthService = {
    generateTokensForUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialAuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<SocialAuthService>(SocialAuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreateUser', () => {
    describe('已绑定账号场景', () => {
      it('应该返回已绑定的用户', async () => {
        // Arrange
        const mockUser = {
          id: 'user-123',
          username: 'testuser',
        };
        const mockSocialAccount = {
          user: mockUser,
        };

        mockPrismaService.socialAccount.findUnique.mockResolvedValue(mockSocialAccount);

        // Act
        const result = await service.findOrCreateUser('wechat', 'unionid-123', {
          nickname: '测试用户',
        });

        // Assert
        expect(result).toEqual(mockUser);
        expect(mockPrismaService.socialAccount.findUnique).toHaveBeenCalledWith({
          where: {
            provider_providerUserId: {
              provider: 'wechat',
              providerUserId: 'unionid-123',
            },
          },
          include: {
            user: true,
          },
        });
        expect(mockPrismaService.user.create).not.toHaveBeenCalled();
      });
    });

    describe('创建新用户场景 - 微信', () => {
      it('应该创建新用户并绑定微信账号', async () => {
        // Arrange
        const mockNewUser = {
          id: 'new-user-123',
          username: 'wechat_1234567890_abc123',
          nickname: '微信用户',
          avatarUrl: 'https://wx.qlogo.cn/avatar.jpg',
        };

        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue(mockNewUser);

        // Act
        const result = await service.findOrCreateUser('wechat', 'wx-unionid-abc123', {
          nickname: '微信用户',
          avatar: 'https://wx.qlogo.cn/avatar.jpg',
        });

        // Assert
        expect(result).toEqual(mockNewUser);
        expect(mockPrismaService.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            phone: null,
            password: null,
            nickname: '微信用户',
            avatarUrl: 'https://wx.qlogo.cn/avatar.jpg',
            socialAccounts: {
              create: {
                provider: 'wechat',
                providerUserId: 'wx-unionid-abc123',
                profile: {
                  nickname: '微信用户',
                  avatar: 'https://wx.qlogo.cn/avatar.jpg',
                },
              },
            },
          }),
        });
      });

      it('微信用户没有昵称时应该使用默认昵称', async () => {
        // Arrange
        const mockNewUser = {
          id: 'new-user-456',
        };

        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue(mockNewUser);

        // Act
        await service.findOrCreateUser('wechat', 'wx-unionid-no-name', {});

        // Assert
        const createCall = mockPrismaService.user.create.mock.calls[0][0];
        expect(createCall.data.nickname).toMatch(/^wechat_\d+$/);
      });
    });

    describe('创建新用户场景 - Google', () => {
      it('应该创建新用户并绑定Google账号（带已验证邮箱）', async () => {
        // Arrange
        const mockNewUser = {
          id: 'google-user-123',
          username: 'google_1234567890_sub123',
          email: 'verified@gmail.com',
          nickname: 'Google User',
          avatarUrl: 'https://lh3.googleusercontent.com/avatar.jpg',
        };

        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue(mockNewUser);

        const profile = {
          name: 'Google User',
          picture: 'https://lh3.googleusercontent.com/avatar.jpg',
          email: 'verified@gmail.com',
          emails: [{ value: 'verified@gmail.com', verified: true }],
        };

        // Act
        const result = await service.findOrCreateUser('google', 'google-sub-123', profile);

        // Assert
        expect(result).toEqual(mockNewUser);
        expect(mockPrismaService.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            email: 'verified@gmail.com',
            nickname: 'Google User',
            avatarUrl: 'https://lh3.googleusercontent.com/avatar.jpg',
            password: null,
            socialAccounts: {
              create: {
                provider: 'google',
                providerUserId: 'google-sub-123',
                profile: profile,
              },
            },
          }),
        });
      });

      it('Google账号未提供已验证邮箱时应该抛出错误', async () => {
        // Arrange
        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);

        const profile = {
          name: 'No Email User',
          // 没有emails数组
        };

        // Act & Assert
        await expect(service.findOrCreateUser('google', 'google-sub-456', profile)).rejects.toThrow(
          new BadRequestException('Google账号未提供已验证的邮箱')
        );
      });

      it('Google账号邮箱未验证时应该抛出错误', async () => {
        // Arrange
        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);

        const profile = {
          name: 'Unverified User',
          email: 'unverified@gmail.com',
          emails: [{ value: 'unverified@gmail.com', verified: false }], // 未验证
        };

        // Act & Assert
        await expect(service.findOrCreateUser('google', 'google-sub-789', profile)).rejects.toThrow(
          new BadRequestException('Google账号未提供已验证的邮箱')
        );
      });

      it('应该使用emails数组中已验证的邮箱而非email字段', async () => {
        // Arrange
        const mockNewUser = { id: 'user-123' };

        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        mockPrismaService.user.create.mockResolvedValue(mockNewUser);

        // email字段是未验证的，emails数组中有已验证的邮箱
        const profile = {
          name: 'Mixed Email User',
          email: 'unverified@gmail.com',
          emails: [
            { value: 'unverified@gmail.com', verified: false },
            { value: 'verified@gmail.com', verified: true },
          ],
        };

        // Act
        await service.findOrCreateUser('google', 'google-sub-999', profile);

        // Assert - 应该使用 verified@gmail.com（已验证的）
        expect(mockPrismaService.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            email: 'verified@gmail.com',
          }),
        });
      });
    });

    describe('邮箱冲突场景 - Google', () => {
      it('邮箱已被其他用户使用时应该抛出ConflictException', async () => {
        // Arrange
        mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);

        const existingUser = {
          id: 'existing-user-123',
          email: 'existing@gmail.com',
        };
        mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

        const profile = {
          name: 'New User',
          email: 'new@gmail.com',
          emails: [{ value: 'existing@gmail.com', verified: true }], // 与现有用户邮箱冲突
        };

        // Act & Assert
        await expect(
          service.findOrCreateUser('google', 'google-sub-conflict', profile)
        ).rejects.toMatchObject({
          response: {
            statusCode: 409,
            message: '该邮箱已注册,请用原方式登录后绑定Google账号',
            errors: [{ field: 'email', message: '邮箱已被其他账号使用' }],
          },
        });
      });
    });
  });

  describe('linkAccount', () => {
    it('应该为当前用户绑定第三方账号', async () => {
      // Arrange
      const userId = 'user-123';
      const mockSocialAccount = {
        id: 'social-123',
        provider: 'wechat',
        providerUserId: 'wx-unionid-new',
      };

      mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId, email: null });
      mockPrismaService.socialAccount.create.mockResolvedValue(mockSocialAccount);

      // Act
      const result = await service.linkAccount(userId, 'wechat', 'wx-unionid-new', {
        nickname: '微信用户',
      });

      // Assert
      expect(result).toEqual(mockSocialAccount);
      expect(mockPrismaService.socialAccount.create).toHaveBeenCalledWith({
        data: {
          userId,
          provider: 'wechat',
          providerUserId: 'wx-unionid-new',
          profile: { nickname: '微信用户' },
        },
      });
    });

    it('该第三方账号已被其他用户绑定时应该抛出错误', async () => {
      // Arrange
      const userId = 'user-123';
      const existingAccount = {
        id: 'social-456',
        userId: 'other-user-789', // 其他用户
        provider: 'google',
        providerUserId: 'google-sub-existing',
      };

      mockPrismaService.socialAccount.findUnique.mockResolvedValue(existingAccount);

      // Act & Assert
      await expect(
        service.linkAccount(userId, 'google', 'google-sub-existing', {
          name: 'Other User',
        })
      ).rejects.toMatchObject({
        response: {
          statusCode: 409,
          message: '该第三方账号已被其他用户绑定',
        },
      });
    });

    it('已经绑定给当前用户时应该直接返回', async () => {
      // Arrange
      const userId = 'user-123';
      const existingAccount = {
        id: 'social-123',
        userId: userId, // 当前用户
        provider: 'wechat',
        providerUserId: 'wx-unionid-same',
      };

      mockPrismaService.socialAccount.findUnique.mockResolvedValue(existingAccount);

      // Act
      const result = await service.linkAccount(userId, 'wechat', 'wx-unionid-same', {
        nickname: '微信用户',
      });

      // Assert
      expect(result).toEqual(existingAccount);
      expect(mockPrismaService.socialAccount.create).not.toHaveBeenCalled();
    });

    it('Google绑定且用户无邮箱时应该更新用户邮箱', async () => {
      // Arrange
      const userId = 'user-123';
      const mockSocialAccount = {
        id: 'social-123',
        provider: 'google',
        providerUserId: 'google-sub-new',
      };

      mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce({ id: userId, email: null }) // 检查邮箱冲突
        .mockResolvedValueOnce({ id: userId, email: null }); // 获取当前用户
      mockPrismaService.user.update.mockResolvedValue({ id: userId, email: 'new@gmail.com' });
      mockPrismaService.socialAccount.create.mockResolvedValue(mockSocialAccount);

      const profile = {
        name: 'New User',
        emails: [{ value: 'new@gmail.com', verified: true }],
      };

      // Act
      await service.linkAccount(userId, 'google', 'google-sub-new', profile);

      // Assert
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { email: 'new@gmail.com' },
      });
    });

    it('Google绑定时邮箱已被其他用户使用应该抛出错误', async () => {
      // Arrange
      const userId = 'user-123';

      mockPrismaService.socialAccount.findUnique.mockResolvedValue(null);

      const existingUser = {
        id: 'other-user-456',
        email: 'existing@gmail.com',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const profile = {
        name: 'Conflict User',
        emails: [{ value: 'existing@gmail.com', verified: true }],
      };

      // Act & Assert
      await expect(
        service.linkAccount(userId, 'google', 'google-sub-conflict', profile)
      ).rejects.toMatchObject({
        response: {
          statusCode: 409,
          message: '该邮箱已被其他账号使用',
        },
      });
    });
  });

  describe('unlinkAccount', () => {
    it('应该成功解绑第三方账号', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        password: 'hashed-password',
        socialAccounts: [
          { provider: 'wechat', providerUserId: 'wx-123' },
          { provider: 'google', providerUserId: 'google-123' },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.socialAccount.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.unlinkAccount(userId, 'wechat');

      // Assert
      expect(result).toEqual({ message: '解绑成功' });
      expect(mockPrismaService.socialAccount.deleteMany).toHaveBeenCalledWith({
        where: { userId, provider: 'wechat' },
      });
    });

    it('用户不存在时应该抛出错误', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.unlinkAccount('non-existent-user', 'wechat')).rejects.toThrow(
        new BadRequestException('用户不存在')
      );
    });

    it('该第三方账号未绑定时应该抛出错误', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        password: 'hashed-password',
        socialAccounts: [{ provider: 'google', providerUserId: 'google-123' }], // 没有wechat
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.unlinkAccount(userId, 'wechat')).rejects.toThrow(
        new BadRequestException('该第三方账号未绑定')
      );
    });

    it('无密码用户解绑最后一个第三方账号时应该抛出错误', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        password: null, // 无密码
        socialAccounts: [{ provider: 'wechat', providerUserId: 'wx-123' }], // 只有一个第三方账号
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.unlinkAccount(userId, 'wechat')).rejects.toMatchObject({
        response: {
          statusCode: 400,
          message: '请先设置密码',
          errors: [
            {
              field: 'password',
              message: '无法解绑最后一个第三方账号，请先设置密码',
            },
          ],
        },
      });
    });

    it('有密码用户可以解绑最后一个第三方账号', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        password: 'hashed-password', // 有密码
        socialAccounts: [{ provider: 'wechat', providerUserId: 'wx-123' }], // 只有一个第三方账号
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.socialAccount.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.unlinkAccount(userId, 'wechat');

      // Assert - 应该成功解绑
      expect(result).toEqual({ message: '解绑成功' });
      expect(mockPrismaService.socialAccount.deleteMany).toHaveBeenCalled();
    });

    it('无密码用户有多个第三方账号时可以解绑其中一个', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        password: null, // 无密码
        socialAccounts: [
          { provider: 'wechat', providerUserId: 'wx-123' },
          { provider: 'google', providerUserId: 'google-123' }, // 还有另一个第三方账号
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.socialAccount.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.unlinkAccount(userId, 'wechat');

      // Assert - 应该成功解绑，因为还剩google账号
      expect(result).toEqual({ message: '解绑成功' });
      expect(mockPrismaService.socialAccount.deleteMany).toHaveBeenCalledWith({
        where: { userId, provider: 'wechat' },
      });
    });
  });

  describe('getLinkedAccounts', () => {
    it('应该返回用户已绑定的第三方账号列表', async () => {
      // Arrange
      const userId = 'user-123';
      const mockAccounts = [
        {
          id: 'social-1',
          provider: 'wechat',
          providerUserId: 'wx-unionid-123',
          profile: {
            nickname: '微信用户',
            avatar: 'https://wx.qlogo.cn/avatar.jpg',
          },
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'social-2',
          provider: 'google',
          providerUserId: 'google-sub-456',
          profile: {
            name: 'Google User',
            picture: 'https://lh3.googleusercontent.com/photo.jpg',
            email: 'user@gmail.com',
          },
          createdAt: new Date('2024-01-02'),
        },
      ];

      mockPrismaService.socialAccount.findMany.mockResolvedValue(mockAccounts);

      // Act
      const result = await service.getLinkedAccounts(userId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'social-1',
        provider: 'wechat',
        nickname: '微信用户',
        avatar: 'https://wx.qlogo.cn/avatar.jpg',
        email: null,
        linkedAt: mockAccounts[0].createdAt,
      });
      expect(result[1]).toEqual({
        id: 'social-2',
        provider: 'google',
        nickname: 'Google User',
        avatar: 'https://lh3.googleusercontent.com/photo.jpg',
        email: 'user@gmail.com',
        linkedAt: mockAccounts[1].createdAt,
      });
    });

    it('没有绑定账号时应该返回空数组', async () => {
      // Arrange
      mockPrismaService.socialAccount.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getLinkedAccounts('user-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('profile中没有昵称时应该使用name字段', async () => {
      // Arrange
      const mockAccount = {
        id: 'social-1',
        provider: 'google',
        providerUserId: 'google-sub-789',
        profile: {
          name: 'User With Name', // 有name但没有nickname
          picture: 'https://example.com/avatar.jpg',
        },
        createdAt: new Date('2024-01-01'),
      };

      mockPrismaService.socialAccount.findMany.mockResolvedValue([mockAccount]);

      // Act
      const result = await service.getLinkedAccounts('user-123');

      // Assert
      expect(result[0].nickname).toBe('User With Name');
    });

    it('profile中既没有昵称也没有name时应该返回null', async () => {
      // Arrange
      const mockAccount = {
        id: 'social-1',
        provider: 'wechat',
        providerUserId: 'wx-unionid-999',
        profile: {
          // 没有nickname和name
          avatar: 'https://example.com/avatar.jpg',
        },
        createdAt: new Date('2024-01-01'),
      };

      mockPrismaService.socialAccount.findMany.mockResolvedValue([mockAccount]);

      // Act
      const result = await service.getLinkedAccounts('user-123');

      // Assert
      expect(result[0].nickname).toBeNull();
    });
  });

  describe('generateTokensForUser', () => {
    it('应该调用AuthService的generateTokensForUser方法', async () => {
      // Arrange
      const mockUser = { id: 'user-123', username: 'testuser' };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.generateTokensForUser.mockResolvedValue(mockTokens);

      // Act
      const result = await service.generateTokensForUser(mockUser);

      // Assert
      expect(result).toEqual(mockTokens);
      expect(mockAuthService.generateTokensForUser).toHaveBeenCalledWith(mockUser);
    });
  });
});
