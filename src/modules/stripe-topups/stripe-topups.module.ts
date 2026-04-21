import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeTopup } from './entities/stripe-topup.entity';
import { StripeTopupsService } from './stripe-topups.service';
import { StripeTopupsController } from './stripe-topups.controller';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { NotificationsSocketModule } from 'src/modules/notification-socket/notification-socket.module';
import { SuperadminModule } from 'src/modules/superadmin-config/superadmin-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StripeTopup,
      Wallet,
      Transaction,
      TransactionType,
      TransactionState,
    ]),
    NotificationsSocketModule,
    SuperadminModule,
  ],
  controllers: [StripeTopupsController],
  providers: [StripeTopupsService],
  exports: [StripeTopupsService],
})
export class StripeTopupsModule {}
