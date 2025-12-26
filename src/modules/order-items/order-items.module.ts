import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsRepository } from './order-items.repository';
import { GroupMember } from '../group-members/entities/group-member.entity';
import { OrderItemConsumption } from './entities/order-item-consumptions.entity';
import { OrderItemConsumptionService } from './order-item-consumption.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, OrderItemConsumption, GroupMember])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsRepository, OrderItemConsumptionService],
})
export class OrderItemsModule {}
