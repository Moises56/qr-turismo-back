import { Test, TestingModule } from '@nestjs/testing';
import { LugaresTuristicosService } from './lugares-turisticos.service';

describe('LugaresTuristicosService', () => {
  let service: LugaresTuristicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LugaresTuristicosService],
    }).compile();

    service = module.get<LugaresTuristicosService>(LugaresTuristicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
