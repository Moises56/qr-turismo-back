import { Test, TestingModule } from '@nestjs/testing';
import { ImageItemController } from './image-item.controller';
import { ImageItemService } from './image-item.service';

describe('ImageItemController', () => {
  let controller: ImageItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageItemController],
      providers: [ImageItemService],
    }).compile();

    controller = module.get<ImageItemController>(ImageItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
