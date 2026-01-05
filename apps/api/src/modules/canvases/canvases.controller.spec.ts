import { Test, TestingModule } from '@nestjs/testing';
import { CanvasesController } from './canvases.controller';
import { CanvasesService } from './canvases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('CanvasesController', () => {
  let controller: CanvasesController;
  let service: CanvasesService;

  const mockCanvasesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addNode: jest.fn(),
    getNodesForCanvas: jest.fn(),
    updateNode: jest.fn(),
    removeNode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CanvasesController],
      providers: [
        {
          provide: CanvasesService,
          useValue: mockCanvasesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CanvasesController>(CanvasesController);
    service = module.get<CanvasesService>(CanvasesService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Canvas CRUD endpoints', () => {
    const mockReq = { user: { id: 'user-1' } };

    describe('create', () => {
      it('should create a canvas', async () => {
        const createDto = { name: '我的画布' };
        const expectedResult = { data: { id: 'canvas-1', name: '我的画布' } };

        mockCanvasesService.create.mockResolvedValue(expectedResult);

        const result = await controller.create(mockReq, createDto);

        expect(service.create).toHaveBeenCalledWith('user-1', createDto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findAll', () => {
      it('should return paginated canvases', async () => {
        const expectedResult = {
          data: [{ id: 'canvas-1' }],
          meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        };

        mockCanvasesService.findAll.mockResolvedValue(expectedResult);

        const result = await controller.findAll(mockReq, 1, 20);

        expect(service.findAll).toHaveBeenCalledWith('user-1', 1, 20);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('findOne', () => {
      it('should return a single canvas', async () => {
        const canvasId = 'canvas-1';
        const expectedResult = { data: { id: canvasId, nodes: [] } };

        mockCanvasesService.findOne.mockResolvedValue(expectedResult);

        const result = await controller.findOne(mockReq, canvasId);

        expect(service.findOne).toHaveBeenCalledWith('user-1', canvasId);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('update', () => {
      it('should update a canvas', async () => {
        const canvasId = 'canvas-1';
        const updateDto = { name: '更新后的名称' };
        const expectedResult = { data: { id: canvasId, name: '更新后的名称' } };

        mockCanvasesService.update.mockResolvedValue(expectedResult);

        const result = await controller.update(mockReq, canvasId, updateDto);

        expect(service.update).toHaveBeenCalledWith('user-1', canvasId, updateDto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('remove', () => {
      it('should delete a canvas', async () => {
        const canvasId = 'canvas-1';
        const expectedResult = { message: '画布已删除' };

        mockCanvasesService.remove.mockResolvedValue(expectedResult);

        const result = await controller.remove(mockReq, canvasId);

        expect(service.remove).toHaveBeenCalledWith('user-1', canvasId);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Node endpoints', () => {
    const mockReq = { user: { id: 'user-1' } };

    describe('addNode', () => {
      it('should add a node to canvas', async () => {
        const canvasId = 'canvas-1';
        const createNodeDto = { ideaId: 'idea-1', x: 100, y: 100 };
        const expectedResult = { data: { id: 'node-1', ...createNodeDto } };

        mockCanvasesService.addNode.mockResolvedValue(expectedResult);

        const result = await controller.addNode(mockReq, canvasId, createNodeDto);

        expect(service.addNode).toHaveBeenCalledWith('user-1', canvasId, createNodeDto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getNodes', () => {
      it('should return nodes for a canvas', async () => {
        const canvasId = 'canvas-1';
        const expectedResult = { data: [{ id: 'node-1' }, { id: 'node-2' }] };

        mockCanvasesService.getNodesForCanvas.mockResolvedValue(expectedResult);

        const result = await controller.getNodes(mockReq, canvasId);

        expect(service.getNodesForCanvas).toHaveBeenCalledWith('user-1', canvasId);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('updateNode', () => {
      it('should update a node position', async () => {
        const nodeId = 'node-1';
        const updateNodeDto = { x: 200, y: 300 };
        const expectedResult = { data: { id: nodeId, ...updateNodeDto } };

        mockCanvasesService.updateNode.mockResolvedValue(expectedResult);

        const result = await controller.updateNode(mockReq, nodeId, updateNodeDto);

        expect(service.updateNode).toHaveBeenCalledWith('user-1', nodeId, updateNodeDto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('removeNode', () => {
      it('should delete a node', async () => {
        const nodeId = 'node-1';
        const expectedResult = { message: '节点已删除' };

        mockCanvasesService.removeNode.mockResolvedValue(expectedResult);

        const result = await controller.removeNode(mockReq, nodeId);

        expect(service.removeNode).toHaveBeenCalledWith('user-1', nodeId);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
