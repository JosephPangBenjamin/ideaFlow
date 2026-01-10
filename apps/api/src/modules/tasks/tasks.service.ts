import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        category: createTaskDto.category,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
        ideaId: createTaskDto.ideaId,
        userId,
      },
      include: { idea: true },
    });
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where: { userId },
        include: { idea: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({
        where: { userId },
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
      include: { idea: true },
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
        dueDate:
          updateTaskDto.dueDate === null
            ? null
            : updateTaskDto.dueDate
              ? new Date(updateTaskDto.dueDate)
              : undefined,
      },
      include: { idea: true },
    });

    return { data: updatedTask };
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
