import { Test, TestingModule } from '@nestjs/testing';
import { PaymentAccountController } from './payment-account.controller';
import { PaymentAccountService } from './payment-account.service';

describe('PaymentAccountController', () => {
  let controller: PaymentAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentAccountController],
      providers: [PaymentAccountService],
    }).compile();

    controller = module.get<PaymentAccountController>(PaymentAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
