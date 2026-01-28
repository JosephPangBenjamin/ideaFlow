import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SharesService } from './shares.service';
import { Permission, ShareStatus } from '@prisma/client';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'mockToken1234567890ABCDEF',
}));

describe('SharesService', () => {
  let service: SharesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    canvasShare: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    canvas: {
      findUnique: jest.fn(),
    },
    analyticsEvent: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SharesService>(SharesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a share link with VIEW_ONLY permission by default', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const canvasData = { id: canvasId, userId: 'user-123' };
      const shareData = {
        id: 'share-123',
        canvasId,
        shareToken: 'mockToken1234567890ABCDEF',
        permission: Permission.VIEW_ONLY,
        status: ShareStatus.ACTIVE,
        createdBy: userId,
        createdAt: new Date(),
      };

      mockPrismaService.canvas.findUnique.mockResolvedValue(canvasData);
      mockPrismaService.canvasShare.create.mockResolvedValue(shareData);
      mockPrismaService.analyticsEvent.create.mockResolvedValue({});

      await service.create(userId, canvasId, {});

      expect(prisma.canvasShare.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          canvasId,
          permission: Permission.VIEW_ONLY,
          createdBy: userId,
        }),
      });
      expect(prisma.analyticsEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventName: 'link_created',
          userId,
          metadata: expect.objectContaining({
            canvasId,
          }),
        }),
      });
    });

    it('should throw ForbiddenException if user does not own canvas', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const canvasData = { id: canvasId, userId: 'other-user' };

      mockPrismaService.canvas.findUnique.mockResolvedValue(canvasData);

      await expect(service.create(userId, canvasId, {})).rejects.toThrow(
        new ForbiddenException('无权分享此画布')
      );
    });

    it('should validate expiresAt is in the future', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const canvasData = { id: canvasId, userId: 'user-123' };

      mockPrismaService.canvas.findUnique.mockResolvedValue(canvasData);

      const pastDate = new Date(Date.now() - 10000).toISOString();

      await expect(service.create(userId, canvasId, { expiresAt: pastDate })).rejects.toThrow(
        new BadRequestException('过期时间必须在未来')
      );
    });
  });

  describe('findByToken', () => {
    it('should return share data for valid token', async () => {
      const shareToken = 'mockToken1234567890ABCDEF';
      const shareData = {
        id: 'share-123',
        canvasId: 'canvas-123',
        shareToken,
        permission: Permission.VIEW_ONLY,
        status: ShareStatus.ACTIVE,
        canvas: {},
      };

      mockPrismaService.canvasShare.findUnique.mockResolvedValue(shareData);
      mockPrismaService.analyticsEvent.create.mockResolvedValue({});

      const result = await service.findByToken(shareToken);

      expect(result.data).toEqual(shareData);
      expect(prisma.analyticsEvent.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if token not found', async () => {
      mockPrismaService.canvasShare.findUnique.mockResolvedValue(null);

      await expect(service.findByToken('invalid-token')).rejects.toThrow(
        new NotFoundException('分享链接不存在')
      );
    });

    it('should throw NotFoundException if share is revoked', async () => {
      const shareToken = 'mockToken1234567890ABCDEF';
      const shareData = {
        id: 'share-123',
        status: ShareStatus.REVOKED,
        canvas: {},
      };

      mockPrismaService.canvasShare.findUnique.mockResolvedValue(shareData);

      await expect(service.findByToken(shareToken)).rejects.toThrow(
        new NotFoundException('分享链接已撤销')
      );
    });

    it('should throw NotFoundException if share is expired', async () => {
      const shareToken = 'mockToken1234567890ABCDEF';
      const shareData = {
        id: 'share-123',
        expiresAt: new Date(Date.now() - 1000),
        status: ShareStatus.ACTIVE,
        canvas: {},
      };

      mockPrismaService.canvasShare.findUnique.mockResolvedValue(shareData);
      mockPrismaService.analyticsEvent.create.mockResolvedValue({});

      await expect(service.findByToken(shareToken)).rejects.toThrow(
        new NotFoundException('分享链接已过期')
      );
      expect(prisma.analyticsEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventName: 'link_expired',
        }),
      });
    });
  });

  describe('update', () => {
    it('should update share permission and status', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const shareToken = 'mockToken1234567890ABCDEF';
      const canvasData = { id: canvasId, userId: 'user-123' };
      const shareData = { id: 'share-123', canvasId };

      mockPrismaService.canvas.findUnique.mockResolvedValueOnce(canvasData);
      mockPrismaService.canvasShare.findUnique.mockResolvedValueOnce(shareData);
      mockPrismaService.canvasShare.update.mockResolvedValue({
        ...shareData,
        permission: Permission.EDITABLE,
      });

      await service.update(userId, canvasId, shareToken, {
        permission: Permission.EDITABLE,
      });

      expect(prisma.canvasShare.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete share link', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const shareToken = 'mockToken1234567890ABCDEF';
      const canvasData = { id: canvasId, userId: 'user-123' };
      const shareData = { id: 'share-123', canvasId };

      mockPrismaService.canvas.findUnique.mockResolvedValueOnce(canvasData);
      mockPrismaService.canvasShare.findUnique.mockResolvedValueOnce(shareData);
      mockPrismaService.canvasShare.delete.mockResolvedValue(undefined);

      await service.remove(userId, canvasId, shareToken);

      expect(prisma.canvasShare.delete).toHaveBeenCalledWith({
        where: { shareToken },
      });
    });
  });

  describe('findAll', () => {
    it('should return all shares for a canvas with shareUrl', async () => {
      const userId = 'user-123';
      const canvasId = 'canvas-123';
      const canvasData = { id: canvasId, userId: 'user-123' };
      const sharesData = [
        {
          id: 'share-1',
          canvasId,
          shareToken: 'mockToken1234567890ABCDEF',
          permission: Permission.VIEW_ONLY,
          status: ShareStatus.ACTIVE,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.canvas.findUnique.mockResolvedValue(canvasData);
      mockPrismaService.canvasShare.findMany.mockResolvedValue(sharesData);

      const result = await service.findAll(userId, canvasId);

      // Service adds shareUrl property, so we only check the original data is included
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: 'share-1',
          canvasId,
          shareToken: 'mockToken1234567890ABCDEF',
          permission: Permission.VIEW_ONLY,
        })
      );
      expect(result.data[0]).toHaveProperty('shareUrl');
    });
  });
});
