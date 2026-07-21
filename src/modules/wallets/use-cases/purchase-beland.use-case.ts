import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { AmountToPayment } from 'src/modules/amount-to-payment/entities/amount-to-payment.entity';
import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';

export interface PurchaseBelandUseCaseInput {
  buyerWalletId: string;
  destinationWalletId: string;
  amountUsd: number;
  referenceCode: string;
  amountPaymentId: string | null;
}

export interface PurchaseBelandUseCaseResponse {
  transaction: Transaction;
}

@Injectable()
export class PurchaseBelandUseCase {
  constructor(
    private readonly walletPaymentService: WalletPaymentService,
  ) {}

  async execute(
    manager: EntityManager,
    input: PurchaseBelandUseCaseInput,
  ): Promise<PurchaseBelandUseCaseResponse> {
    const {
      buyerWalletId,
      destinationWalletId,
      amountUsd,
      referenceCode,
      amountPaymentId,
    } = input;

    // 1) Tipos y Estados
    const typeSend = await manager.findOne(TransactionType, {
      where: { code: 'PURCHASE_BELAND' },
    });
    if (!typeSend) throw new ConflictException("No se encuentra el tipo 'PURCHASE_BELAND'");

    const typeReceive = await manager.findOne(TransactionType, {
      where: { code: 'SALE_BELAND' },
    });
    if (!typeReceive) throw new ConflictException("No se encuentra el tipo 'SALE_BELAND'");

    const status = await manager.findOne(TransactionState, {
      where: { code: StatusCode.COMPLETED },
    });
    if (!status) throw new ConflictException("No se encuentra el estado 'COMPLETED'");

    // 2) Debitar Wallet Origen
    const txSend = await this.walletPaymentService.processPayment(
      manager,
      buyerWalletId,
      amountUsd,
      {
        type_id: typeSend.id,
        status_id: status.id,
        reference: referenceCode,
        related_wallet_id: destinationWalletId,
      },
    );

    // 3) Acreditar billetera destino administrativa
    const toWallet = await manager.findOne(Wallet, {
      where: { id: destinationWalletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (toWallet) {
      toWallet.usd_balance = Number(toWallet.usd_balance) + Number(amountUsd);
      await manager.save(Wallet, toWallet);

      // Registrar transacción de ingreso
      const txReceive = manager.create(Transaction, {
        wallet_id: toWallet.id,
        type_id: typeReceive.id,
        status_id: status.id,
        amount_usd: amountUsd,
        post_balance: toWallet.usd_balance,
        reference: `SALE_BELAND-${buyerWalletId}`,
        related_wallet_id: buyerWalletId,
      });
      await manager.save(Transaction, txReceive);
    }

    // 4) Eliminar AmountToPayment si corresponde
    if (amountPaymentId) {
      await manager.delete(AmountToPayment, { id: amountPaymentId });
    }

    return { transaction: txSend };
  }
}