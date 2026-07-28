import { Module } from '@nestjs/common';
import { CartsService } from './cart.service';
import { CartsController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsRepository } from './cart.repository';
import { DeliveryModule } from '../delivery/delivery.module';
import { UserAddressModule } from '../user-address/user-address.module';
import { UserAddressService } from '../user-address/user-address.service';
import { UserAddress } from '../user-address/entities/user-address.entity';
import { UserAddressRepository } from '../user-address/user-address.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, UserAddress]),
    DeliveryModule,
    UserAddressModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository, UserAddressService, UserAddressRepository],
})
export class CartModule {}
