import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { HttpModule } from '@nestjs/axios';
import { NotificationsSocketModule } from 'src/notification-socket/notification-socket.module';
import { UserResource } from 'src/user-resources/entities/user-resource.entity';
import { UserResourcesService } from 'src/user-resources/user-resources.service';
import { UserResourcesRepository } from 'src/user-resources/user-resources.repository';

@Module({
  imports: [NotificationsSocketModule, TypeOrmModule.forFeature([Wallet, UserResource]), HttpModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository, UserResourcesService, UserResourcesRepository],
})
export class WalletsModule {}
