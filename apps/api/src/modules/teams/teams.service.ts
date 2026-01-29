import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Permission, ShareStatus, MemberRole } from '@prisma/client';

/**
 * Teams Service
 * Story 8.2: 协作者注册加入
 */
@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过邀请链接加入团队
   * 用于已登录用户通过分享链接加入画布
   */
  async joinByShareToken(userId: string, shareToken: string) {
    // 查找分享链接
    const share = await this.prisma.canvasShare.findUnique({
      where: { shareToken },
    });

    if (!share || share.status !== ShareStatus.ACTIVE) {
      throw new NotFoundException('邀请链接无效或已过期');
    }

    // 检查使用次数限制
    if (share.maxUses && share.usedCount >= share.maxUses) {
      throw new ForbiddenException('邀请链接已达到使用上限');
    }

    // 检查是否已加入
    const existing = await this.prisma.teamMember.findUnique({
      where: {
        canvasId_userId: {
          userId,
          canvasId: share.canvasId,
        },
      },
    });

    if (existing) {
      return existing; // 已加入，直接返回
    }

    // 增加使用次数
    await this.prisma.canvasShare.update({
      where: { id: share.id },
      data: { usedCount: { increment: 1 } },
    });

    // 创建成员关系
    const member = await this.prisma.teamMember.create({
      data: {
        userId,
        canvasId: share.canvasId,
        shareId: share.id,
        teamId: share.teamId,
        role: share.permission === Permission.EDITABLE ? MemberRole.EDITOR : MemberRole.VIEWER,
      },
    });

    // 埋点：记录成员加入事件
    await this.prisma.analyticsEvent
      .create({
        data: {
          eventName: 'member_joined',
          userId,
          metadata: {
            memberId: member.id,
            canvasId: share.canvasId,
            shareId: share.id,
            role: member.role,
          },
        },
      })
      .catch(() => {}); // 非关键操作，忽略错误

    return member;
  }

  /**
   * 列出团队成员
   */
  async getTeamMembers(teamId: string) {
    const members = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return { data: members };
  }

  /**
   * 列出画布成员（包含通过分享链接加入的）
   */
  async getCanvasMembers(canvasId: string) {
    const members = await this.prisma.teamMember.findMany({
      where: { canvasId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return { data: members };
  }

  /**
   * 获取画布关联团队信息
   */
  async getCanvasTeamInfo(canvasId: string) {
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
      select: {
        id: true,
        name: true,
        userId: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!canvas) {
      throw new NotFoundException('画布不存在');
    }

    return {
      canvas: {
        id: canvas.id,
        name: canvas.name,
        owner: {
          id: canvas.userId,
        },
      },
      memberCount: canvas.members.length,
      members: canvas.members,
    };
  }
}
