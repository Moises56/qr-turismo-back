import { Test, TestingModule } from '@nestjs/testing';
import { TipoLocalController } from './tipo-local.controller';
import { TipoLocalService } from './tipo-local.service';

describe('TipoLocalController', () => {
  let controller: TipoLocalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoLocalController],
      providers: [TipoLocalService],
    }).compile();

    controller = module.get<TipoLocalController>(TipoLocalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
