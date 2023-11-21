import { Test, TestingModule } from '@nestjs/testing';
import { JetController } from './jet.controller';

describe('JetController', () => {
  let controller: JetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JetController],
    }).compile();

    controller = module.get<JetController>(JetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
