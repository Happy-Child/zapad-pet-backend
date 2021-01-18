import { Test, TestingModule } from '@nestjs/testing';
import { PugEngineService } from './pug-engine.service';

describe('PugEngineService', () => {
  let service: PugEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PugEngineService],
    }).compile();

    service = module.get<PugEngineService>(PugEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
