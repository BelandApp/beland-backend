import { Module } from '@nestjs/common';
import { DeliveryStatusService } from './delivery-status.service';
import { DeliveryStatusController } from './delivery-status.controller';

@Module({
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusService],
})
export class DeliveryStatusModule {}
