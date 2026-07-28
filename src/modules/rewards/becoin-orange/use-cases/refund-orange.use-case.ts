import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from '../../../wallets/entities/wallet.entity';
import { Transaction } from '../../../transactions/entities/transaction.entity';
import { TransactionType } from '../../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../../transaction-state/entities/transaction-state.entity';

@Injectable()
export class RefundOrangeUseCase {
  constructor() {}

  async execute(
    manager: EntityManager,
    walletId: string,
    amountOrange: number,
    referenceMsg: string = 'Reembolso de Orange',
    externalReferenceId?: string,
  ): Promise<void> {
    if (amountOrange <= 0) {
      throw new BadRequestException('El monto de Orange a reembolsar debe ser mayor a cero.');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada.');
    }

    wallet.becoin_orange = Number(wallet.becoin_orange || 0) + Number(amountOrange);
    await manager.save(Wallet, wallet);

    // Utilizamos ORANGE_REFUND para reingresar el saldo a la wallet
    const type = await manager.findOne(TransactionType, { where: { code: 'ORANGE_REFUND' } });
    if (!type) throw new InternalServerErrorException('No se encontró el tipo ORANGE_REFUND.');

    const status = await manager.findOne(TransactionState, { where: { code: 'COMPLETED' } });
    if (!status) throw new InternalServerErrorException('No se encontró el estado COMPLETED.');

    const transaction = manager.create(Transaction, {
      wallet_id: wallet.id,
      type_id: type.id,
      status_id: status.id,
      amount_usd: 0,
      post_balance: wallet.usd_balance,
      amount_orange: amountOrange,
      post_orange_balance: wallet.becoin_orange,
      reference: referenceMsg,
      external_reference_id: externalReferenceId,
    });

    await manager.save(Transaction, transaction);
  }
}
