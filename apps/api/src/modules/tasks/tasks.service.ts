import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as dayjs from 'dayjs';
import { GetTasksFilterDto, TaskView } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: this.prepareDueDate(createTaskDto.dueDate),
        ideaId: createTaskDto.ideaId,
        categoryId: createTaskDto.categoryId,
        sources: createTaskDto.sources,
        userId,
      },
      include: { idea: true, category: true },
    });
  }

  async findAll(userId: string, filter: GetTasksFilterDto = new GetTasksFilterDto()) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      status,
      view,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    // Apply status filter
    if (status) {
      where.status = status;
    }

    // Apply category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Apply view filter
    if (view) {
      switch (view) {
        case TaskView.today:
          where.dueDate = {
            gte: dayjs().startOf('day').toDate(),
            lte: dayjs().endOf('day').toDate(),
          };
          break;
        case TaskView.upcoming:
          where.dueDate = {
            gt: dayjs().endOf('day').toDate(),
          };
          break;
        case TaskView.personal:
          // Personal view means categoryId is null (Inbox)
          // If a specific categoryId is requested via filter, it conflicts with "Inbox".
          // Instead of overwriting the filter (which shows the whole Inbox),
          // we should return empty to respect the user's specific category request.
          if (where.categoryId) {
            where.categoryId = { in: [] }; // Impossible condition -> Empty result
          } else {
            where.categoryId = null;
          }
          break;
        case TaskView.project:
          if (!where.categoryId) {
            where.categoryId = { not: null };
          }
          break;
      }
    }

    // Apply date range filter (on dueDate)
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) {
        where.dueDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.dueDate.lte = new Date(endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: { idea: true, category: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.task.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { idea: true, category: true },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException('任务不存在');
    }

    return { data: task };
  }

  async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    // First verify ownership
    await this.findOne(userId, taskId);

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateTaskDto,
        dueDate: this.prepareDueDate(updateTaskDto.dueDate),
      },
      include: { idea: true, category: true },
    });

    return { data: updatedTask };
  }

  private prepareDueDate(dueDate: string | null | undefined): Date | null | undefined {
    if (dueDate === null) return null;
    if (dueDate === undefined) return undefined;
    return new Date(dueDate);
  }

  async remove(userId: string, taskId: string) {
    // First verify ownership
    await this.findOne(userId, taskId);

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { message: '任务已删除' };
  }
}
