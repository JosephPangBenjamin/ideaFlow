import { Test, TestingModule } from '@nestjs/testing';
import { IdeasService } from './ideas.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('IdeasService', () => {
  let service: IdeasService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeasService,
        {
          provide: PrismaService,
          useValue: {
            idea: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<IdeasService>(IdeasService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an idea', async () => {
      const userId = 'user-1';
      const createIdeaDto = { content: 'Test Idea' };
      const expectedIdea = {
        id: 'idea-1',
        content: createIdeaDto.content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.create as jest.Mock).mockResolvedValue(expectedIdea);

      const result = await service.create(userId, createIdeaDto);

      expect(prisma.idea.create).toHaveBeenCalledWith({
        data: {
          content: createIdeaDto.content,
          userId,
          sources: undefined,
        },
      });
      expect(result).toEqual(expectedIdea);
    });
  });

  describe('findAll', () => {
    const userId = 'user-1';
    const mockIdeas = [
      {
        id: '1',
        content: 'Idea 1',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      },
      {
        id: '2',
        content: 'Idea 2',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      },
    ];
    const total = 2;

    it('should return paginated ideas with default options', async () => {
      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      const result = await service.findAll(userId);

      expect(prisma.idea.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null }, // 沉底筛选更新：排除已删除的想法
        include: {
          tasks: { select: { id: true, status: true } },
          canvas: { select: { id: true } },
        },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });

    it('should filter by date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(userId, { startDate, endDate });

      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            deletedAt: null, // 沉底筛选更新：排除已删除的想法
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        })
      );
    });

    it('should apply sorting parameters', async () => {
      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(userId, { sortBy: 'updatedAt', sortOrder: 'asc' });

      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { updatedAt: 'asc' },
        })
      );
    });

    // 沉底筛选测试 - AC5
    it('should filter by isStale=true', async () => {
      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(userId, { isStale: true });

      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            deletedAt: null,
            isStale: true,
          },
        })
      );
    });

    it('should filter by isStale=false', async () => {
      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(userId, { isStale: false });

      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            deletedAt: null,
            isStale: false,
          },
        })
      );
    });

    it('should not include isStale filter when undefined', async () => {
      (prisma.idea.findMany as jest.Mock).mockResolvedValue(mockIdeas);
      (prisma.idea.count as jest.Mock).mockResolvedValue(total);

      await service.findAll(userId, {});

      expect(prisma.idea.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            deletedAt: null,
          },
        })
      );
      // 确保 isStale 没有被添加到 where 条件
      const callArgs = (prisma.idea.findMany as jest.Mock).mock.calls[0][0];
      expect(callArgs.where.isStale).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return an idea by id for the owner', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const expectedIdea = {
        id: ideaId,
        content: 'Test Idea',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(expectedIdea);

      const result = await service.findOne(userId, ideaId);

      expect(prisma.idea.findUnique).toHaveBeenCalledWith({
        where: { id: ideaId },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
              title: true,
              description: true,
              category: true,
              dueDate: true,
              createdAt: true,
            },
          },
          canvas: {
            select: {
              id: true,
            },
          },
        },
      });
      expect(result).toEqual({ data: expectedIdea });
    });

    it('should throw NotFoundException if idea does not exist', async () => {
      const userId = 'user-1';
      const ideaId = 'non-existent';

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId, ideaId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if idea belongs to another user', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const otherUserIdea = {
        id: ideaId,
        content: 'Other User Idea',
        userId: 'user-2', // Different user
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(otherUserIdea);

      await expect(service.findOne(userId, ideaId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an idea content', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const updateDto = { content: 'Updated Content' };
      const existingIdea = {
        id: ideaId,
        content: 'Original Content',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };
      const updatedIdea = { ...existingIdea, ...updateDto, updatedAt: new Date() };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.update as jest.Mock).mockResolvedValue(updatedIdea);

      const result = await service.update(userId, ideaId, updateDto);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: { ...updateDto, isStale: false },
      });
      expect(result).toEqual({ data: updatedIdea });
    });

    it('should update an idea sources', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const updateDto = { sources: [{ type: 'link', url: 'https://example.com' }] };
      const existingIdea = {
        id: ideaId,
        content: 'Test Idea',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };
      const updatedIdea = { ...existingIdea, ...updateDto, updatedAt: new Date() };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.update as jest.Mock).mockResolvedValue(updatedIdea);

      const result = await service.update(userId, ideaId, updateDto);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: { ...updateDto, isStale: false },
      });
      expect(result).toEqual({ data: updatedIdea });
    });

    it('should throw NotFoundException if idea does not exist', async () => {
      const userId = 'user-1';
      const ideaId = 'non-existent';
      const updateDto = { content: 'Updated' };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, ideaId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if idea belongs to another user', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const updateDto = { content: 'Updated' };
      const otherUserIdea = {
        id: ideaId,
        content: 'Other User Idea',
        userId: 'user-2', // Different user
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(otherUserIdea);

      await expect(service.update(userId, ideaId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an idea successfully', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const existingIdea = {
        id: ideaId,
        content: 'Test Idea',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.delete as jest.Mock).mockResolvedValue(existingIdea);

      const result = await service.remove(userId, ideaId);

      expect(prisma.idea.delete).toHaveBeenCalledWith({
        where: { id: ideaId },
      });
      expect(result).toEqual({ message: '想法已删除' });
    });

    it('should throw NotFoundException if idea does not exist', async () => {
      const userId = 'user-1';
      const ideaId = 'non-existent';

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId, ideaId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if idea belongs to another user', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const otherUserIdea = {
        id: ideaId,
        content: 'Other User Idea',
        userId: 'user-2', // Different user
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: null,
        deletedAt: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(otherUserIdea);

      await expect(service.remove(userId, ideaId)).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== Story 7.1: 可见性功能测试 ====================

  describe('updateVisibility', () => {
    it('should generate publicToken when setting to public', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const existingIdea = {
        id: ideaId,
        userId,
        isPublic: false,
        publicToken: null,
      };
      const updatedIdea = {
        ...existingIdea,
        isPublic: true,
        publicToken: 'generated-uuid-token',
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.update as jest.Mock).mockResolvedValue(updatedIdea);

      const result = await service.updateVisibility(userId, ideaId, true);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: {
          isPublic: true,
          publicToken: expect.any(String), // 验证生成了 Token
        },
      });
      expect(result.data.isPublic).toBe(true);
      expect(result.data.publicToken).toBeTruthy();
    });

    it('should clear publicToken when setting to private', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const existingIdea = {
        id: ideaId,
        userId,
        isPublic: true,
        publicToken: 'existing-token',
      };
      const updatedIdea = {
        ...existingIdea,
        isPublic: false,
        publicToken: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.update as jest.Mock).mockResolvedValue(updatedIdea);

      const result = await service.updateVisibility(userId, ideaId, false);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: {
          isPublic: false,
          publicToken: null, // 验证清空了 Token
        },
      });
      expect(result.data.isPublic).toBe(false);
      expect(result.data.publicToken).toBeNull();
    });

    it('should throw NotFoundException if idea does not exist', async () => {
      const userId = 'user-1';
      const ideaId = 'non-existent';

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateVisibility(userId, ideaId, true)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user is not the owner', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const otherUserIdea = {
        id: ideaId,
        userId: 'user-2',
        isPublic: false,
        publicToken: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(otherUserIdea);

      await expect(service.updateVisibility(userId, ideaId, true)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should reuse existing publicToken when already public', async () => {
      const userId = 'user-1';
      const ideaId = 'idea-1';
      const existingToken = 'existing-uuid-token';
      const existingIdea = {
        id: ideaId,
        userId,
        isPublic: true,
        publicToken: existingToken,
      };
      const updatedIdea = {
        ...existingIdea,
        isPublic: true,
        publicToken: existingToken, // 保持不变
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.idea.update as jest.Mock).mockResolvedValue(updatedIdea);

      const result = await service.updateVisibility(userId, ideaId, true);

      expect(prisma.idea.update).toHaveBeenCalledWith({
        where: { id: ideaId },
        data: {
          isPublic: true,
          publicToken: existingToken, // 验证重用了现有 Token
        },
      });
      expect(result.data.publicToken).toBe(existingToken);
    });
  });

  describe('findByToken', () => {
    it('should return public idea by token', async () => {
      const token = 'valid-public-token';
      const publicIdea = {
        id: 'idea-1',
        content: 'Public Idea',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        sources: [
          { type: 'link', url: 'https://example.com', note: '私密笔记' },
          { type: 'text', content: 'Some text', note: '另一个私密笔记' },
        ],
        tasks: [],
        canvas: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(publicIdea);

      const result = await service.findByToken(token);

      expect(prisma.idea.findUnique).toHaveBeenCalledWith({
        where: { publicToken: token },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
              title: true,
              description: true,
              category: true,
              dueDate: true,
              createdAt: true,
            },
          },
          canvas: {
            select: {
              id: true,
            },
          },
        },
      });
      expect(result.data.id).toBe('idea-1');
    });

    it('should filter out note field from sources in public view', async () => {
      const token = 'valid-public-token';
      const publicIdea = {
        id: 'idea-1',
        content: 'Public Idea',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        sources: [
          { type: 'link', url: 'https://example.com', title: 'Example', note: '私密笔记' },
          { type: 'text', content: 'Some text', note: '另一个私密笔记' },
        ],
        tasks: [],
        canvas: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(publicIdea);

      const result = await service.findByToken(token);

      // 验证返回的 sources 不包含 note 字段
      expect(result.data.sources).toEqual([
        { type: 'link', url: 'https://example.com', title: 'Example' },
        { type: 'text', content: 'Some text' },
      ]);
      // 确保原始数据的 note 字段已被移除
      result.data.sources!.forEach((source: any) => {
        expect(source.note).toBeUndefined();
      });
    });

    it('should throw NotFoundException if token does not exist', async () => {
      const token = 'non-existent-token';

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findByToken(token)).rejects.toThrow(NotFoundException);
      await expect(service.findByToken(token)).rejects.toThrow('该页面不存在或已设为私密');
    });

    it('should throw NotFoundException if idea is not public', async () => {
      const token = 'valid-token';
      const privateIdea = {
        id: 'idea-1',
        content: 'Private Idea',
        userId: 'user-1',
        isPublic: false, // 已设为私密
        publicToken: token,
        sources: [],
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(privateIdea);

      await expect(service.findByToken(token)).rejects.toThrow(NotFoundException);
      await expect(service.findByToken(token)).rejects.toThrow('该页面不存在或已设为私密');
    });

    it('should handle idea with null sources', async () => {
      const token = 'valid-public-token';
      const publicIdea = {
        id: 'idea-1',
        content: 'Public Idea',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        sources: null,
        tasks: [],
        canvas: null,
      };

      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(publicIdea);

      const result = await service.findByToken(token);

      expect(result.data.sources).toBeNull();
    });
  });
});
