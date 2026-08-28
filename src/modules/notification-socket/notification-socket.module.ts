// notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notification-socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ProcessPendingPurchasesUseCase } from '../experiences/use-cases/process-pending-purchases.use-case';
import { GenerateOrangeRewardUseCase } from '../rewards/becoin-orange/use-cases/generate-orange-reward.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [NotificationsGateway, UsersRepository, ProcessPendingPurchasesUseCase, GenerateOrangeRewardUseCase],
  exports: [NotificationsGateway], // <- para inyectarlo en otros servicios
})
export class NotificationsSocketModule {}