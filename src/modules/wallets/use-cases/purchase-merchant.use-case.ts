import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';
import { AmountToPayment } from 'src/modules/amount-to-payment/entities/amount-to-payment.entity';
import { NotificationsGateway } from 'src/modules/notification-socket/notification-socket.gateway';
import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';

export interface PurchaseMerchantUseCaseInput {
  buyerWalletId: string;
  merchantWalletId: string;
  amountUsd: number;
  amountPaymentId?: string;
}

@Injectable()
export class PurchaseMerchantUseCase {
  constructor(
    private readonly walletPaymentService: WalletPaymentService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async execute(
    manager: EntityManager,
    input: PurchaseMerchantUseCaseInput,
  ): Promise<{ transaction: Transaction; merchantUserId: string; merchantWalletId: string }> {
    const { buyerWalletId, merchantWalletId, amountUsd, amountPaymentId } = input;

    // ==========================================================
    // VALIDATIONS
    // ==========================================================
    if (amountUsd <= 0) {
      throw new BadRequestException('Amount to debit must be greater than zero');
    }

    const merchantWallet = await manager.findOne(Wallet, {
      where: { id: merchantWalletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!merchantWallet) {
      throw new NotFoundException('Billetera destino no existe');
    }

    // ==========================================================
    // TYPES AND STATUSES
    // ==========================================================
    const purchaseType = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.PURCHASE },
    });
    if (!purchaseType) {
      throw new ConflictException(`No se encuentra el tipo ${TransactionCode.PURCHASE}`);
    }

    const saleType = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.SALE },
    });
    if (!saleType) {
      throw new ConflictException(`No se encuentra el tipo ${TransactionCode.SALE}`);
    }

    const completedStatus = await manager.findOne(TransactionState, {
      where: { code: StatusCode.COMPLETED },
    });
    if (!completedStatus) {
      throw new ConflictException(`No se encuentra el estado ${StatusCode.COMPLETED}`);
    }

    // ==========================================================
    // DEBIT BUYER (USING WALLET PAYMENT SERVICE)
    // ==========================================================
    const debitTransaction = await this.walletPaymentService.processPayment(
      manager,
      buyerWalletId,
      amountUsd,
      {
        type_id: purchaseType.id,
        status_id: completedStatus.id,
        reference: `${TransactionCode.PURCHASE}-${merchantWalletId}`,
        related_wallet_id: merchantWalletId,
      }
    );

    // ==========================================================
    // CREDIT MERCHANT
    // ==========================================================
    merchantWallet.usd_balance = Number(merchantWallet.usd_balance) + amountUsd;
    await manager.save(Wallet, merchantWallet);

    const creditTransaction = manager.create(Transaction, {
      wallet_id: merchantWallet.id,
      type_id: saleType.id,
      status_id: completedStatus.id,
      amount_usd: amountUsd,
      post_balance: merchantWallet.usd_balance,
      related_wallet_id: buyerWalletId,
      reference: `${TransactionCode.SALE}-${buyerWalletId}`,
    });
    await manager.save(Transaction, creditTransaction);

    // ==========================================================
    // AMOUNT TO PAYMENT CONSUMPTION
    // ==========================================================
    if (amountPaymentId) {
      await manager.delete(AmountToPayment, { id: amountPaymentId });
    }

    return {
      transaction: debitTransaction,
      merchantUserId: merchantWallet.user_id,
      merchantWalletId: merchantWallet.id,
    };
  }
}
