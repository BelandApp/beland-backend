import { Test, TestingModule } from '@nestjs/testing';
import { UserRechargeController } from './user-recharge.controller';
import { UserRechargeService } from './user-recharge.service';

describe('UserRechargeController', () => {
  let controller: UserRechargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRechargeController],
      providers: [UserRechargeService],
    }).compile();

    controller = module.get<UserRechargeController>(UserRechargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
