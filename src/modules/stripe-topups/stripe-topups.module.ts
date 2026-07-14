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
import { RechargeUseCase } from '../wallets/use-cases/recharge.use-case';
import { PurchaseEventPassUseCase } from '../wallets/use-cases/purchase-eventpass.use-case';
import { PurchaseGiftCardUseCase } from '../wallets/use-cases/purchase-giftcard.use-case';
import { PurchaseOrderPaymentUseCase } from '../wallets/use-cases/purchase-beland.use-case';

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
  providers: [StripeTopupsService, RechargeUseCase, 
    PurchaseEventPassUseCase, PurchaseGiftCardUseCase, 
    PurchaseOrderPaymentUseCase],
  exports: [StripeTopupsService],
})
export class StripeTopupsModule {}
