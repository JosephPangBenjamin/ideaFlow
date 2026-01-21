// 沉底点子检测服务 - 单元测试

import { Test, TestingModule } from '@nestjs/testing';
import { StaleDetectionService } from './stale-detection.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StaleDetectionService', () => {
  let service: StaleDetectionService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    idea: {
      updateMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaleDetectionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StaleDetectionService>(StaleDetectionService);
    prismaService = module.get<PrismaService>(PrismaService);

    // 重置所有 mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleStaleDetection', () => {
    it('应该标记沉底想法并恢复活跃想法', async () => {
      // Arrange: 模拟 Prisma 返回结果
      mockPrismaService.idea.updateMany
        .mockResolvedValueOnce({ count: 5 }) // 标记沉底
        .mockResolvedValueOnce({ count: 2 }); // 恢复活跃

      // Act: 执行沉底检测
      const result = await service.handleStaleDetection();

      // Assert: 验证返回结果
      expect(result.staleCount).toBe(5);
      expect(result.recoveredCount).toBe(2);

      // Assert: 验证 Prisma 调用
      expect(mockPrismaService.idea.updateMany).toHaveBeenCalledTimes(2);

      // 验证第一次调用（标记沉底）
      const firstCall = mockPrismaService.idea.updateMany.mock.calls[0][0];
      expect(firstCall.where.isStale).toBe(false);
      expect(firstCall.where.deletedAt).toBeNull();
      expect(firstCall.data.isStale).toBe(true);

      // 验证第二次调用（恢复）
      const secondCall = mockPrismaService.idea.updateMany.mock.calls[1][0];
      expect(secondCall.where.isStale).toBe(true);
      expect(secondCall.data.isStale).toBe(false);
    });

    it('应该使用正确的 7 天阈值', async () => {
      // Arrange
      mockPrismaService.idea.updateMany.mockResolvedValue({ count: 0 });
      const now = new Date();
      const expectedThreshold = new Date();
      expectedThreshold.setDate(now.getDate() - 7);

      // Act
      await service.handleStaleDetection();

      // Assert: 验证阈值计算正确（允许 1 秒误差）
      const staleCall = mockPrismaService.idea.updateMany.mock.calls[0][0];
      const thresholdDate = staleCall.where.updatedAt.lt as Date;

      const timeDiff = Math.abs(thresholdDate.getTime() - expectedThreshold.getTime());
      expect(timeDiff).toBeLessThan(1000); // 1 秒内误差
    });

    it('处理无沉底想法的情况', async () => {
      // Arrange
      mockPrismaService.idea.updateMany.mockResolvedValue({ count: 0 });

      // Act
      const result = await service.handleStaleDetection();

      // Assert
      expect(result.staleCount).toBe(0);
      expect(result.recoveredCount).toBe(0);
    });
  });

  describe('runManualDetection', () => {
    it('应该调用 handleStaleDetection', async () => {
      // Arrange
      mockPrismaService.idea.updateMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await service.runManualDetection();

      // Assert
      expect(result).toBeDefined();
      expect(mockPrismaService.idea.updateMany).toHaveBeenCalledTimes(2);
    });
  });

  describe('getStaleCount', () => {
    it('应该返回沉底想法数量', async () => {
      // Arrange
      mockPrismaService.idea.count.mockResolvedValue(10);

      // Act
      const count = await service.getStaleCount();

      // Assert
      expect(count).toBe(10);
      expect(mockPrismaService.idea.count).toHaveBeenCalledWith({
        where: {
          isStale: true,
          deletedAt: null,
        },
      });
    });
  });
});
