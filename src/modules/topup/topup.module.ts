import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topup } from './entities/topup.entity';
import { Wallet } from '../wallets/entities/wallet.entity'; 
import { Transaction } from '../transactions/entities/transaction.entity'; 
import { TopupService } from './topup.service';
import { TopupController } from './topup.controller';
import { BinancePayService } from '../binance-pay/binance-pay.service';
import { BinanceWebhookController } from '../binance-pay/webhook.controller';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity'; 
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topup, Wallet, Transaction, TransactionType, TransactionState])],
  providers: [TopupService, BinancePayService, SuperadminConfigService],
  controllers: [TopupController, BinanceWebhookController],
  exports: [TopupService],
})
export class TopupModule {}
