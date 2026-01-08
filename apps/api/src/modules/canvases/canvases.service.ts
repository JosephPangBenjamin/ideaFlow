import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CanvasNodeType } from '@prisma/client';
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
    // Canvas V2: 如果提供了ideaId，验证想法所有权并检查一对一关系
    if (createCanvasDto.ideaId) {
      const idea = await this.prisma.idea.findUnique({
        where: { id: createCanvasDto.ideaId },
      });

      if (!idea || idea.userId !== userId) {
        throw new NotFoundException('想法不存在');
      }

      // 检查是否已有画布关联此想法
      const existingCanvas = await this.prisma.canvas.findUnique({
        where: { ideaId: createCanvasDto.ideaId },
      });

      if (existingCanvas) {
        throw new ConflictException('该想法已有关联的画布');
      }
    }

    const canvas = await this.prisma.canvas.create({
      data: {
        name: createCanvasDto.name || '未命名画布',
        userId,
        ideaId: createCanvasDto.ideaId,
      },
      include: {
        nodes: true,
        idea: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    return { data: canvas };
  }

  // Canvas V2: 根据想法ID查找画布
  async findByIdeaId(userId: string, ideaId: string) {
    const canvas = await this.prisma.canvas.findUnique({
      where: { ideaId },
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
        idea: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    if (!canvas) {
      return { data: null };
    }

    if (canvas.userId !== userId) {
      throw new ForbiddenException('无权访问此画布');
    }

    return { data: canvas };
  }

  // Canvas V2: 根据想法ID查找或创建画布
  async findOrCreateByIdeaId(userId: string, ideaId: string) {
    const existing = await this.findByIdeaId(userId, ideaId);
    if (existing.data) {
      return existing;
    }

    // 验证想法存在
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea || idea.userId !== userId) {
      throw new NotFoundException('想法不存在');
    }

    // 创建画布
    const canvasResult = await this.create(userId, {
      ideaId,
      name: idea.content.slice(0, 50) || '未命名画布',
    });

    // Canvas V2: 自动创建主想法节点（居中显示）
    await this.prisma.canvasNode.create({
      data: {
        canvasId: canvasResult.data.id,
        type: CanvasNodeType.master_idea,
        ideaId: ideaId,
        x: 400, // 画布中央偏左
        y: 100, // 顶部
        width: 200,
        height: 100,
      },
    });

    // 重新获取画布（包含新创建的节点）
    return this.findOne(userId, canvasResult.data.id);
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

    const nodeType = createNodeDto.type || CanvasNodeType.sub_idea;

    // Canvas V2: 根据节点类型进行不同验证
    if (nodeType === CanvasNodeType.master_idea) {
      // master_idea 必须关联 ideaId
      if (!createNodeDto.ideaId) {
        throw new BadRequestException('主想法节点必须关联想法');
      }

      const idea = await this.prisma.idea.findUnique({
        where: { id: createNodeDto.ideaId },
      });

      if (!idea || idea.userId !== userId) {
        throw new NotFoundException('想法不存在');
      }
    }

    // Validate parentId if provided
    if (createNodeDto.parentId) {
      const parent = await this.prisma.canvasNode.findUnique({
        where: { id: createNodeDto.parentId },
      });

      if (!parent || parent.canvasId !== canvasId) {
        throw new BadRequestException('父节点不存在或不属于当前画布');
      }

      if (parent.type !== CanvasNodeType.region) {
        throw new BadRequestException('父节点必须是区域(Region)类型');
      }
    }

    const node = await this.prisma.canvasNode.create({
      data: {
        canvasId,
        type: nodeType,
        ideaId: createNodeDto.ideaId,
        x: createNodeDto.x,
        y: createNodeDto.y,
        width: createNodeDto.width || 180,
        height: createNodeDto.height || 80,
        content: createNodeDto.content,
        imageUrl: createNodeDto.imageUrl,
        color: createNodeDto.color,
        parentId: createNodeDto.parentId,
        style: createNodeDto.style,
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

    // Canvas V2: 如果移动了区域节点，同时移动其子节点
    if (
      node.type === CanvasNodeType.region &&
      (updateNodeDto.x !== undefined || updateNodeDto.y !== undefined)
    ) {
      const deltaX = updateNodeDto.x !== undefined ? updateNodeDto.x - node.x : 0;
      const deltaY = updateNodeDto.y !== undefined ? updateNodeDto.y - node.y : 0;

      if (deltaX !== 0 || deltaY !== 0) {
        await this.prisma.canvasNode.updateMany({
          where: { parentId: nodeId },
          data: {
            x: { increment: deltaX },
            y: { increment: deltaY },
          },
        });
      }
    }

    // Canvas V2: Validate parentId if updating
    if (updateNodeDto.parentId !== undefined) {
      if (updateNodeDto.parentId === nodeId) {
        throw new BadRequestException('节点不能作为自己的父节点');
      }

      if (updateNodeDto.parentId) {
        const parent = await this.prisma.canvasNode.findUnique({
          where: { id: updateNodeDto.parentId },
        });

        if (!parent || parent.canvasId !== node.canvasId) {
          throw new BadRequestException('父节点不存在或不属于当前画布');
        }

        if (parent.type !== CanvasNodeType.region) {
          throw new BadRequestException('父节点必须是区域(Region)类型');
        }
      }
    }

    const updatedNode = await this.prisma.canvasNode.update({
      where: { id: nodeId },
      data: {
        ...updateNodeDto,
        style: updateNodeDto.style,
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
