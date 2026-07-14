import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository } from 'typeorm';

import { GiftCard } from '../entities/gift-card.entity';

@Injectable()
export class DeleteGiftCardUseCase {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,
  ) {}

  async execute(
    id: string,
  ): Promise<void> {
    const giftCard =
      await this.giftCardRepository.findOne({
        where: {
          id,
          deleted_at: IsNull(),
        },
      });

    if (!giftCard) {
      throw new NotFoundException(
        'Gift card not found',
      );
    }

    // =========================================================================
    // HARD DELETE
    // If the gift card was never sold
    // =========================================================================

    if (giftCard.sold_quantity === 0) {
      await this.giftCardRepository.remove(
        giftCard,
      );

      return;
    }

    // =========================================================================
    // SOFT DELETE
    // If the gift card already has sales history
    // =========================================================================

    await this.giftCardRepository.softDelete(
      giftCard.id,
    );
  }
}