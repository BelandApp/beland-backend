import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserWithdraw } from '../entities/user-withdraw.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../../transaction-state/enum/status.enum';
import { WithdrawResponseDto } from '../dto/withdraw.dto';
import { WalletPaymentService } from '../../wallets/wallet-payment.service';

@Injectable()
export class FailWithdrawUseCase {
  constructor(private readonly walletPaymentService: WalletPaymentService) {}

  async execute(dto: WithdrawResponseDto, manager: EntityManager): Promise<UserWithdraw> {
    const { user_withdraw_id, observation, reference } = dto;

    // 0) Buscar el retiro del usuario
    const userWithdraw = await manager.findOne(UserWithdraw, {
      where: { id: user_withdraw_id },
    });
    if (!userWithdraw)
      throw new NotFoundException('No se encuentra el retiro del usuario');

    // Validar que permanezca en estado PENDING
    const pendingStatus = await manager.findOne(TransactionState, {
      where: { code: StatusCode.PENDING },
    });
    if (pendingStatus && userWithdraw.status_id !== pendingStatus.id) {
      throw new ConflictException('El retiro no se encuentra en estado PENDING');
    }

    // 1) Buscar la wallet del usuario
    const wallet = await manager.findOne(Wallet, {
      where: { user_id: userWithdraw.user_id },
    });
    if (!wallet) throw new NotFoundException('No se encuentra la billetera');

    // 2) Busco el registro de la transacción
    const transaction = await manager.findOne(Transaction, {
      where: { id: userWithdraw.transaction_id },
    });
    if (!transaction)
      throw new ConflictException(
        'No se encuentra la transaccion del retiro',
      );

    // 3) Obtener estado 'FAILED'
    const status = await manager.findOne(TransactionState, {
      where: { code: StatusCode.FAILED },
    });
    if (!status)
      throw new ConflictException("No se encuentra el estado ", StatusCode.FAILED);

    // 4 & 5) Regresar fondos y actualizar la transacción a estado FAILED
    await this.walletPaymentService.unlockFunds(
      manager,
      wallet.id,
      +userWithdraw.amount_usd,
      userWithdraw.transaction_id,
      { status_id: status.id, reference: reference ?? '' }
    );

    // 6) actualizo el retiro de usuario a estado FAILED
    userWithdraw.status_id = status.id;
    userWithdraw.observation = observation ?? '';
    userWithdraw.transaction_banck_id = reference ?? '';
    await manager.save(userWithdraw);

    return userWithdraw;
  }
}
