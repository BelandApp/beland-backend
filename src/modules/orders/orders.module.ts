import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { User } from '../users/entities/users.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, NotificationsGateway, UsersRepository],
})
export class OrdersModule {}
