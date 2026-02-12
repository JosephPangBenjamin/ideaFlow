import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Notification, NotificationType } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async create(userId: string, dto: CreateNotificationDto): Promise<Notification | null> {
    const settings = await this.usersService.getNotificationSettings(userId);

    // Global toggle
    if (settings.globalLevel === 'none') {
      return null;
    }

    // "Important only" filter
    if (settings.globalLevel === 'important' && !this.isImportant(dto.type)) {
      return null;
    }

    // Specific type toggle
    const typeKey = dto.type as unknown as string;
    const settingsTypes = settings.types as Record<string, boolean>;
    if (settingsTypes && settingsTypes[typeKey] === false) {
      return null;
    }

    return this.prisma.notification.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string, dto: GetNotificationsDto) {
    const { isRead, page, pageSize } = dto;
    const where = {
      userId,
      ...(isRead !== undefined ? { isRead } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async markAsRead(userId: string, id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Story 8.3: 标记任务分配通知为已读
   * 当任务重新分配时，标记旧分配者的通知为已读
   * 注意：PostgreSQL 的 JSON 查询语法，使用 @> 操作符检查 JSON 字段包含
   */
  async markTaskAssignedNotificationsAsRead(taskId: string, userId: string) {
    return this.prisma.$queryRaw`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${userId}
        AND type = 'TASK_ASSIGNED'
        AND is_read = false
        AND data::jsonb @> ${JSON.stringify({ taskId })}::jsonb
    `;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async hasSentTodayByType(userId: string, type: NotificationType): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.prisma.notification.count({
      where: {
        userId,
        type,
        createdAt: { gte: today },
      },
    });
    return count > 0;
  }

  private isImportant(type: NotificationType): boolean {
    const importantTypes: NotificationType[] = [
      NotificationType.system,
      NotificationType.task_reminder,
      // Story 8.3: 任务分配通知是重要的
      NotificationType.TASK_ASSIGNED,
    ];
    return importantTypes.includes(type);
  }
}
