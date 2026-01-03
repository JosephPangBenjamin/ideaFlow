import { Test, TestingModule } from '@nestjs/testing';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';

describe('MetaController', () => {
  let controller: MetaController;
  let service: MetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaController],
      providers: [
        {
          provide: MetaService,
          useValue: {
            getLinkPreview: jest.fn(),
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetaController>(MetaController);
    service = module.get<MetaService>(MetaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('preview', () => {
    it('should call service.getLinkPreview', async () => {
      const dto = { url: 'https://example.com' };
      const result = { title: 'Example', url: 'https://example.com' };

      jest.spyOn(service, 'getLinkPreview').mockResolvedValue(result as any);

      expect(await controller.preview(dto)).toBe(result);
      expect(service.getLinkPreview).toHaveBeenCalledWith(dto.url);
    });
  });
});
