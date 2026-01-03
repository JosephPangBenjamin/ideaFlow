import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createIdeaDto: CreateIdeaDto) {
    return this.prisma.idea.create({
      data: {
        content: createIdeaDto.content,
        source: createIdeaDto.source || undefined,
        userId,
      },
    });
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.idea.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.idea.count({
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

  async findOne(userId: string, ideaId: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
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
