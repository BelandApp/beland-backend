import { Test, TestingModule } from '@nestjs/testing';
import { AdminBecoinController } from './admin-becoin.controller';
import { AdminBecoinService } from './admin-becoin.service';

describe('AdminBecoinController', () => {
  let controller: AdminBecoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBecoinController],
      providers: [AdminBecoinService],
    }).compile();

    controller = module.get<AdminBecoinController>(AdminBecoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
