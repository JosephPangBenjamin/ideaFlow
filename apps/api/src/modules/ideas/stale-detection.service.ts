// 沉底点子检测服务
// 每日凌晨 2:00 扫描并标记 7天+ 未操作的想法为沉底状态

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaleDetectionService {
  private readonly logger = new Logger(StaleDetectionService.name);
  private readonly STALE_THRESHOLD_DAYS = 7;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 定时任务：每日凌晨 2:00 执行沉底检测
   * 标记 7天+ 未操作的想法为沉底状态，恢复最近操作过的想法
   */
  @Cron('0 2 * * *')
  async handleStaleDetection(): Promise<{ staleCount: number; recoveredCount: number }> {
    this.logger.log('开始执行沉底点子检测...');

    const staleThreshold = new Date();
    staleThreshold.setDate(staleThreshold.getDate() - this.STALE_THRESHOLD_DAYS);

    // 批量更新：标记沉底的想法 + 恢复不再沉底的想法
    const [staleResult, recoveredResult] = await Promise.all([
      // 标记沉底：updatedAt < 7天前 且当前未标记为沉底
      this.prisma.idea.updateMany({
        where: {
          updatedAt: { lt: staleThreshold },
          isStale: false,
          deletedAt: null,
        },
        data: { isStale: true },
      }),
      // 恢复：updatedAt >= 7天前 且当前是沉底状态（仅处理未删除的想法）
      this.prisma.idea.updateMany({
        where: {
          updatedAt: { gte: staleThreshold },
          isStale: true,
          deletedAt: null, // 与标记沉底保持一致
        },
        data: { isStale: false },
      }),
    ]);

    this.logger.log(
      `沉底检测完成: ${staleResult.count} 个想法标记为沉底, ${recoveredResult.count} 个想法已恢复`
    );

    return {
      staleCount: staleResult.count,
      recoveredCount: recoveredResult.count,
    };
  }

  /**
   * 手动触发沉底检测（开发/测试用）
   */
  async runManualDetection(): Promise<{ staleCount: number; recoveredCount: number }> {
    return this.handleStaleDetection();
  }

  /**
   * 获取当前沉底想法数量
   */
  async getStaleCount(): Promise<number> {
    return this.prisma.idea.count({
      where: {
        isStale: true,
        deletedAt: null,
      },
    });
  }
}
