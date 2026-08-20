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
import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';

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
    private readonly walletPaymentService: WalletPaymentService,
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

    const amountUsd =
      Number(eventPass.total_usd ?? eventPass.price_usd);

    console.log('\n====== DEBUG COMPRA EVENTPASS ======');
    console.log('EventPass ID:', eventPass.id);
    console.log('EventPass Cargado completo:', JSON.stringify(eventPass, null, 2));
    console.log('Valor raw total_usd:', eventPass.total_usd, ' (Type:', typeof eventPass.total_usd, ')');
    console.log('Valor raw price_usd:', eventPass.price_usd, ' (Type:', typeof eventPass.price_usd, ')');
    console.log('amountUsd calculado (despues de Number):', amountUsd, ' (Type:', typeof amountUsd, ')');
    console.log('¿Entra al bloque financiero (amountUsd > 0)?:', amountUsd > 0);
    console.log('====================================\n');

    if (amountUsd > 0) {
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
      // ORGANIZER WALLET
      // ==========================================================

      const organizerWallet =
        await manager.findOne(Wallet, {
          where: {
            user_id: eventPass.created_by_id,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

      if (!organizerWallet) {
        throw new InternalServerErrorException(
          'Organizer wallet not found',
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
      // INTERNAL WALLET DEBIT
      // ==========================================================

      if (paymentProvider === PaymentProviderEnum.WALLET) {
        const userWallet = await manager.findOne(Wallet, {
          where: {
            user_id: userId,
          },
        });

        if (!userWallet) {
          throw new NotFoundException('User wallet not found');
        }

        await this.walletPaymentService.processPayment(
          manager,
          userWallet.id,
          amountUsd,
          {
            type_id: saleType.id,
            status_id: completedStatus.id,
            reference: reference ?? `EVENTPASS-${eventPass.id}`,
            external_provider: paymentProvider,
            external_reference_id: paymentReferenceId,
          }
        );
      }

      // ==========================================================
      // CREDIT ORGANIZER
      // ==========================================================

      organizerWallet.usd_balance =
        Number(organizerWallet.usd_balance) +
        amountUsd;

      await manager.save(
        Wallet,
        organizerWallet,
      );

      // ==========================================================
      // TRANSACTION
      // ==========================================================

      await manager.save(Transaction, {
        wallet_id: organizerWallet.id,

        type_id: saleType.id,

        status_id: completedStatus.id,

        amount_usd: amountUsd,

        post_balance:
          organizerWallet.usd_balance,

        reference:
          reference ??
          `EVENTPASS-${eventPass.id}`,

        external_provider:
          paymentProvider,

        external_reference_id:
          paymentReferenceId,
      });
    }

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