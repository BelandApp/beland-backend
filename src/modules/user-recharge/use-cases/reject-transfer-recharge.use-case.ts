import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RechargeTransfer } from '../entities/user-recharge.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../../transaction-state/enum/status.enum';

@Injectable()
export class RejectTransferRechargeUseCase {
  async execute(manager: EntityManager, rechargeTransferId: string): Promise<RechargeTransfer> {
    const status = await manager.findOne(TransactionState, { where: { code: StatusCode.FAILED } });
    if (!status) throw new NotFoundException(`No se encontro el estado de transaccion ${StatusCode.FAILED}`);
    
    const rechargeTransfer = await manager.findOne(RechargeTransfer, {
      where: { id: rechargeTransferId },
      relations: { status: true }
    });
    
    if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');
    if (rechargeTransfer.status.name === StatusCode.COMPLETED) throw new BadRequestException('La recarga ya esta en estado COMPLETADA.');
    if (rechargeTransfer.status.name === StatusCode.PARTIAL) throw new BadRequestException('La recarga ya esta en estado PARCIAL.');
    if (rechargeTransfer.status.name === StatusCode.FAILED) throw new BadRequestException('La recarga ya fue registrada como FALLIDA.');

    rechargeTransfer.status = status;
    return await manager.save(RechargeTransfer, rechargeTransfer);
  }
}
