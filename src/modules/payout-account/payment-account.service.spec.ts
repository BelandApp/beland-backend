import { Test, TestingModule } from '@nestjs/testing';
import { PaymentAccountService } from './payment-account.service';

describe('PaymentAccountService', () => {
  let service: PaymentAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentAccountService],
    }).compile();

    service = module.get<PaymentAccountService>(PaymentAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
