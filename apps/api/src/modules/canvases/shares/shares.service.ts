import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Permission, ShareStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';

/**
 * 分享 Token 长度
 * Nanoid: 16-32 字符，使用 21 字符作为默认值（类似 UUID 但更短）
 */
const SHARE_TOKEN_LENGTH = 21;

/**
 * Canvas Shares Service
 * Story 8.1: 画布分享链接
 */
@Injectable()
export class SharesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成唯一的分享 Token
   * 使用 Nanoid 生成安全、不可枚举的随机字符串
   */
  private generateShareToken(): string {
    return nanoid(SHARE_TOKEN_LENGTH);
  }

  /**
   * 创建分享链接
   */
  async create(userId: string, canvasId: string, createShareDto: CreateShareDto) {
    // 验证画布所有权
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas) {
      throw new NotFoundException('画布不存在');
    }

    if (canvas.userId !== userId) {
      throw new ForbiddenException('无权分享此画布');
    }

    // 生成唯一的 shareToken
    let shareToken: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shareToken = this.generateShareToken();
      const existing = await this.prisma.canvasShare.findUnique({
        where: { shareToken },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new BadRequestException('生成分享链接失败，请重试');
    }

    // 解析过期时间
    let expiresAt: Date | null = null;
    if (createShareDto.expiresAt) {
      expiresAt = new Date(createShareDto.expiresAt);
      if (expiresAt <= new Date()) {
        throw new BadRequestException('过期时间必须在未来');
      }
    }

    const share = await this.prisma.canvasShare.create({
      data: {
        canvasId,
        shareToken,
        permission: createShareDto.permission || Permission.VIEW_ONLY,
        expiresAt,
        createdBy: userId,
      },
    });

    // 埋点：记录分享链接创建事件
    await this.prisma.analyticsEvent.create({
      data: {
        eventName: 'link_created',
        userId,
        metadata: {
          shareId: share.id,
          canvasId,
          permission: share.permission,
        },
      },
    });

    // 构建分享 URL
    const shareUrl = `${process.env.WEB_URL || 'http://localhost:5173'}/shared/canvases/${shareToken}`;

    return {
      data: {
        ...share,
        shareUrl,
      },
    };
  }

  /**
   * 根据 Token 查找分享链接
   * 用于验证分享链接有效性
   */
  async findByToken(shareToken: string) {
    const share = await this.prisma.canvasShare.findUnique({
      where: { shareToken },
      include: {
        canvas: {
          include: {
            nodes: {
              include: {
                idea: {
                  select: {
                    id: true,
                    content: true,
                    sources: true,
                  },
                },
              },
            },
            connections: true,
          },
        },
      },
    });

    if (!share) {
      throw new NotFoundException('分享链接不存在');
    }

    // 检查状态
    if (share.status === ShareStatus.REVOKED) {
      throw new NotFoundException('分享链接已撤销');
    }

    // 检查过期时间
    if (share.expiresAt && new Date() > share.expiresAt) {
      // 埋点：记录分享链接过期事件
      await this.prisma.analyticsEvent
        .create({
          data: {
            eventName: 'link_expired',
            metadata: {
              shareId: share.id,
              canvasId: share.canvasId,
              expiresAt: share.expiresAt,
            },
          },
        })
        .catch(() => {}); // 非关键操作，忽略错误

      throw new NotFoundException('分享链接已过期');
    }

    // 埋点：记录分享链接访问事件
    await this.prisma.analyticsEvent
      .create({
        data: {
          eventName: 'link_accessed',
          metadata: {
            shareId: share.id,
            canvasId: share.canvasId,
            permission: share.permission,
          },
        },
      })
      .catch(() => {}); // 非关键操作，忽略错误

    return { data: share };
  }

  /**
   * 更新分享链接
   */
  async update(
    userId: string,
    canvasId: string,
    shareToken: string,
    updateShareDto: UpdateShareDto
  ) {
    // 验证画布所有权
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas || canvas.userId !== userId) {
      throw new NotFoundException('画布不存在或无权操作');
    }

    // 验证分享链接存在
    const share = await this.prisma.canvasShare.findUnique({
      where: { shareToken },
    });

    if (!share || share.canvasId !== canvasId) {
      throw new NotFoundException('分享链接不存在');
    }

    // 解析过期时间
    let expiresAt: Date | string | null | undefined = undefined;
    if (updateShareDto.expiresAt !== undefined) {
      if (updateShareDto.expiresAt === null) {
        expiresAt = null; // 清除过期时间
      } else {
        expiresAt = new Date(updateShareDto.expiresAt);
        if (expiresAt <= new Date()) {
          throw new BadRequestException('过期时间必须在未来');
        }
      }
    }

    const updated = await this.prisma.canvasShare.update({
      where: { shareToken },
      data: {
        ...(updateShareDto.permission !== undefined && {
          permission: updateShareDto.permission,
        }),
        ...(expiresAt !== undefined && { expiresAt }),
        ...(updateShareDto.status !== undefined && {
          status: updateShareDto.status,
        }),
      },
    });

    return { data: updated };
  }

  /**
   * 删除分享链接
   */
  async remove(userId: string, canvasId: string, shareToken: string) {
    // 验证画布所有权
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas || canvas.userId !== userId) {
      throw new NotFoundException('画布不存在或无权操作');
    }

    // 验证分享链接存在
    const share = await this.prisma.canvasShare.findUnique({
      where: { shareToken },
    });

    if (!share || share.canvasId !== canvasId) {
      throw new NotFoundException('分享链接不存在');
    }

    await this.prisma.canvasShare.delete({
      where: { shareToken },
    });

    return { message: '分享链接已删除' };
  }

  /**
   * 列出画布的所有分享链接
   */
  async findAll(userId: string, canvasId: string) {
    // 验证画布所有权
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas || canvas.userId !== userId) {
      throw new NotFoundException('画布不存在或无权操作');
    }

    const shares = await this.prisma.canvasShare.findMany({
      where: {
        canvasId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: shares.map((share: any) => ({
        ...share,
        shareUrl: `${process.env.WEB_URL || 'http://localhost:5173'}/shared/canvases/${share.shareToken}`,
      })),
    };
  }
}
