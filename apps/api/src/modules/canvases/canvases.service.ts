import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Injectable()
export class CanvasesService {
  constructor(private prisma: PrismaService) {}

  // Canvas CRUD operations
  async create(userId: string, createCanvasDto: CreateCanvasDto) {
    const canvas = await this.prisma.canvas.create({
      data: {
        name: createCanvasDto.name || '未命名画布',
        userId,
      },
      include: {
        nodes: true,
      },
    });

    return { data: canvas };
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.canvas.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { nodes: true },
          },
        },
      }),
      this.prisma.canvas.count({
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

  async findOne(userId: string, canvasId: string) {
    const canvas = await this.prisma.canvas.findUnique({
      where: { id: canvasId },
      include: {
        nodes: {
          include: {
            idea: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });

    if (!canvas) {
      throw new NotFoundException('画布不存在');
    }

    if (canvas.userId !== userId) {
      throw new ForbiddenException('无权访问此画布');
    }

    return { data: canvas };
  }

  async update(userId: string, canvasId: string, updateCanvasDto: UpdateCanvasDto) {
    // Verify ownership
    await this.findOne(userId, canvasId);

    const canvas = await this.prisma.canvas.update({
      where: { id: canvasId },
      data: updateCanvasDto,
      include: {
        nodes: true,
      },
    });

    return { data: canvas };
  }

  async remove(userId: string, canvasId: string) {
    // Verify ownership
    await this.findOne(userId, canvasId);

    await this.prisma.canvas.delete({
      where: { id: canvasId },
    });

    return { message: '画布已删除' };
  }

  // Node operations
  async addNode(userId: string, canvasId: string, createNodeDto: CreateNodeDto) {
    // Verify canvas ownership
    await this.findOne(userId, canvasId);

    // Verify idea ownership
    const idea = await this.prisma.idea.findUnique({
      where: { id: createNodeDto.ideaId },
    });

    if (!idea || idea.userId !== userId) {
      throw new NotFoundException('想法不存在');
    }

    const node = await this.prisma.canvasNode.create({
      data: {
        canvasId,
        ideaId: createNodeDto.ideaId,
        x: createNodeDto.x,
        y: createNodeDto.y,
        width: createNodeDto.width || 180,
        height: createNodeDto.height || 80,
      },
      include: {
        idea: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    return { data: node };
  }

  async updateNode(userId: string, nodeId: string, updateNodeDto: UpdateNodeDto) {
    const node = await this.prisma.canvasNode.findUnique({
      where: { id: nodeId },
      include: {
        canvas: true,
      },
    });

    if (!node) {
      throw new NotFoundException('节点不存在');
    }

    if (node.canvas.userId !== userId) {
      throw new ForbiddenException('无权修改此节点');
    }

    const updatedNode = await this.prisma.canvasNode.update({
      where: { id: nodeId },
      data: updateNodeDto,
      include: {
        idea: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    return { data: updatedNode };
  }

  async removeNode(userId: string, nodeId: string) {
    const node = await this.prisma.canvasNode.findUnique({
      where: { id: nodeId },
      include: {
        canvas: true,
      },
    });

    if (!node) {
      throw new NotFoundException('节点不存在');
    }

    if (node.canvas.userId !== userId) {
      throw new ForbiddenException('无权删除此节点');
    }

    await this.prisma.canvasNode.delete({
      where: { id: nodeId },
    });

    return { message: '节点已删除' };
  }

  async getNodesForCanvas(userId: string, canvasId: string) {
    // Verify canvas ownership
    await this.findOne(userId, canvasId);

    const nodes = await this.prisma.canvasNode.findMany({
      where: { canvasId },
      include: {
        idea: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { data: nodes };
  }

  // Connection CRUD operations
  async createConnection(
    userId: string,
    canvasId: string,
    createConnectionDto: CreateConnectionDto
  ) {
    // Verify canvas ownership
    await this.findOne(userId, canvasId);

    // Prevent self-loop
    if (createConnectionDto.fromNodeId === createConnectionDto.toNodeId) {
      throw new BadRequestException('Cannot connect node to itself');
    }

    // Verify both nodes exist and belong to the canvas
    const [fromNode, toNode] = await Promise.all([
      this.prisma.canvasNode.findUnique({
        where: { id: createConnectionDto.fromNodeId },
        include: { canvas: true },
      }),
      this.prisma.canvasNode.findUnique({
        where: { id: createConnectionDto.toNodeId },
        include: { canvas: true },
      }),
    ]);

    if (!fromNode || !toNode) {
      throw new NotFoundException('One or both nodes do not exist');
    }

    if (fromNode.canvasId !== canvasId || toNode.canvasId !== canvasId) {
      throw new ForbiddenException('Cannot access nodes from this canvas');
    }

    // Unique constraint will be enforced by database
    const connection = await this.prisma.canvasConnection.create({
      data: {
        canvasId,
        fromNodeId: createConnectionDto.fromNodeId,
        toNodeId: createConnectionDto.toNodeId,
        label: createConnectionDto.label,
      },
    });

    return { data: connection };
  }

  async updateConnection(
    userId: string,
    connectionId: string,
    updateConnectionDto: UpdateConnectionDto
  ) {
    const connection = await this.prisma.canvasConnection.findUnique({
      where: { id: connectionId },
      include: { canvas: true },
    });

    if (!connection) {
      throw new NotFoundException('Connection does not exist');
    }

    if (connection.canvas.userId !== userId) {
      throw new ForbiddenException('Cannot access this connection');
    }

    const updated = await this.prisma.canvasConnection.update({
      where: { id: connectionId },
      data: updateConnectionDto,
    });

    return { data: updated };
  }

  async removeConnection(userId: string, connectionId: string) {
    const connection = await this.prisma.canvasConnection.findUnique({
      where: { id: connectionId },
      include: { canvas: true },
    });

    if (!connection) {
      throw new NotFoundException('Connection does not exist');
    }

    if (connection.canvas.userId !== userId) {
      throw new ForbiddenException('Cannot access this connection');
    }

    await this.prisma.canvasConnection.delete({
      where: { id: connectionId },
    });

    return { message: '连线已删除' };
  }

  async getConnectionsForCanvas(userId: string, canvasId: string) {
    // Verify canvas ownership
    await this.findOne(userId, canvasId);

    const connections = await this.prisma.canvasConnection.findMany({
      where: { canvasId },
      include: {
        fromNode: true,
        toNode: true,
      },
    });

    return { data: connections };
  }
}
