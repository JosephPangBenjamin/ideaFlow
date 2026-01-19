import { Injectable, NotFoundException } from '@nestjs/common';
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
    } = filter;
    const skip = (page - 1) * limit;

    const where: any = { userId };

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

    return { data: idea };
  }

  async update(userId: string, ideaId: string, updateIdeaDto: UpdateIdeaDto) {
    // First verify ownership
    await this.findOne(userId, ideaId);

    const updatedIdea = await this.prisma.idea.update({
      where: { id: ideaId },
      data: updateIdeaDto,
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
}
