import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WalletPaymentService } from '../wallet-payment.service';
import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { TransactionCode } from '../../transaction-type/enum/transaction-code';

export interface SendGiftCardParams {
  senderWalletId: string;
  recipientWalletId: string;
  amountUsd: number;
}

@Injectable()
export class SendGiftCardUseCase {
  constructor(
    private readonly walletPaymentService: WalletPaymentService,
  ) {}

  async execute(
    manager: EntityManager,
    params: SendGiftCardParams,
  ): Promise<{ transaction: Transaction; recipientUserId: string }> {
    // 1. Get Transaction Types and States
    const sendType = await manager.findOne(TransactionType, { where: { code: TransactionCode.GIFTCARD_SEND } });
    if (!sendType) throw new ConflictException(`No se encuentra el tipo ${TransactionCode.GIFTCARD_SEND}`);
    
    const receiveType = await manager.findOne(TransactionType, { where: { code: TransactionCode.GIFTCARD_RECEIVED } });
    if (!receiveType) throw new ConflictException(`No se encuentra el tipo ${TransactionCode.GIFTCARD_RECEIVED}`);

    const status = await manager.findOne(TransactionState, { where: { code: 'COMPLETED' } });
    if (!status) throw new ConflictException("No se encuentra el estado 'COMPLETED'");

    // 2. Process Sender Debit using WalletPaymentService
    // WalletPaymentService already checks existence and locks the wallet.
    const sendTransaction = await this.walletPaymentService.processPayment(
      manager,
      params.senderWalletId,
      params.amountUsd,
      {
        type: sendType,
        status: status,
        related_wallet_id: params.recipientWalletId,
        reference: `${TransactionCode.GIFTCARD_SEND}-${params.recipientWalletId}`,
      }
    );

    // 3. Process Recipient Credit
    const recipientWallet = await manager.findOne(Wallet, {
      where: { id: params.recipientWalletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!recipientWallet) throw new NotFoundException('Billetera destino no existe');

    recipientWallet.usd_balance = Number(recipientWallet.usd_balance) + params.amountUsd;
    await manager.save(Wallet, recipientWallet);

    const receiveTransaction = manager.create(Transaction, {
      wallet_id: recipientWallet.id,
      type: receiveType,
      status: status,
      amount_usd: params.amountUsd,
      post_balance: recipientWallet.usd_balance,
      related_wallet_id: params.senderWalletId,
      reference: `${TransactionCode.GIFTCARD_RECEIVED}-${params.senderWalletId}`,
    });
    await manager.save(Transaction, receiveTransaction);

    return { 
      transaction: sendTransaction,
      recipientUserId: recipientWallet.user_id 
    };
  }
}
