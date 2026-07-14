import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

@Injectable()
export class GiftCardValidationService {
  validateAmount(
    amount: number,
  ): void {
    if (amount <= 0) {
      throw new BadRequestException(
        'Gift card amount must be greater than zero',
      );
    }

    if (amount > 1000000) {
      throw new BadRequestException(
        'Gift card amount exceeds maximum allowed',
      );
    }
  }

  validateExpirationDays(
    expirationDays?: number,
  ): void {
    if (expirationDays == null) {
      return;
    }

    if (expirationDays <= 0) {
      throw new BadRequestException(
        'Expiration days must be greater than zero',
      );
    }

    if (expirationDays > 3650) {
      throw new BadRequestException(
        'Expiration days exceeds maximum allowed',
      );
    }
  }

  validateCurrency(
    currency?: string,
  ): void {
    if (!currency) {
      return;
    }

    const allowedCurrencies = [
      'USD',
      'ARS',
      'EUR',
    ];

    if (
      !allowedCurrencies.includes(
        currency.toUpperCase(),
      )
    ) {
      throw new BadRequestException(
        'Unsupported currency',
      );
    }
  }

   // ===========================================================================
  // USER GIFT CARD VALIDATIONS
  // ===========================================================================

  validateUsable(
    userGiftCard: UserGiftCard,
  ): void {
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
        'Gift card is not active',
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

    if (
      Number(
        userGiftCard.current_balance,
      ) <= 0
    ) {
      throw new BadRequestException(
        'Gift card has no balance',
      );
    }
  }

  validateOwnership(
    userGiftCard: UserGiftCard,

    walletId: string,
  ): void {
    if (
      userGiftCard.recipient_wallet_id !==
      walletId
    ) {
      throw new BadRequestException(
        'Gift card does not belong to this wallet',
      );
    }
  }

  validateEnoughBalance(
    userGiftCard: UserGiftCard,

    amount: number,
  ): void {
    const currentBalance = Number(
      userGiftCard.current_balance,
    );

    if (currentBalance < amount) {
      throw new BadRequestException(
        'Insufficient gift card balance',
      );
    }
  }
}
