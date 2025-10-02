import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryStatusController } from './delivery-status.controller';
import { DeliveryStatusService } from './delivery-status.service';

describe('DeliveryStatusController', () => {
  let controller: DeliveryStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryStatusController],
      providers: [DeliveryStatusService],
    }).compile();

    controller = module.get<DeliveryStatusController>(DeliveryStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
