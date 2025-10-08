import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryStatusService } from './delivery-status.service';

describe('DeliveryStatusService', () => {
  let service: DeliveryStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryStatusService],
    }).compile();

    service = module.get<DeliveryStatusService>(DeliveryStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
