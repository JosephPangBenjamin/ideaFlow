import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { GetIdeasFilterDto } from './dto/get-ideas-filter.dto';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createIdeaDto: CreateIdeaDto) {
    return this.prisma.idea.create({
      data: {
        content: createIdeaDto.content,
        sources: createIdeaDto.sources || undefined,
        userId,
      },
    });
  }

  async findAll(userId: string, filter: GetIdeasFilterDto = new GetIdeasFilterDto()) {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isStale,
    } = filter;
    const skip = (page - 1) * limit;

    const where: any = { userId, deletedAt: null }; // 只查询未删除的想法

    // 沉底筛选
    if (isStale !== undefined) {
      where.isStale = isStale;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.idea.findMany({
        where,
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
          canvas: {
            select: {
              id: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.idea.count({
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

  async findOne(userId: string, ideaId: string) {
    const idea = await this.prisma.idea.findUnique({
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

    if (!idea || idea.userId !== userId) {
      throw new NotFoundException('想法不存在');
    }

    // AC3: 点子一旦被点击（访问详情），应恢复为非沉底状态
    if (idea.isStale) {
      const updatedIdea = await this.prisma.idea.update({
        where: { id: ideaId },
        data: { isStale: false, updatedAt: new Date() },
      });
      return { data: { ...idea, ...updatedIdea } };
    }

    return { data: idea };
  }

  async update(userId: string, ideaId: string, updateIdeaDto: UpdateIdeaDto) {
    // First verify ownership
    await this.findOne(userId, ideaId);

    const updatedIdea = await this.prisma.idea.update({
      where: { id: ideaId },
      data: {
        ...updateIdeaDto,
        isStale: false, // AC3: 点子一旦被更新，应恢复为非沉底状态
      },
    });

    return { data: updatedIdea };
  }

  async remove(userId: string, ideaId: string) {
    // First verify ownership
    await this.findOne(userId, ideaId);

    await this.prisma.idea.delete({
      where: { id: ideaId },
    });

    return { message: '想法已删除' };
  }

  async updateVisibility(userId: string, ideaId: string, isPublic: boolean) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea || idea.userId !== userId) {
      throw new NotFoundException('想法不存在');
    }

    let publicToken = idea.publicToken;
    if (isPublic && !publicToken) {
      publicToken = randomUUID();
    } else if (!isPublic) {
      publicToken = null;
    }

    const updated = await this.prisma.idea.update({
      where: { id: ideaId },
      data: {
        isPublic,
        publicToken,
      },
    });

    return { data: updated };
  }

  async findByToken(token: string) {
    const idea = await this.prisma.idea.findUnique({
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

    if (!idea || !idea.isPublic) {
      throw new NotFoundException('该页面不存在或已设为私密');
    }

    // 过滤私密字段: 排除 sources 中的 note 字段
    const filteredSources = idea.sources
      ? (idea.sources as any[]).map((source) => {
          const { note, ...rest } = source;
          return rest;
        })
      : null;

    return {
      data: {
        ...idea,
        sources: filteredSources,
      },
    };
  }
}
