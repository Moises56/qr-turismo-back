import { Test, TestingModule } from '@nestjs/testing';
import { LugaresTuristicosController } from './lugares-turisticos.controller';
import { LugaresTuristicosService } from './lugares-turisticos.service';

describe('LugaresTuristicosController', () => {
  let controller: LugaresTuristicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LugaresTuristicosController],
      providers: [LugaresTuristicosService],
    }).compile();

    controller = module.get<LugaresTuristicosController>(
      LugaresTuristicosController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
