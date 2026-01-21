import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class StaleReminderService {
  private readonly logger = new Logger(StaleReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {}

  /**
   * 为所有拥有沉底想法的用户发送通知
   * 遵循防骚扰规则：每个用户每日最多发送一条提醒
   */
  async sendReminders(): Promise<void> {
    this.logger.log('准备发送沉底点子提醒通知...');

    // 获取所有拥有沉底点子的用户及其数量
    const usersWithStale = await this.prisma.idea.groupBy({
      by: ['userId'],
      where: {
        isStale: true,
        deletedAt: null,
      },
      _count: true,
    });

    if (usersWithStale.length === 0) {
      this.logger.log('没有发现需要提醒的用户。');
      return;
    }

    let sentCount = 0;

    for (const group of usersWithStale) {
      const { userId, _count: staleCount } = group;

      // 检查今天是否已经发送过提醒（防骚扰）
      const alreadySent = await this.notificationsService.hasSentTodayByType(
        userId,
        NotificationType.stale_reminder
      );

      if (alreadySent) {
        continue;
      }

      // 创建通知
      await this.notificationsService.create(userId, {
        type: NotificationType.stale_reminder,
        title: '沉底点子提醒',
        message: `你有 ${staleCount} 个想法放了超过 7 天，要不要看看？`,
        data: { staleCount },
      });

      sentCount++;
    }

    this.logger.log(`成功发送了 ${sentCount} 条沉底提醒通知。`);
  }
}
