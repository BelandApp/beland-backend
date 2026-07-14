import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { EventPass } from 'src/modules/event-pass/entities/event-pass.entity'; 
import { UserEventPass } from 'src/modules/user-event-pass/entities/user-event-pass.entity';

import { Wallet } from 'src/modules/wallets/entities/wallet.entity';

import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';

import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';

import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum'; 

import { PaymentProviderEnum } from 'src/modules/transactions/enums/transaction.enums';

export interface PurchaseEventPassUseCaseInput {
  eventPassId: string;

  userId: string;

  paymentProvider: PaymentProviderEnum;

  paymentReferenceId: string;

  holderName: string;

  holderInstagramTiktok: string;

  holderPhone?: string;

  holderEmail?: string;

  reference?: string;
}

@Injectable()
export class PurchaseEventPassUseCase {
  constructor(
    private readonly superadminConfig: SuperadminConfigService,
  ) {}

  async execute(
    manager: EntityManager,
    input: PurchaseEventPassUseCaseInput,
  ): Promise<UserEventPass> {
    const {
      eventPassId,
      userId,
      paymentProvider,
      paymentReferenceId,
      holderName,
      holderInstagramTiktok,
      holderPhone,
      holderEmail,
      reference,
    } = input;

    // ==========================================================
    // EVENT PASS
    // ==========================================================

    const eventPass = await manager.findOne(EventPass, {
      where: {
        id: eventPassId,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!eventPass) {
      throw new NotFoundException(
        'Event pass not found',
      );
    }

    if (!eventPass.is_active) {
      throw new ConflictException(
        'Event pass inactive',
      );
    }

    if (!eventPass.available) {
      throw new ConflictException(
        'Event pass unavailable',
      );
    }

    // ==========================================================
    // STOCK
    // ==========================================================

    if (
      eventPass.limit_tickets > 0 &&
      eventPass.sold_tickets >= eventPass.limit_tickets
    ) {
      throw new ConflictException(
        'No tickets available',
      );
    }

    // ==========================================================
    // STATUS COMPLETED
    // ==========================================================

    const completedStatus =
      await manager.findOne(TransactionState, {
        where: {
          code: StatusCode.COMPLETED,
        },
      });

    if (!completedStatus) {
      throw new ConflictException(
        'Completed status not found',
      );
    }

    // ==========================================================
    // SUPERADMIN WALLET
    // ==========================================================

    const superAdminWallet =
      await manager.findOne(Wallet, {
        where: {
          id: this.superadminConfig.getWalletId(),
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

    if (!superAdminWallet) {
      throw new InternalServerErrorException(
        'Superadmin wallet not found',
      );
    }

    // ==========================================================
    // SALE TYPE
    // ==========================================================

    const saleType =
      await manager.findOne(TransactionType, {
        where: {
          code: TransactionCode.SALE_EVENTPASS,
        },
      });

    if (!saleType) {
      throw new ConflictException(
        'SALE_EVENTPASS type not found',
      );
    }

    // ==========================================================
    // CREDIT SUPERADMIN
    // ==========================================================

    const amountUsd =
      Number(eventPass.total_usd ?? eventPass.price_usd);

    superAdminWallet.usd_balance =
      Number(superAdminWallet.usd_balance) +
      amountUsd;

    await manager.save(
      Wallet,
      superAdminWallet,
    );

    // ==========================================================
    // TRANSACTION
    // ==========================================================

    await manager.save(Transaction, {
      wallet_id: superAdminWallet.id,

      type_id: saleType.id,

      status_id: completedStatus.id,

      amount_usd: amountUsd,

      post_balance:
        superAdminWallet.usd_balance,

      reference:
        reference ??
        `EVENTPASS-${eventPass.id}`,

      external_provider:
        paymentProvider,

      external_reference_id:
        paymentReferenceId,
    });

    // ==========================================================
    // USER EVENT PASS
    // ==========================================================

    const userEventPass =
      await manager.save(UserEventPass, {
        user_id: userId,

        event_pass_id: eventPass.id,

        holder_name: holderName,

        holder_instagram_tiktok:
          holderInstagramTiktok,

        holder_phone: holderPhone,

        holder_email: holderEmail,

        purchase_price: amountUsd,

        is_consumed: false,

        is_refunded: false,

        is_active: true,
      });

    // ==========================================================
    // SOLD TICKETS
    // ==========================================================

    eventPass.sold_tickets =
      Number(eventPass.sold_tickets) + 1;

    if (
      eventPass.limit_tickets > 0 &&
      eventPass.sold_tickets >= eventPass.limit_tickets
    ) {
      eventPass.available = false;
    }

    await manager.save(
      EventPass,
      eventPass,
    );

    return userEventPass;
  }
}