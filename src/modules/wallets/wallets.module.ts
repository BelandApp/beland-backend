import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { HttpModule } from '@nestjs/axios';
import { NotificationsSocketModule } from 'src/modules/notification-socket/notification-socket.module';
import { FinancialTransactionService } from './financial-transaction.service';

@Module({
  imports: [NotificationsSocketModule, TypeOrmModule.forFeature([Wallet]), HttpModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository, FinancialTransactionService],
  exports: [WalletsService, FinancialTransactionService],
})
export class WalletsModule {}
