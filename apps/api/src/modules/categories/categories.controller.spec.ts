import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReq = { user: { id: 'user-1' } };

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { name: 'Work', color: '#ff0000' };
      mockCategoriesService.create.mockResolvedValue({ id: 'cat-1', ...dto });

      await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      mockCategoriesService.findAll.mockResolvedValue({ data: [] });

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith('user-1');
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto = { name: 'Home' };
      await controller.update(mockReq, 'cat-1', dto);

      expect(service.update).toHaveBeenCalledWith('user-1', 'cat-1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      await controller.remove(mockReq, 'cat-1');

      expect(service.remove).toHaveBeenCalledWith('user-1', 'cat-1');
    });
  });
});
