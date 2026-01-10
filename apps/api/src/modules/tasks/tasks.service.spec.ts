import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const userId = 'user-1';
      const dto = { title: 'Test Task', ideaId: 'idea-1' };
      const expectedResult = { id: 'task-1', ...dto, userId, status: TaskStatus.todo };

      mockPrismaService.task.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, dto);
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          ideaId: dto.ideaId,
          userId,
        },
        include: { idea: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const userId = 'user-1';
      const tasks = [{ id: 'task-1', title: 'Task 1' }];
      mockPrismaService.task.findMany.mockResolvedValue(tasks);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findAll(userId);
      expect(result.data).toEqual(tasks);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists and belongs to user', async () => {
      const userId = 'user-1';
      const task = { id: 'task-1', userId };
      mockPrismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne(userId, 'task-1');
      expect(result.data).toEqual(task);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);
      await expect(service.findOne('user-1', 'invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update task including clearing dueDate', async () => {
      const userId = 'user-1';
      const taskId = 'task-1';
      const dto = { dueDate: null };
      const task = { id: taskId, userId };

      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({ ...task, dueDate: null });

      const result = await service.update(userId, taskId, dto);

      expect(result.data.dueDate).toBeNull();
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          dueDate: null,
        },
        include: { idea: true },
      });
    });

    it('should update task with valid dueDate string', async () => {
      const userId = 'user-1';
      const taskId = 'task-1';
      const dateStr = '2026-01-15T00:00:00.000Z';
      const dto = { dueDate: dateStr };
      const task = { id: taskId, userId };

      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({ ...task, dueDate: new Date(dateStr) });

      const result = await service.update(userId, taskId, dto);

      expect(result.data.dueDate).toBeInstanceOf(Date);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: {
          dueDate: new Date(dateStr),
        },
        include: { idea: true },
      });
    });
  });
});
