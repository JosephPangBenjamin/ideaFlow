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
        where: { userId },
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
        data: updateDto,
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
        data: updateDto,
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
});
