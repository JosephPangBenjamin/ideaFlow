import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * 搜索结果项 - 想法
 */
export interface SearchIdea {
  id: string;
  content: string;
  createdAt: Date;
}

/**
 * 搜索结果项 - 任务
 */
export interface SearchTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
}

/**
 * 搜索结果响应格式
 */
export interface SearchResult {
  ideas: SearchIdea[];
  tasks: SearchTask[];
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * 执行全局搜索，同时搜索想法和任务
   * 使用 ILIKE (case-insensitive) 进行模糊匹配
   * 每类结果最多返回 10 条，按创建时间降序排序
   *
   * @param userId 用户 ID
   * @param query 搜索关键词
   * @returns 搜索结果（想法和任务分组）
   */
  async search(userId: string, query: string): Promise<SearchResult> {
    const startTime = Date.now();

    // 并行执行想法和任务搜索
    const [ideas, tasks] = await Promise.all([
      // 搜索想法：匹配 content 字段
      this.prisma.idea.findMany({
        where: {
          userId,
          content: { contains: query, mode: 'insensitive' },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      }),
      // 搜索任务：匹配 title 或 description 字段
      this.prisma.task.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const duration = Date.now() - startTime;
    this.logger.log(
      `搜索完成: "${query}" - ${ideas.length} 想法, ${tasks.length} 任务 (${duration}ms)`
    );

    // 记录性能警告（如果超过 300ms）
    if (duration > 300) {
      this.logger.warn(`搜索响应时间超过阈值: ${duration}ms > 300ms`);
    }

    return { ideas, tasks };
  }
}
