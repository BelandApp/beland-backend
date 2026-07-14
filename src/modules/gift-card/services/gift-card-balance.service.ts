import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  EntityManager,
} from 'typeorm';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

@Injectable()
export class GiftCardBalanceService {
  async consumeBalance(
    manager: EntityManager,

    userGiftCard: UserGiftCard,

    amount: number,
  ): Promise<{
    consumed_amount: number;
    remaining_amount: number;
    fully_consumed: boolean;
  }> {
    // =======================================================================
    // VALIDATIONS
    // =======================================================================

    if (!userGiftCard.is_active) {
      throw new BadRequestException(
        'Gift card is inactive',
      );
    }

    if (
      userGiftCard.status !==
      UserGiftCardStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Gift card is not usable',
      );
    }

    if (
      userGiftCard.expires_at &&
      userGiftCard.expires_at <
        new Date()
    ) {
      throw new BadRequestException(
        'Gift card is expired',
      );
    }

    const currentBalance = Number(
      userGiftCard.current_balance,
    );

    if (currentBalance <= 0) {
      throw new BadRequestException(
        'Gift card has no balance',
      );
    }

    // =======================================================================
    // CALCULATE
    // =======================================================================

    const consumedAmount =
      Math.min(
        currentBalance,
        amount,
      );

    const remainingAmount =
      currentBalance -
      consumedAmount;

    const fullyConsumed =
      remainingAmount <= 0;

    // =======================================================================
    // UPDATE ENTITY
    // =======================================================================

    userGiftCard.current_balance =
      remainingAmount;

    userGiftCard.last_used_at =
      new Date();

    // =======================================================================
    // FULLY REDEEMED
    // =======================================================================

    if (fullyConsumed) {
      userGiftCard.status =
        UserGiftCardStatus.REDEEMED;

      userGiftCard.redeemed_at =
        new Date();

      userGiftCard.is_active =
        false;
    }

    // =======================================================================
    // SAVE
    // =======================================================================

    await manager.save(
      UserGiftCard,
      userGiftCard,
    );

    // =======================================================================
    // RESPONSE
    // =======================================================================

    return {
      consumed_amount:
        consumedAmount,

      remaining_amount:
        remainingAmount,

      fully_consumed:
        fullyConsumed,
    };
  }

  // ===========================================================================
  // REFUND
  // ===========================================================================

  async refundBalance(
    manager: EntityManager,

    userGiftCard: UserGiftCard,

    amount: number,
  ): Promise<void> {
    const currentBalance = Number(
      userGiftCard.current_balance,
    );

    const originalBalance = Number(
      userGiftCard.original_balance,
    );

    const newBalance =
      currentBalance + amount;

    if (
      newBalance >
      originalBalance
    ) {
      throw new BadRequestException(
        'Refund exceeds original balance',
      );
    }

    userGiftCard.current_balance =
      newBalance;

    // =========================================================================
    // REACTIVATE IF NEEDED
    // =========================================================================

    if (
      userGiftCard.status ===
      UserGiftCardStatus.REDEEMED
    ) {
      userGiftCard.status =
        UserGiftCardStatus.ACTIVE;

      userGiftCard.is_active = true;

      userGiftCard.redeemed_at =
        null;
    }

    await manager.save(
      UserGiftCard,
      userGiftCard,
    );
  }
}