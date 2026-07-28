import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { WithdrawDto } from '../dto/withdraw.dto';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../../transaction-type/enum/transaction-code';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../../transaction-state/enum/status.enum';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { UserWithdraw } from '../entities/user-withdraw.entity';
import { WalletPaymentService } from '../../wallets/wallet-payment.service';

@Injectable()
export class CreateWithdrawRequestUseCase {
  constructor(private readonly walletPaymentService: WalletPaymentService) {}

  async execute(
    user_id: string,
    dto: WithdrawDto,
    manager: EntityManager,
  ): Promise<{ walletUpdated: Wallet; userWithdraw: UserWithdraw }> {
    // 1) Buscar la wallet del usuario
    const wallet = await manager.findOne(Wallet, {
      where: { user_id },
    });
    if (!wallet) throw new NotFoundException('No se encuentra la billetera');

    // 2) Verificar saldo suficiente
    if (+wallet.usd_balance < +dto.amount_usd)
      throw new BadRequestException('Saldo insuficiente');

    // 3) Obtener tipo de transacción 'WITHDRAW'
    const type = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.WITHDRAW },
    });
    if (!type)
      throw new ConflictException(
        'No se encuentra el tipo ',
        TransactionCode.WITHDRAW,
      );

    // 4) Obtener estado 'PENDING'
    const status = await manager.findOne(TransactionState, {
      where: { code: StatusCode.PENDING },
    });
    if (!status)
      throw new ConflictException("No se encuentra el estado ", StatusCode.PENDING);

    // 5) Reservar fondos: debitar del saldo disponible y aumentar el saldo bloqueado
    const tx = await this.walletPaymentService.lockFunds(
      manager,
      wallet.id,
      +dto.amount_usd,
      { type, status }
    );

    // Recuperamos la wallet actualizada para retornarla (opcional, WalletPaymentService ya la guardó)
    const walletUpdated = await manager.findOne(Wallet, { where: { id: wallet.id } });

    // 7) Registrar la solicitud de retiro del usuario
    const userWithdraw = await manager.save(UserWithdraw, {
      user_id,
      wallet_id: wallet.id,
      withdraw_account_id: dto.withdraw_account_id,
      amount_usd: +dto.amount_usd,
      status_id: status.id,
      transaction_id: tx.id,
    });

    return { walletUpdated, userWithdraw };
  }
}
