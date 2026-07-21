import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './wallets.repository';
import { HttpModule } from '@nestjs/axios';
import { NotificationsSocketModule } from 'src/modules/notification-socket/notification-socket.module';
import { FinancialTransactionService } from './financial-transaction.service';
import { WalletPaymentService } from './wallet-payment.service';
import { FinancialReversalService } from './financial-reversal.service';
import { RechargeUseCase } from './use-cases/recharge.use-case';
import { PurchaseGiftCardUseCase } from './use-cases/purchase-giftcard.use-case';
import { PurchaseBelandUseCase } from './use-cases/purchase-beland.use-case';
import { PurchaseOrderPaymentUseCase } from './use-cases/purchase-order-payment.use-case';
import { PurchaseEventPassUseCase } from './use-cases/purchase-eventpass.use-case';
import { RefundEventPassUseCase } from './use-cases/refund-eventpass.use-case';
import { PurchaseMerchantUseCase } from './use-cases/purchase-merchant.use-case';
import { DonationUseCase } from './use-cases/donation.use-case';
import { SendGiftCardUseCase } from './use-cases/send-giftcard.use-case';

import { RechargeLimitPolicy } from './policies/recharge-limit.policy';

import { BecoinOrangeModule } from '../rewards/becoin-orange/becoin-orange.module';
import { GiftCardBalanceService } from '../gift-card/services/gift-card-balance.service';

@Module({
  imports: [NotificationsSocketModule, TypeOrmModule.forFeature([Wallet]), HttpModule, BecoinOrangeModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository, FinancialTransactionService, 
    WalletPaymentService, FinancialReversalService, RechargeUseCase,
    PurchaseGiftCardUseCase, PurchaseBelandUseCase, 
    PurchaseOrderPaymentUseCase, PurchaseEventPassUseCase, 
    RefundEventPassUseCase, PurchaseMerchantUseCase, DonationUseCase, 
    SendGiftCardUseCase, RechargeLimitPolicy, GiftCardBalanceService],
  exports: [WalletsService, FinancialTransactionService, WalletPaymentService, 
    FinancialReversalService, RechargeUseCase, PurchaseGiftCardUseCase, 
    PurchaseBelandUseCase, PurchaseOrderPaymentUseCase, PurchaseEventPassUseCase, 
    RefundEventPassUseCase, PurchaseMerchantUseCase, DonationUseCase, 
    SendGiftCardUseCase, RechargeLimitPolicy],
})
export class WalletsModule { }
