import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from '../../../wallets/entities/wallet.entity';
import { Transaction } from '../../../transactions/entities/transaction.entity';
import { TransactionType } from '../../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../../transaction-state/entities/transaction-state.entity';

@Injectable()
export class RevokeOrangeUseCase {
  constructor() {}

  async execute(
    manager: EntityManager,
    walletId: string,
    amountOrange: number,
    referenceMsg: string = 'Revocación de Orange',
    externalReferenceId?: string,
  ): Promise<void> {
    if (amountOrange <= 0) {
      throw new BadRequestException('El monto de Orange a revocar debe ser mayor a cero.');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada.');
    }

    const currentOrange = Number(wallet.becoin_orange || 0);
    // Revocamos hasta donde el saldo lo permita, sin dejarlo negativo
    const actualRevokeAmount = Math.min(amountOrange, currentOrange);

    if (actualRevokeAmount === 0) {
      // Si el saldo ya estaba en 0, no hay nada que revocar.
      return;
    }

    wallet.becoin_orange = currentOrange - actualRevokeAmount;
    await manager.save(Wallet, wallet);

    // Utilizamos ORANGE_REVOKE como un débito contable
    const type = await manager.findOne(TransactionType, { where: { code: 'ORANGE_REVOKE' } });
    if (!type) throw new InternalServerErrorException('No se encontró el tipo ORANGE_REVOKE.');

    const status = await manager.findOne(TransactionState, { where: { code: 'COMPLETED' } });
    if (!status) throw new InternalServerErrorException('No se encontró el estado COMPLETED.');

    const transaction = manager.create(Transaction, {
      wallet_id: wallet.id,
      type_id: type.id,
      status_id: status.id,
      amount_usd: 0,
      post_balance: wallet.usd_balance,
      amount_orange: -actualRevokeAmount, // Negativo porque se debita
      post_orange_balance: wallet.becoin_orange,
      reference: referenceMsg,
      external_reference_id: externalReferenceId,
    });

    await manager.save(Transaction, transaction);
  }
}
