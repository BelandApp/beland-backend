import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserGiftCard } from '../entities/user-giftcard.entity';
import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

@Injectable()
export class GiftCardBalanceService {
  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  private async loadGiftCardWithLock(
    manager: EntityManager,
    giftCardId: string,
  ): Promise<UserGiftCard> {
    const giftCard = await manager.getRepository(UserGiftCard).findOne({
      where: { id: giftCardId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }

    return giftCard;
  }

  private recalculateStatus(userGiftCard: UserGiftCard): void {
    const currentBalance = Number(userGiftCard.current_balance);
    const reservedBalance = Number(userGiftCard.reserved_balance);
    
    // Si no queda nada de saldo (ni actual ni reservado), se marca como REDEEMED
    if (currentBalance === 0 && reservedBalance === 0) {
      userGiftCard.status = UserGiftCardStatus.REDEEMED;
      if (!userGiftCard.redeemed_at) {
        userGiftCard.redeemed_at = new Date();
      }
      userGiftCard.is_active = false;
    } else {
      // Si hay saldo, reactivarla en caso de que estuviera REDEEMED
      // siempre y cuando no se encuentre expirada.
      if (userGiftCard.status === UserGiftCardStatus.REDEEMED) {
        const isExpired = userGiftCard.expires_at && userGiftCard.expires_at < new Date();
        
        if (!isExpired) {
          userGiftCard.status = UserGiftCardStatus.ACTIVE;
          userGiftCard.is_active = true;
          userGiftCard.redeemed_at = null;
        }
      }
    }
  }

  private validateIsUsable(userGiftCard: UserGiftCard): void {
    if (!userGiftCard.is_active) {
      throw new BadRequestException('Gift card is inactive');
    }

    if (userGiftCard.status !== UserGiftCardStatus.ACTIVE) {
      throw new BadRequestException('Gift card is not usable');
    }

    if (userGiftCard.expires_at && userGiftCard.expires_at < new Date()) {
      throw new BadRequestException('Gift card is expired');
    }
  }

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  async reserve(
    manager: EntityManager,
    giftCardId: string,
    amount: number,
  ): Promise<void> {
    const userGiftCard = await this.loadGiftCardWithLock(manager, giftCardId);
    
    this.validateIsUsable(userGiftCard);

    const currentBalance = Number(userGiftCard.current_balance);
    const reservedBalance = Number(userGiftCard.reserved_balance);
    const amountToReserve = Number(amount);

    if (amountToReserve <= 0) {
      throw new BadRequestException('Reservation amount must be greater than zero');
    }

    if (currentBalance < amountToReserve) {
      throw new BadRequestException('Insufficient balance to reserve');
    }

    userGiftCard.current_balance = currentBalance - amountToReserve;
    userGiftCard.reserved_balance = reservedBalance + amountToReserve;

    this.recalculateStatus(userGiftCard);

    await manager.save(UserGiftCard, userGiftCard);
  }

  async consumeReserved(
    manager: EntityManager,
    giftCardId: string,
    amount: number,
  ): Promise<void> {
    const userGiftCard = await this.loadGiftCardWithLock(manager, giftCardId);

    // No validamos expiración aquí porque la reserva se hizo previamente
    // y el checkout tiene derecho a completarse.

    const reservedBalance = Number(userGiftCard.reserved_balance);
    const amountToConsume = Number(amount);

    if (amountToConsume <= 0) {
      throw new BadRequestException('Consume amount must be greater than zero');
    }

    if (reservedBalance < amountToConsume) {
      throw new BadRequestException('Insufficient reserved balance');
    }

    userGiftCard.reserved_balance = reservedBalance - amountToConsume;
    userGiftCard.last_used_at = new Date();

    this.recalculateStatus(userGiftCard);

    await manager.save(UserGiftCard, userGiftCard);
  }

  async consumeDirect(
    manager: EntityManager,
    giftCardId: string,
    amount: number,
  ): Promise<{ consumed_amount: number; remaining_amount: number; fully_consumed: boolean }> {
    const userGiftCard = await this.loadGiftCardWithLock(manager, giftCardId);

    this.validateIsUsable(userGiftCard);

    const currentBalance = Number(userGiftCard.current_balance);
    const amountRequested = Number(amount);

    if (amountRequested <= 0) {
      throw new BadRequestException('Consume amount must be greater than zero');
    }

    if (currentBalance <= 0) {
      throw new BadRequestException('Gift card has no balance');
    }

    // Comportamiento original: consume hasta el saldo disponible si el pedido es mayor.
    const consumedAmount = Math.min(currentBalance, amountRequested);
    userGiftCard.current_balance = currentBalance - consumedAmount;
    userGiftCard.last_used_at = new Date();

    this.recalculateStatus(userGiftCard);

    await manager.save(UserGiftCard, userGiftCard);

    return {
      consumed_amount: consumedAmount,
      remaining_amount: Number(userGiftCard.current_balance),
      fully_consumed: !userGiftCard.is_active && userGiftCard.status === UserGiftCardStatus.REDEEMED,
    };
  }

  async release(
    manager: EntityManager,
    giftCardId: string,
    amount: number,
  ): Promise<void> {
    const userGiftCard = await this.loadGiftCardWithLock(manager, giftCardId);

    const currentBalance = Number(userGiftCard.current_balance);
    const reservedBalance = Number(userGiftCard.reserved_balance);
    const amountToRelease = Number(amount);

    if (amountToRelease <= 0) {
      throw new BadRequestException('Release amount must be greater than zero');
    }

    if (reservedBalance < amountToRelease) {
      throw new BadRequestException('Release amount exceeds reserved balance');
    }

    userGiftCard.reserved_balance = reservedBalance - amountToRelease;
    userGiftCard.current_balance = currentBalance + amountToRelease;

    this.recalculateStatus(userGiftCard);

    await manager.save(UserGiftCard, userGiftCard);
  }

  async refund(
    manager: EntityManager,
    giftCardId: string,
    amount: number,
  ): Promise<void> {
    const userGiftCard = await this.loadGiftCardWithLock(manager, giftCardId);

    const currentBalance = Number(userGiftCard.current_balance);
    const reservedBalance = Number(userGiftCard.reserved_balance);
    const originalBalance = Number(userGiftCard.original_balance);
    const amountToRefund = Number(amount);

    if (amountToRefund <= 0) {
      throw new BadRequestException('Refund amount must be greater than zero');
    }

    // Una devolución nunca puede provocar que la suma
    // (saldo disponible + saldo reservado)
    // supere el saldo originalmente emitido.
    const newTotalBalance = currentBalance + reservedBalance + amountToRefund;

    if (newTotalBalance > originalBalance) {
      throw new BadRequestException('Refund exceeds original balance');
    }

    userGiftCard.current_balance = currentBalance + amountToRefund;

    this.recalculateStatus(userGiftCard);

    await manager.save(UserGiftCard, userGiftCard);
  }
}
