import { Test, TestingModule } from '@nestjs/testing';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';

describe('IdeasController', () => {
  let controller: IdeasController;
  let service: IdeasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeasController],
      providers: [
        {
          provide: IdeasService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IdeasController>(IdeasController);
    service = module.get<IdeasService>(IdeasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an idea', async () => {
      const req = { user: { id: 'user-1' } };
      const createIdeaDto = { content: 'Test Idea' };
      const expectedIdea = { id: 'idea-1', ...createIdeaDto, userId: 'user-1' };

      (service.create as jest.Mock).mockResolvedValue(expectedIdea);

      const result = await controller.create(req, createIdeaDto);

      expect(service.create).toHaveBeenCalledWith('user-1', createIdeaDto);
      expect(result).toEqual(expectedIdea);
    });
  });

  describe('findAll', () => {
    it('should return paginated ideas with default params', async () => {
      const req = { user: { id: 'user-1' } };
      const expectedResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };

      (service.findAll as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findAll(req, {});

      expect(service.findAll).toHaveBeenCalledWith('user-1', {});
      expect(result).toEqual(expectedResult);
    });

    it('should pass custom pagination params', async () => {
      const req = { user: { id: 'user-1' } };
      const page = 2;
      const limit = 10;
      const expectedResult = {
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      (service.findAll as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findAll(req, { page, limit });

      expect(service.findAll).toHaveBeenCalledWith('user-1', { page: 2, limit: 10 });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single idea by id', async () => {
      const req = { user: { id: 'user-1' } };
      const ideaId = 'idea-1';
      const expectedIdea = {
        id: ideaId,
        content: 'Test Idea',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.findOne as jest.Mock).mockResolvedValue({ data: expectedIdea });

      const result = await controller.findOne(req, ideaId);

      expect(service.findOne).toHaveBeenCalledWith('user-1', ideaId);
      expect(result).toEqual({ data: expectedIdea });
    });
  });

  describe('update', () => {
    it('should update an idea', async () => {
      const req = { user: { id: 'user-1' } };
      const ideaId = 'idea-1';
      const updateDto = { content: 'Updated Content' };
      const expectedIdea = {
        id: ideaId,
        content: 'Updated Content',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service.update as jest.Mock).mockResolvedValue({ data: expectedIdea });

      const result = await controller.update(req, ideaId, updateDto);

      expect(service.update).toHaveBeenCalledWith('user-1', ideaId, updateDto);
      expect(result).toEqual({ data: expectedIdea });
    });
  });

  describe('remove', () => {
    it('should delete an idea', async () => {
      const req = { user: { id: 'user-1' } };
      const ideaId = 'idea-1';
      const expectedResult = { message: '想法已删除' };

      (service.remove as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.remove(req, ideaId);

      expect(service.remove).toHaveBeenCalledWith('user-1', ideaId);
      expect(result).toEqual(expectedResult);
    });
  });
});
