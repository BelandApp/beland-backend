import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RechargeTransfer } from '../entities/user-recharge.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../../transaction-state/enum/status.enum';
import { RechargeUseCase } from '../../wallets/use-cases/recharge.use-case';
import { PaymentProviderEnum } from '../../transactions/enums/transaction.enums';
import { RechargeLimitPolicy } from '../../wallets/policies/recharge-limit.policy';

@Injectable()
export class CompleteTransferRechargeUseCase {
  constructor(
    private readonly rechargeUseCase: RechargeUseCase,
    private readonly rechargeLimitPolicy: RechargeLimitPolicy,
  ) {}

  async execute(manager: EntityManager, rechargeTransferId: string): Promise<RechargeTransfer> {
    const rechargeTransfer = await manager.findOne(RechargeTransfer, {
      where: { id: rechargeTransferId },
      relations: { status: true },
    });
    
    if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');
    if (rechargeTransfer.status.name === StatusCode.COMPLETED) throw new BadRequestException('La recarga ya esta en estado COMPLETADA.');
    if (rechargeTransfer.status.name === StatusCode.PARTIAL) throw new BadRequestException('La recarga ya esta en estado PARCIAL.');
    if (rechargeTransfer.status.name === StatusCode.FAILED) throw new BadRequestException('La recarga ya fue registrada como FALLIDA.');

    const wallet = await manager.findOne(Wallet, {
      where: { user_id: rechargeTransfer.user_id },
    });
    if (!wallet) throw new NotFoundException('No se encontro la Billetera del usuario');

    // Calculate how much we can actually recharge
    const requestedAmount = Number(rechargeTransfer.amount_usd);
    const availableQuota = this.rechargeLimitPolicy.getAvailableRechargeQuota(wallet);
    
    if (availableQuota <= 0) {
       throw new BadRequestException('El usuario ya alcanzó el límite máximo de recarga. Rechace la transferencia y proceda a devolver el dinero manualmente.');
    }

    const amountToCredit = Math.min(requestedAmount, availableQuota);
    const refundedAmount = requestedAmount - amountToCredit;
    
    const finalStatusCode = refundedAmount > 0 ? StatusCode.PARTIAL : StatusCode.COMPLETED;
    
    const status = await manager.findOne(TransactionState, { where: { code: finalStatusCode } });
    if (!status) throw new NotFoundException(`No se encontro el estado de transaccion ${finalStatusCode}`);

    // Call the final financial use case with the allowed amount
    const rechargeResult = await this.rechargeUseCase.execute(manager, {
      walletId: wallet.id,
      amountUsd: amountToCredit,
      paymentProvider: PaymentProviderEnum.TRANSFER,
      paymentReferenceId: rechargeTransfer.transfer_id,
      referenceCode: rechargeTransfer.id,
    });

    rechargeTransfer.status = status;
    rechargeTransfer.transaction_id = rechargeResult.rechargeTransactionId;
    rechargeTransfer.refunded_amount = refundedAmount > 0 ? refundedAmount : 0;
    
    return await manager.save(RechargeTransfer, rechargeTransfer);
  }
}
