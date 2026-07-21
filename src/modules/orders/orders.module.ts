import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { User } from '../users/entities/users.entity';
import { UsersRepository } from '../users/users.repository';
import { EmailModule } from '../email/email.module';
import { BecoinOrangeModule } from '../rewards/becoin-orange/becoin-orange.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User]), EmailModule, BecoinOrangeModule, WalletsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, NotificationsGateway, UsersRepository],
})
export class OrdersModule {}
