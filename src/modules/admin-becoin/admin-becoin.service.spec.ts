import { Test, TestingModule } from '@nestjs/testing';
import { AdminBecoinService } from './admin-becoin.service';

describe('AdminBecoinService', () => {
  let service: AdminBecoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBecoinService],
    }).compile();

    service = module.get<AdminBecoinService>(AdminBecoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
