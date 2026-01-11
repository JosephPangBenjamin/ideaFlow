import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const userId = 'user-1';
      const dto = { name: 'Work', color: '#ff0000' };
      const expectedResult = { id: 'cat-1', ...dto, userId };

      mockPrismaService.category.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, dto);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      const userId = 'user-1';
      const categories = [{ id: 'cat-1', name: 'Work', userId }];

      mockPrismaService.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll(userId);

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual({ data: categories });
    });
  });

  describe('update', () => {
    it('should update a category if owned by user', async () => {
      const userId = 'user-1';
      const catId = 'cat-1';
      const dto = { name: 'Urgent' };
      const category = { id: catId, name: 'Work', userId };
      const updatedCategory = { id: catId, name: 'Urgent', userId };

      mockPrismaService.category.findUnique.mockResolvedValue(category);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.update(userId, catId, dto);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: catId },
        data: dto,
      });
      expect(result).toEqual({ data: updatedCategory });
    });

    it('should throw NotFoundException if category not found or not owned', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.update('user-1', 'cat-1', { name: 'Urgent' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove a category if owned by user', async () => {
      const userId = 'user-1';
      const catId = 'cat-1';
      const category = { id: catId, name: 'Work', userId };

      mockPrismaService.category.findUnique.mockResolvedValue(category);
      mockPrismaService.category.delete.mockResolvedValue(category);

      const result = await service.remove(userId, catId);

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: catId },
      });
      expect(result).toEqual({ message: '分类已删除' });
    });
  });
});
