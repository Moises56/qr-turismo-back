import { Test, TestingModule } from '@nestjs/testing';
import { TipoLocalService } from './tipo-local.service';

describe('TipoLocalService', () => {
  let service: TipoLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoLocalService],
    }).compile();

    service = module.get<TipoLocalService>(TipoLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
