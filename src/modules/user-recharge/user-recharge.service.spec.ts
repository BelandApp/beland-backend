import { Test, TestingModule } from '@nestjs/testing';
import { UserRechargeService } from './user-recharge.service';

describe('UserRechargeService', () => {
  let service: UserRechargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRechargeService],
    }).compile();

    service = module.get<UserRechargeService>(UserRechargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
