import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * SearchService 单元测试
 * 验证全局搜索功能的核心逻辑
 */
describe('SearchService', () => {
  let service: SearchService;
  let prisma: PrismaService;

  // 模拟数据
  const mockUserId = 'test-user-id';
  const mockIdeas = [
    { id: 'idea-1', content: '学习 TypeScript 的核心概念', createdAt: new Date() },
    { id: 'idea-2', content: 'TypeScript 与 JavaScript 的区别', createdAt: new Date() },
  ];
  const mockTasks = [
    {
      id: 'task-1',
      title: 'TypeScript 项目',
      description: '完成项目搭建',
      status: 'todo',
      createdAt: new Date(),
    },
    {
      id: 'task-2',
      title: '学习计划',
      description: 'TypeScript 入门学习',
      status: 'in_progress',
      createdAt: new Date(),
    },
  ];

  // 模拟 Prisma 服务
  const mockPrismaService = {
    idea: {
      findMany: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<SearchService>(SearchService);
    prisma = module.get<PrismaService>(PrismaService);

    // 重置 mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('应返回匹配的想法和任务', async () => {
      // 准备模拟数据
      mockPrismaService.idea.findMany.mockResolvedValue(mockIdeas);
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.search(mockUserId, 'TypeScript');

      expect(result).toEqual({
        ideas: mockIdeas,
        tasks: mockTasks,
      });
    });

    it('应使用正确的查询参数搜索想法', async () => {
      mockPrismaService.idea.findMany.mockResolvedValue([]);
      mockPrismaService.task.findMany.mockResolvedValue([]);

      await service.search(mockUserId, 'test');

      expect(mockPrismaService.idea.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          content: { contains: 'test', mode: 'insensitive' },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
    });

    it('应使用正确的查询参数搜索任务（标题或描述）', async () => {
      mockPrismaService.idea.findMany.mockResolvedValue([]);
      mockPrismaService.task.findMany.mockResolvedValue([]);

      await service.search(mockUserId, 'test');

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
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
      });
    });

    it('应返回空结果当没有匹配时', async () => {
      mockPrismaService.idea.findMany.mockResolvedValue([]);
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.search(mockUserId, 'nonexistent');

      expect(result).toEqual({
        ideas: [],
        tasks: [],
      });
    });

    it('应并行执行想法和任务搜索', async () => {
      // 使用延迟来验证并行执行
      mockPrismaService.idea.findMany.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockIdeas), 50))
      );
      mockPrismaService.task.findMany.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTasks), 50))
      );

      const startTime = Date.now();
      await service.search(mockUserId, 'test');
      const duration = Date.now() - startTime;

      // 如果是并行执行，总时间应接近 50ms 而非 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
