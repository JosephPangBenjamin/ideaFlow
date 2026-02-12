import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as dayjs from 'dayjs';
import { GetTasksFilterDto, TaskView } from './dto/get-tasks-filter.dto';
import { NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    // Story 8.3: 注入 NotificationsService（模块已正确配置）
    private notificationsService: NotificationsService
  ) {}

  /**
   * Story 8.3: 验证团队成员关系
   * 当任务关联画布时，只能分配给团队成员
   * @throws BadRequestException 当分配给非团队成员时
   */
  private async validateTeamMember(assigneeId: string, canvasId: string | null): Promise<void> {
    // 个人任务（无 canvasId）可以分配给任何人
    if (!canvasId) {
      return;
    }

    // 团队任务：验证分配者是否是团队成员
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        canvasId_userId: {
          userId: assigneeId,
          canvasId: canvasId,
        },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('无法分配给非团队成员');
    }
  }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    // Story 8.3: 分配验证
    if (createTaskDto.assigneeId) {
      const isValidMember = await this.validateTeamMember(
        createTaskDto.assigneeId,
        createTaskDto.canvasId || null
      );

      if (!isValidMember) {
        throw new BadRequestException('无法分配给非团队成员');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: this.prepareDueDate(createTaskDto.dueDate),
        ideaId: createTaskDto.ideaId,
        categoryId: createTaskDto.categoryId,
        sources: createTaskDto.sources,
        userId,
        // Story 8.3: 添加任务分配字段
        canvasId: createTaskDto.canvasId,
        assigneeId: createTaskDto.assigneeId,
      },
      include: { idea: true, category: true, assignee: true, canvas: true },
    });

    // Story 8.3: 创建任务分配通知（跳过分配给自己）
    if (task.assigneeId && task.assigneeId !== userId) {
      await this.notificationsService.create(task.assigneeId, {
        type: NotificationType.TASK_ASSIGNED,
        title: '任务分配',
        message: `任务"${task.title}"已分配给您`,
        data: { taskId: task.id, canvasId: task.canvasId },
      });

      // 埋点：任务分配事件
      await this.prisma.analyticsEvent
        .create({
          data: {
            eventName: 'task_assigned',
            userId: userId,
            metadata: {
              taskId: task.id,
              assigneeId: task.assigneeId,
              canvasId: task.canvasId,
            },
          },
        })
        .catch((error) => {
          this.logger.warn(`Failed to create analytics event: ${error.message}`);
        });
    }

    return task;
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
      // Story 8.3: 分配筛选字段
      assigneeId,
      createdBy,
    } = filter;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null }; // 包含软删除过滤

    // Story 8.3: 创建者筛选（用于 "我创建的" 和 "我分配的"）
    if (createdBy === 'me') {
      where.userId = userId;
    } else if (createdBy) {
      where.userId = createdBy;
    }

    // Story 8.3: 分配者筛选（用于 "分配给我的"）
    if (assigneeId === 'me') {
      where.assigneeId = userId;
    } else if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    // 如果没有指定创建者或分配者，默认只显示用户创建的任务（保持向后兼容）
    if (!createdBy && !assigneeId) {
      where.userId = userId;
    }

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
        include: { idea: true, category: true, assignee: true, canvas: true }, // Story 8.3: 添加关联
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
    // Story 8.3: 允许分配者查看任务
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { idea: true, category: true, assignee: true, canvas: true },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：任务创建者或分配者可以查看
    const isCreator = task.userId === userId;
    const isAssignee = task.assigneeId === userId;

    if (!isCreator && !isAssignee) {
      throw new NotFoundException('任务不存在');
    }

    return { data: task };
  }

  async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    // Story 8.3: 获取原任务信息（包含分配信息）
    const existingTask = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { canvas: true },
    });

    if (!existingTask) {
      throw new NotFoundException('任务不存在');
    }

    // 权限检查：只有任务创建者可以修改
    if (existingTask.userId !== userId) {
      throw new ForbiddenException('只有任务创建者可以修改任务');
    }

    // Story 8.3: 分配验证
    if (updateTaskDto.assigneeId !== undefined) {
      // 只有设置了 assigneeId（非 null）才需要验证
      if (updateTaskDto.assigneeId !== null) {
        const canvasId =
          updateTaskDto.canvasId !== undefined ? updateTaskDto.canvasId : existingTask.canvasId;
        const isValidMember = await this.validateTeamMember(updateTaskDto.assigneeId, canvasId);

        if (!isValidMember) {
          throw new BadRequestException('无法分配给非团队成员');
        }
      }

      // Story 8.3: 分配变更时标记旧通知为已读
      if (existingTask.assigneeId && updateTaskDto.assigneeId !== existingTask.assigneeId) {
        await this.notificationsService.markTaskAssignedNotificationsAsRead(
          taskId,
          existingTask.assigneeId
        );

        // 埋点：分配变更事件
        await this.prisma.analyticsEvent
          .create({
            data: {
              eventName: 'assignee_changed',
              userId: userId,
              metadata: {
                taskId: taskId,
                oldAssigneeId: existingTask.assigneeId,
                newAssigneeId: updateTaskDto.assigneeId,
              },
            },
          })
          .catch((error) => {
            this.logger.warn(`Failed to create analytics event: ${error.message}`);
          });
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateTaskDto,
        dueDate: this.prepareDueDate(updateTaskDto.dueDate),
      },
      include: { idea: true, category: true, assignee: true, canvas: true },
    });

    // Story 8.3: 创建任务分配通知（跳过分配给自己）
    if (
      updatedTask.assigneeId &&
      updatedTask.assigneeId !== existingTask.assigneeId &&
      updatedTask.assigneeId !== userId
    ) {
      await this.notificationsService.create(updatedTask.assigneeId, {
        type: NotificationType.TASK_ASSIGNED,
        title: '任务分配',
        message: `任务"${updatedTask.title}"已分配给您`,
        data: { taskId: updatedTask.id, canvasId: updatedTask.canvasId },
      });
    }

    return { data: updatedTask };
  }

  private prepareDueDate(dueDate: string | null | undefined): Date | null | undefined {
    if (dueDate === null) return null;
    if (dueDate === undefined) return undefined;
    return new Date(dueDate);
  }

  async remove(userId: string, taskId: string) {
    // 权限检查：只有任务创建者可以删除（不允许分配者删除）
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('只有任务创建者可以删除任务');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { message: '任务已删除' };
  }
}
