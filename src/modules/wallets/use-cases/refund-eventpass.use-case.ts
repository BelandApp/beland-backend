import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UserEventPass } from 'src/modules/user-event-pass/entities/user-event-pass.entity';
import { EventPass } from 'src/modules/event-pass/entities/event-pass.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';

import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { FinancialReversalService } from '../financial-reversal.service';

export interface RefundEventPassUseCaseInput {
  userId: string;
  userEventPassId: string;
}

@Injectable()
export class RefundEventPassUseCase {
  constructor(
    private readonly financialReversalService: FinancialReversalService,
  ) {}

  async execute(
    manager: EntityManager,
    input: RefundEventPassUseCaseInput,
  ): Promise<UserEventPass> {
    const { userId, userEventPassId } = input;

    // 1️⃣ Buscar la entrada adquirida y validar existencia con bloqueo
    const userPass = await manager.findOne(UserEventPass, {
      where: { id: userEventPassId, user_id: userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!userPass) {
      throw new NotFoundException('Entrada no encontrada.');
    }
    if (userPass.is_consumed) {
      throw new BadRequestException('La entrada ya fue utilizada y no puede devolverse.');
    }
    if (userPass.is_refunded || !userPass.is_active) {
      throw new BadRequestException('La entrada ya fue reembolsada o está inactiva.');
    }

    // Buscar evento con bloqueo
    const event = await manager.findOne(EventPass, {
      where: { id: userPass.event_pass_id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado.');
    }

    // 2️⃣ Validar si el evento permite devoluciones
    if (!event.is_refundable) {
      throw new BadRequestException('El evento no permite devoluciones.');
    }

    // 3️⃣ Validar que esté dentro del plazo permitido
    const now = new Date();
    const daysDiff = (event.event_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < event.refund_days_limit) {
      throw new BadRequestException(`Solo se permiten devoluciones hasta ${event.refund_days_limit} días antes del evento.`);
    }

    // 4️⃣ Resolver Billeteras (SIN bloqueo, FinancialReversalService se encarga del lock)
    const walletUser = await manager.findOne(Wallet, {
      where: { user_id: userId },
      select: ['id'],
    });

    const walletOrganizer = await manager.findOne(Wallet, {
      where: { user_id: event.created_by_id },
      select: ['id'],
    });

    const status = await manager.findOne(TransactionState, {
      where: { code: StatusCode.COMPLETED },
    });

    const typeRefund = await manager.findOne(TransactionType, {
      where: { code: TransactionCode.REFUND_EVENTPASS },
    });

    if (!walletUser) throw new NotFoundException('Billetera del usuario no encontrada.');
    if (!walletOrganizer) throw new NotFoundException('Billetera del organizador no encontrada.');
    if (!status || !typeRefund) throw new NotFoundException('Datos de tipo o estado de transacción incompletos.');

    const refundAmount = Number(userPass.purchase_price);

    // 5️⃣ Ejecutar reversión financiera mediante FinancialReversalService
    await this.financialReversalService.executeReversal(manager, {
      sourceWalletId: walletOrganizer.id, // Se debita del organizador
      destinationWalletId: walletUser.id, // Se acredita al usuario
      amountUsd: refundAmount,
      transactionData: {
        type_id: typeRefund.id,
        status_id: status.id,
        reference: 'REFUND EVENTPASS - ' + userPass.event_pass_id,
      },
    });

    // 6️⃣ Actualizar contador de tickets vendidos
    event.sold_tickets = Math.max(0, Number(event.sold_tickets) - 1);
    if ((Number(event.sold_tickets) + 1) === Number(event.limit_tickets)) {
      event.available = true;
    }
    await manager.save(EventPass, event);

    // 7️⃣ Desactivar o eliminar la entrada
    userPass.is_active = false;
    userPass.is_refunded = true;
    userPass.refunded_at = new Date();
    await manager.save(UserEventPass, userPass);

    return userPass;
  }
}
