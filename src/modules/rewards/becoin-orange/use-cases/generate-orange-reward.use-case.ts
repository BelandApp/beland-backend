import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from '../../../wallets/entities/wallet.entity';
import { Transaction } from '../../../transactions/entities/transaction.entity';
import { TransactionType } from '../../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../../transaction-state/entities/transaction-state.entity';

@Injectable()
export class GenerateOrangeRewardUseCase {
  constructor() {}

  async execute(
    manager: EntityManager,
    walletId: string,
    amountOrange: number,
    referenceMsg: string = 'Crédito promocional',
    externalReferenceId?: string,
  ): Promise<string> {
    if (amountOrange <= 0) {
      throw new BadRequestException('El monto de Orange a acreditar debe ser mayor a cero.');
    }

    // 1. Bloqueo pesimista de la Wallet para asegurar atomicidad
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet no encontrada para acreditar Orange.');
    }

    // 2. Incrementar becoin_orange respetando invariante (>= 0 se cumple al sumar monto positivo)
    wallet.becoin_orange = Number(wallet.becoin_orange || 0) + Number(amountOrange);
    await manager.save(Wallet, wallet);

    // 3. Buscar tipos y estados de transacción
    const type = await manager.findOne(TransactionType, { where: { code: 'ORANGE_CREDIT' } });
    if (!type) {
      throw new InternalServerErrorException('No se encontró el tipo de transacción ORANGE_CREDIT.');
    }

    const status = await manager.findOne(TransactionState, { where: { code: 'COMPLETED' } });
    if (!status) {
      throw new InternalServerErrorException('No se encontró el estado de transacción COMPLETED.');
    }

    // 4. Registrar el movimiento en Transaction
    // Se establece amount_usd en 0 ya que Orange no es dinero real ni pasivo financiero.
    // Los montos reales se registran en sus columnas correspondientes para mantener trazabilidad exacta.
    const transaction = manager.create(Transaction, {
      wallet_id: wallet.id,
      type_id: type.id,
      status_id: status.id,
      amount_usd: 0,
      post_balance: wallet.usd_balance, // post_balance financiero no se altera
      amount_orange: amountOrange,
      post_orange_balance: wallet.becoin_orange,
      reference: referenceMsg,
      external_reference_id: externalReferenceId,
    });

    await manager.save(Transaction, transaction);
    return transaction.id;
  }
}
