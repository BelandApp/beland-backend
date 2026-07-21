import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RechargeTransfer } from '../entities/user-recharge.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { RechargeLimitPolicy } from '../../wallets/policies/recharge-limit.policy';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../../transaction-state/enum/status.enum';

export interface RequestTransferRechargeDto {
  user_id: string;
  amount_usd: number;
  payment_account_id: string;
  transfer_id: string;
  ticket_image_url: string;
}

@Injectable()
export class RequestTransferRechargeUseCase {
  constructor(private readonly rechargeLimitPolicy: RechargeLimitPolicy) {}

  async execute(manager: EntityManager, input: RequestTransferRechargeDto): Promise<RechargeTransfer> {
    const wallet = await manager.findOne(Wallet, { where: { user_id: input.user_id } });
    if (!wallet) throw new NotFoundException('No se encontro la Billetera del usuario');

    // Validación temprana para asegurar que haya cupo disponible
    this.rechargeLimitPolicy.assertHasRechargeQuota(wallet);

    const status = await manager.findOne(TransactionState, { where: { code: StatusCode.PENDING } });
    if (!status) throw new NotFoundException(`No se encontro el estado de transaccion ${StatusCode.PENDING}`);

    const rechargeTransfer = manager.create(RechargeTransfer, {
      user_id: input.user_id,
      status: status,
      amount_usd: input.amount_usd,
      payment_account_id: input.payment_account_id,
      transfer_id: input.transfer_id,
      ticket_image_url: input.ticket_image_url,
      transaction_id: null,
      refunded_amount: null,
    });

    return await manager.save(RechargeTransfer, rechargeTransfer);
  }
}
