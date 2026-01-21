import { Test, TestingModule } from '@nestjs/testing';
import { CanvasesService } from './canvases.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { CanvasNodeType } from '@prisma/client';

describe('CanvasesService', () => {
  let service: CanvasesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanvasesService,
        {
          provide: PrismaService,
          useValue: {
            canvas: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            canvasNode: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              delete: jest.fn(),
            },
            canvasConnection: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            idea: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CanvasesService>(CanvasesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a canvas with default name', async () => {
      const userId = 'user-1';
      const createDto = {};
      const expectedCanvas = {
        id: 'canvas-1',
        name: '未命名画布',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        nodes: [],
      };

      (prisma.canvas.create as jest.Mock).mockResolvedValue(expectedCanvas);

      const result = await service.create(userId, createDto);

      expect(prisma.canvas.create).toHaveBeenCalledWith({
        data: {
          name: '未命名画布',
          userId,
          ideaId: undefined,
        },
        include: {
          nodes: true,
          idea: { select: { id: true, content: true, sources: true } },
        },
      });
      expect(result).toEqual({ data: expectedCanvas });
    });

    it('should create a canvas with custom name', async () => {
      const userId = 'user-1';
      const createDto = { name: '我的画布' };
      const expectedCanvas = {
        id: 'canvas-1',
        name: '我的画布',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        nodes: [],
      };

      (prisma.canvas.create as jest.Mock).mockResolvedValue(expectedCanvas);

      const result = await service.create(userId, createDto);

      expect(prisma.canvas.create).toHaveBeenCalledWith({
        data: {
          name: '我的画布',
          userId,
          ideaId: undefined,
        },
        include: {
          nodes: true,
          idea: { select: { id: true, content: true, sources: true } },
        },
      });
      expect(result).toEqual({ data: expectedCanvas });
    });
  });

  describe('findAll', () => {
    it('should return paginated canvases', async () => {
      const userId = 'user-1';
      const page = 1;
      const limit = 10;
      const canvases = [
        { id: 'canvas-1', name: '画布1', userId, _count: { nodes: 2 } },
        { id: 'canvas-2', name: '画布2', userId, _count: { nodes: 0 } },
      ];
      const total = 2;

      (prisma.canvas.findMany as jest.Mock).mockResolvedValue(canvases);
      (prisma.canvas.count as jest.Mock).mockResolvedValue(total);

      const result = await service.findAll(userId, page, limit);

      expect(prisma.canvas.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { nodes: true } } },
      });
      expect(result).toEqual({
        data: canvases,
        meta: { total, page, limit, totalPages: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('should return a canvas with nodes for the owner', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const expectedCanvas = {
        id: canvasId,
        name: '我的画布',
        userId,
        nodes: [{ id: 'node-1', x: 100, y: 100, idea: { id: 'idea-1', content: '想法' } }],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(expectedCanvas);

      const result = await service.findOne(userId, canvasId);

      expect(result).toEqual({ data: expectedCanvas });
    });

    it('should throw NotFoundException if canvas does not exist', async () => {
      const userId = 'user-1';
      const canvasId = 'non-existent';

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId, canvasId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if canvas belongs to another user', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const otherUserCanvas = {
        id: canvasId,
        name: '他人画布',
        userId: 'user-2',
        nodes: [],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(otherUserCanvas);

      await expect(service.findOne(userId, canvasId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update canvas name', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const updateDto = { name: '更新后的名称' };
      const existingCanvas = { id: canvasId, name: '旧名称', userId, nodes: [] };
      const updatedCanvas = { ...existingCanvas, name: '更新后的名称' };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const result = await service.update(userId, canvasId, updateDto);

      expect(prisma.canvas.update).toHaveBeenCalledWith({
        where: { id: canvasId },
        data: updateDto,
        include: { nodes: true },
      });
      expect(result).toEqual({ data: updatedCanvas });
    });
  });

  describe('remove', () => {
    it('should delete a canvas', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvas.delete as jest.Mock).mockResolvedValue(existingCanvas);

      const result = await service.remove(userId, canvasId);

      expect(prisma.canvas.delete).toHaveBeenCalledWith({
        where: { id: canvasId },
      });
      expect(result).toEqual({ message: '画布已删除' });
    });
  });

  describe('addNode', () => {
    it('should add a node to canvas', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = { ideaId: 'idea-1', x: 150, y: 200 };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const existingIdea = { id: 'idea-1', userId, content: '想法内容' };
      const expectedNode = {
        id: 'node-1',
        canvasId,
        ideaId: 'idea-1',
        x: 150,
        y: 200,
        width: 180,
        height: 80,
        idea: { id: 'idea-1', content: '想法内容' },
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(existingIdea);
      (prisma.canvasNode.create as jest.Mock).mockResolvedValue(expectedNode);

      const result = await service.addNode(userId, canvasId, createNodeDto);

      expect(prisma.canvasNode.create).toHaveBeenCalledWith({
        data: {
          canvasId,
          type: CanvasNodeType.sub_idea,
          ideaId: 'idea-1',
          x: 150,
          y: 200,
          width: 180,
          height: 80,
          content: undefined,
          imageUrl: undefined,
          color: undefined,
          parentId: undefined,
        },
        include: { idea: { select: { id: true, content: true, sources: true } } },
      });
      expect(result).toEqual({ data: expectedNode });
    });

    it('should add a region node with color', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = {
        type: CanvasNodeType.region,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        color: '#ff0000',
        content: 'Region 1',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const expectedNode = {
        id: 'region-1',
        canvasId,
        type: CanvasNodeType.region,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        color: '#ff0000',
        content: 'Region 1',
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.create as jest.Mock).mockResolvedValue(expectedNode);

      const result = await service.addNode(userId, canvasId, createNodeDto as any);

      expect(prisma.canvasNode.create).toHaveBeenCalledWith({
        data: {
          canvasId,
          type: CanvasNodeType.region,
          ideaId: undefined,
          x: 100,
          y: 100,
          width: 300,
          height: 200,
          content: 'Region 1',
          imageUrl: undefined,
          color: '#ff0000',
          parentId: undefined,
        },
        include: { idea: { select: { id: true, content: true, sources: true } } },
      });
      expect(result).toEqual({ data: expectedNode });
    });

    it('should throw NotFoundException if idea does not exist', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = {
        ideaId: 'non-existent',
        x: 100,
        y: 100,
        type: CanvasNodeType.master_idea,
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.addNode(userId, canvasId, createNodeDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if idea belongs to another user', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = {
        ideaId: 'idea-1',
        x: 100,
        y: 100,
        type: CanvasNodeType.master_idea,
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const otherUserIdea = { id: 'idea-1', userId: 'user-2', content: '他人的想法' };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.idea.findUnique as jest.Mock).mockResolvedValue(otherUserIdea);

      await expect(service.addNode(userId, canvasId, createNodeDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if parentId does not exist', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = {
        x: 100,
        y: 100,
        parentId: 'parent-1',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.addNode(userId, canvasId, createNodeDto as any)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if parent node is not a region', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createNodeDto = {
        x: 100,
        y: 100,
        parentId: 'parent-1',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const nonRegionParent = {
        id: 'parent-1',
        canvasId,
        type: CanvasNodeType.sub_idea,
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(nonRegionParent);

      await expect(service.addNode(userId, canvasId, createNodeDto as any)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('updateNode', () => {
    it('should update node position', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const updateDto = { x: 300, y: 400 };
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        x: 100,
        y: 100,
        canvas: { userId },
      };
      const updatedNode = {
        ...existingNode,
        ...updateDto,
        idea: { id: 'idea-1', content: '想法' },
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(existingNode);
      (prisma.canvasNode.update as jest.Mock).mockResolvedValue(updatedNode);

      const result = await service.updateNode(userId, nodeId, updateDto);

      expect(prisma.canvasNode.update).toHaveBeenCalledWith({
        where: { id: nodeId },
        data: { ...updateDto, style: undefined },
        include: { idea: { select: { id: true, content: true, sources: true } } },
      });
      expect(result).toEqual({ data: updatedNode });
    });

    it('should update node grouping (parentId)', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const updateDto = { parentId: 'region-1' };
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        x: 100,
        y: 100,
        canvas: { userId },
        type: CanvasNodeType.sub_idea,
      };
      const regionNode = {
        id: 'region-1',
        canvasId: 'canvas-1',
        x: 100,
        y: 100,
        type: CanvasNodeType.region,
      };
      const updatedNode = {
        ...existingNode,
        parentId: 'region-1',
      };

      (prisma.canvasNode.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingNode)
        .mockResolvedValueOnce(regionNode);
      (prisma.canvasNode.update as jest.Mock).mockResolvedValue(updatedNode);

      const result = await service.updateNode(userId, nodeId, updateDto);

      expect(prisma.canvasNode.update).toHaveBeenCalledWith({
        where: { id: nodeId },
        data: { ...updateDto, style: undefined },
        include: { idea: { select: { id: true, content: true, sources: true } } },
      });
      expect(result).toEqual({ data: updatedNode });
    });

    it('should move children when region moves', async () => {
      const userId = 'user-1';
      const nodeId = 'region-1';
      const updateDto = { x: 300, y: 300 };
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        type: CanvasNodeType.region,
        x: 100,
        y: 100,
        canvas: { userId },
      };
      const updatedNode = {
        ...existingNode,
        ...updateDto,
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(existingNode);
      (prisma.canvasNode.update as jest.Mock).mockResolvedValue(updatedNode);

      await service.updateNode(userId, nodeId, updateDto);

      // Verify that children updates were triggered
      // Delta X = 300 - 100 = 200
      // Delta Y = 300 - 100 = 200
      expect(prisma.canvasNode.updateMany).toHaveBeenCalledWith({
        where: { parentId: nodeId },
        data: {
          x: { increment: 200 },
          y: { increment: 200 },
        },
      });

      expect(prisma.canvasNode.update).toHaveBeenCalledWith({
        where: { id: nodeId },
        data: { ...updateDto, style: undefined },
        include: { idea: { select: { id: true, content: true, sources: true } } },
      });
    });

    it('should throw NotFoundException if node does not exist', async () => {
      const userId = 'user-1';
      const nodeId = 'non-existent';
      const updateDto = { x: 300 };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateNode(userId, nodeId, updateDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException if node belongs to another user', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const updateDto = { x: 300 };
      const otherUserNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        canvas: { userId: 'user-2' },
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(otherUserNode);

      await expect(service.updateNode(userId, nodeId, updateDto)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should throw BadRequestException if updating parentId to self', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const updateDto = { parentId: 'node-1' };
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        canvas: { userId },
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(existingNode);

      await expect(service.updateNode(userId, nodeId, updateDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if parent node is not in same canvas', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const updateDto = { parentId: 'parent-1' };
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        canvas: { userId },
      };
      const otherCanvasParent = {
        id: 'parent-1',
        canvasId: 'canvas-2',
        type: CanvasNodeType.region,
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockImplementation((args) => {
        if (args.where.id === nodeId) return Promise.resolve(existingNode);
        if (args.where.id === 'parent-1') return Promise.resolve(otherCanvasParent);
        return Promise.resolve(null);
      });

      await expect(service.updateNode(userId, nodeId, updateDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('removeNode', () => {
    it('should delete a node', async () => {
      const userId = 'user-1';
      const nodeId = 'node-1';
      const existingNode = {
        id: nodeId,
        canvasId: 'canvas-1',
        canvas: { userId },
      };

      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValue(existingNode);
      (prisma.canvasNode.delete as jest.Mock).mockResolvedValue(existingNode);

      const result = await service.removeNode(userId, nodeId);

      expect(prisma.canvasNode.delete).toHaveBeenCalledWith({
        where: { id: nodeId },
      });
      expect(result).toEqual({ message: '节点已删除' });
    });
  });

  describe('getNodesForCanvas', () => {
    it('should return all nodes for a canvas', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const expectedNodes = [
        { id: 'node-1', x: 100, y: 100, idea: { id: 'idea-1', content: '想法1' } },
        { id: 'node-2', x: 200, y: 200, idea: { id: 'idea-2', content: '想法2' } },
      ];

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.findMany as jest.Mock).mockResolvedValue(expectedNodes);

      const result = await service.getNodesForCanvas(userId, canvasId);

      expect(prisma.canvasNode.findMany).toHaveBeenCalledWith({
        where: { canvasId },
        include: { idea: { select: { id: true, content: true, sources: true } } },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual({ data: expectedNodes });
    });
  });

  describe('createConnection', () => {
    it('should create a connection between two nodes', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createDto: CreateConnectionDto = {
        fromNodeId: 'node-1',
        toNodeId: 'node-2',
        label: 'Test label',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const existingFromNode = { id: 'node-1', canvasId, userId };
      const existingToNode = { id: 'node-2', canvasId, userId };
      const expectedConnection = { id: 'connection-1', ...createDto, canvasId };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValueOnce(existingFromNode);
      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValueOnce(existingToNode);
      (prisma.canvasConnection.create as jest.Mock).mockResolvedValue(expectedConnection);

      const result = await service.createConnection(userId, canvasId, createDto);

      expect(prisma.canvasConnection.create).toHaveBeenCalledWith({
        data: {
          canvasId,
          ...createDto,
        },
      });
      expect(result).toEqual({ data: expectedConnection });
    });

    it('should reject self-loop connections', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createDto: CreateConnectionDto = {
        fromNodeId: 'node-1',
        toNodeId: 'node-1',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);

      await expect(service.createConnection(userId, canvasId, createDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw NotFoundException if node does not exist', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const createDto: CreateConnectionDto = {
        fromNodeId: 'node-1',
        toNodeId: 'node-2',
      };
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasNode.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.createConnection(userId, canvasId, createDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateConnection', () => {
    it('should update connection label', async () => {
      const userId = 'user-1';
      const connectionId = 'connection-1';
      const updateDto: UpdateConnectionDto = { label: 'Updated label' };
      const existingConnection = {
        id: connectionId,
        canvasId: 'canvas-1',
        fromNodeId: 'node-1',
        toNodeId: 'node-2',
        canvas: { userId },
      };
      const updatedConnection = { ...existingConnection, ...updateDto };

      (prisma.canvasConnection.findUnique as jest.Mock).mockResolvedValue(existingConnection);
      (prisma.canvasConnection.update as jest.Mock).mockResolvedValue(updatedConnection);

      const result = await service.updateConnection(userId, connectionId, updateDto);

      expect(prisma.canvasConnection.update).toHaveBeenCalledWith({
        where: { id: connectionId },
        data: updateDto,
      });
      expect(result).toEqual({ data: updatedConnection });
    });

    it('should throw NotFoundException if connection does not exist', async () => {
      const userId = 'user-1';
      const connectionId = 'connection-1';
      const updateDto: UpdateConnectionDto = { label: 'test' };

      (prisma.canvasConnection.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateConnection(userId, connectionId, updateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('removeConnection', () => {
    it('should delete connection', async () => {
      const userId = 'user-1';
      const connectionId = 'connection-1';
      const existingConnection = {
        id: connectionId,
        canvasId: 'canvas-1',
        canvas: { userId },
      };

      (prisma.canvasConnection.findUnique as jest.Mock).mockResolvedValue(existingConnection);
      (prisma.canvasConnection.delete as jest.Mock).mockResolvedValue(existingConnection);

      const result = await service.removeConnection(userId, connectionId);

      expect(prisma.canvasConnection.delete).toHaveBeenCalledWith({
        where: { id: connectionId },
      });
      expect(result).toEqual({ message: '连线已删除' });
    });

    it('should throw NotFoundException if connection does not exist', async () => {
      const userId = 'user-1';
      const connectionId = 'connection-1';

      (prisma.canvasConnection.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.removeConnection(userId, connectionId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getConnectionsForCanvas', () => {
    it('should return all connections for a canvas', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingCanvas = { id: canvasId, name: '画布', userId, nodes: [] };
      const expectedConnections = [
        { id: 'connection-1', canvasId, fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'connection-2', canvasId, fromNodeId: 'node-2', toNodeId: 'node-3' },
      ];

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvasConnection.findMany as jest.Mock).mockResolvedValue(expectedConnections);

      const result = await service.getConnectionsForCanvas(userId, canvasId);

      expect(prisma.canvasConnection.findMany).toHaveBeenCalledWith({
        where: { canvasId },
        include: {
          fromNode: true,
          toNode: true,
        },
      });
      expect(result).toEqual({ data: expectedConnections });
    });
  });

  // ==================== Story 7.1: Canvas 可见性功能测试 ====================

  describe('updateVisibility', () => {
    it('should generate publicToken when setting canvas to public', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingCanvas = {
        id: canvasId,
        userId,
        isPublic: false,
        publicToken: null,
      };
      const updatedCanvas = {
        ...existingCanvas,
        isPublic: true,
        publicToken: 'generated-uuid-token',
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const result = await service.updateVisibility(userId, canvasId, true);

      expect(prisma.canvas.update).toHaveBeenCalledWith({
        where: { id: canvasId },
        data: {
          isPublic: true,
          publicToken: expect.any(String), // 验证生成了 Token
        },
      });
      expect(result.data.isPublic).toBe(true);
      expect(result.data.publicToken).toBeTruthy();
    });

    it('should clear publicToken when setting canvas to private', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingCanvas = {
        id: canvasId,
        userId,
        isPublic: true,
        publicToken: 'existing-token',
      };
      const updatedCanvas = {
        ...existingCanvas,
        isPublic: false,
        publicToken: null,
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const result = await service.updateVisibility(userId, canvasId, false);

      expect(prisma.canvas.update).toHaveBeenCalledWith({
        where: { id: canvasId },
        data: {
          isPublic: false,
          publicToken: null, // 验证清空了 Token
        },
      });
      expect(result.data.isPublic).toBe(false);
      expect(result.data.publicToken).toBeNull();
    });

    it('should throw NotFoundException if canvas does not exist', async () => {
      const userId = 'user-1';
      const canvasId = 'non-existent';

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateVisibility(userId, canvasId, true)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException if user is not the owner', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const otherUserCanvas = {
        id: canvasId,
        userId: 'user-2',
        isPublic: false,
        publicToken: null,
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(otherUserCanvas);

      await expect(service.updateVisibility(userId, canvasId, true)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should reuse existing publicToken when already public', async () => {
      const userId = 'user-1';
      const canvasId = 'canvas-1';
      const existingToken = 'existing-uuid-token';
      const existingCanvas = {
        id: canvasId,
        userId,
        isPublic: true,
        publicToken: existingToken,
      };
      const updatedCanvas = {
        ...existingCanvas,
        isPublic: true,
        publicToken: existingToken, // 保持不变
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(existingCanvas);
      (prisma.canvas.update as jest.Mock).mockResolvedValue(updatedCanvas);

      const result = await service.updateVisibility(userId, canvasId, true);

      expect(prisma.canvas.update).toHaveBeenCalledWith({
        where: { id: canvasId },
        data: {
          isPublic: true,
          publicToken: existingToken, // 验证重用了现有 Token
        },
      });
      expect(result.data.publicToken).toBe(existingToken);
    });
  });

  describe('findByToken', () => {
    it('should return public canvas by token', async () => {
      const token = 'valid-public-token';
      const publicCanvas = {
        id: 'canvas-1',
        name: 'Public Canvas',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        nodes: [],
        connections: [],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(publicCanvas);

      const result = await service.findByToken(token);

      expect(prisma.canvas.findUnique).toHaveBeenCalledWith({
        where: { publicToken: token },
        include: {
          nodes: {
            include: {
              idea: {
                select: {
                  id: true,
                  content: true,
                  sources: true,
                },
              },
            },
          },
          connections: true,
        },
      });
      expect(result.data.id).toBe('canvas-1');
    });

    it('should filter out note field from nested sources in canvas nodes', async () => {
      const token = 'valid-public-token';
      const publicCanvas = {
        id: 'canvas-1',
        name: 'Public Canvas',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        nodes: [
          {
            id: 'node-1',
            idea: {
              id: 'idea-1',
              content: 'Idea Content',
              sources: [
                { type: 'link', url: 'https://example.com', note: '私密笔记' },
                { type: 'text', content: 'Some text', note: '另一个私密笔记' },
              ],
            },
          },
          {
            id: 'node-2',
            idea: {
              id: 'idea-2',
              content: 'Another Idea',
              sources: [{ type: 'link', url: 'https://test.com', note: '测试笔记' }],
            },
          },
        ],
        connections: [],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(publicCanvas);

      const result = await service.findByToken(token);

      // 验证所有节点的 idea.sources 都不包含 note 字段
      expect(result.data.nodes[0].idea!.sources).toEqual([
        { type: 'link', url: 'https://example.com' },
        { type: 'text', content: 'Some text' },
      ]);
      expect(result.data.nodes[1].idea!.sources).toEqual([
        { type: 'link', url: 'https://test.com' },
      ]);

      // 确保所有 note 字段已被移除
      result.data.nodes.forEach((node: any) => {
        if (node.idea && node.idea.sources) {
          node.idea.sources.forEach((source: any) => {
            expect(source.note).toBeUndefined();
          });
        }
      });
    });

    it('should throw NotFoundException if token does not exist', async () => {
      const token = 'non-existent-token';

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findByToken(token)).rejects.toThrow(NotFoundException);
      await expect(service.findByToken(token)).rejects.toThrow('该页面不存在或已设为私密');
    });

    it('should throw NotFoundException if canvas is not public', async () => {
      const token = 'valid-token';
      const privateCanvas = {
        id: 'canvas-1',
        name: 'Private Canvas',
        userId: 'user-1',
        isPublic: false, // 已设为私密
        publicToken: token,
        nodes: [],
        connections: [],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(privateCanvas);

      await expect(service.findByToken(token)).rejects.toThrow(NotFoundException);
      await expect(service.findByToken(token)).rejects.toThrow('该页面不存在或已设为私密');
    });

    it('should handle nodes without idea or with null sources', async () => {
      const token = 'valid-public-token';
      const publicCanvas = {
        id: 'canvas-1',
        name: 'Public Canvas',
        userId: 'user-1',
        isPublic: true,
        publicToken: token,
        nodes: [
          {
            id: 'node-1',
            idea: null, // 节点没有关联 Idea
          },
          {
            id: 'node-2',
            idea: {
              id: 'idea-2',
              content: 'Idea without sources',
              sources: null, // sources 为 null
            },
          },
        ],
        connections: [],
      };

      (prisma.canvas.findUnique as jest.Mock).mockResolvedValue(publicCanvas);

      const result = await service.findByToken(token);

      expect(result.data.nodes[0].idea).toBeNull();
      expect(result.data.nodes[1].idea!.sources).toBeNull();
    });
  });
});
