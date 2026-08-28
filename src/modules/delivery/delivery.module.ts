import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { UserAddressModule } from '../user-address/user-address.module';

@Module({
  imports: [
    HttpModule, // <-- ESTO es lo que hace disponible HttpService
    UserAddressModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
