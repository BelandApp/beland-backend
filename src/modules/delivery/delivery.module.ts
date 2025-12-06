import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';

@Module({
  imports: [
    HttpModule, // <-- ESTO es lo que hace disponible HttpService
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
