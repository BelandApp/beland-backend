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
import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';

export interface DonationUseCaseInput {
  buyerWalletId: string;
  foundationWalletId: string;
  amountUsd: number;
  amountPaymentId?: string;
}

@Injectable()
export class DonationUseCase {
  constructor(
    private readonly walletPaymentService: WalletPaymentService,
  ) {}

  async execute(
    manager: EntityManager,
    input: DonationUseCaseInput,
  ): Promise<{ transaction: Transaction; foundationUserId: string; foundationWalletId: string }> {
    const { buyerWalletId, foundationWalletId, amountUsd, amountPaymentId } = input;

    // ==========================================================
    // VALIDATIONS
    // ==========================================================
    if (amountUsd <= 0) {
      throw new BadRequestException('Amount to debit must be greater than zero');
    }

    const foundationWallet = await manager.findOne(Wallet, {
      where: { id: foundationWalletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!foundationWallet) {
      throw new NotFoundException('Billetera destino no existe');
    }

    // ==========================================================
    // TYPES AND STATUSES
    // ==========================================================
    const donationSendType = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.DONATION_SEND },
    });
    if (!donationSendType) {
      throw new ConflictException(`No se encuentra el tipo ${TransactionCode.DONATION_SEND}`);
    }

    const donationReceivedType = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.DONATION_RECEIVED },
    });
    if (!donationReceivedType) {
      throw new ConflictException(`No se encuentra el tipo ${TransactionCode.DONATION_RECEIVED}`);
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
        type_id: donationSendType.id,
        status_id: completedStatus.id,
        reference: `${TransactionCode.DONATION_SEND}-${foundationWalletId}`,
        related_wallet_id: foundationWalletId,
      }
    );

    // ==========================================================
    // CREDIT FOUNDATION
    // ==========================================================
    foundationWallet.usd_balance = Number(foundationWallet.usd_balance) + amountUsd;
    await manager.save(Wallet, foundationWallet);

    const creditTransaction = manager.create(Transaction, {
      wallet_id: foundationWallet.id,
      type_id: donationReceivedType.id,
      status_id: completedStatus.id,
      amount_usd: amountUsd,
      post_balance: foundationWallet.usd_balance,
      related_wallet_id: buyerWalletId,
      reference: `${TransactionCode.DONATION_RECEIVED}-${buyerWalletId}`,
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
      foundationUserId: foundationWallet.user_id,
      foundationWalletId: foundationWallet.id,
    };
  }
}
