import { Injectable } from '@nestjs/common';

import { GiftCard } from '../entities/gift-card.entity';

import { GiftCardResponseDto } from '../dto/gift-card-response.dto';

@Injectable()
export class GiftCardMapperService {
  toResponseDto(
    giftCard: GiftCard,
  ): GiftCardResponseDto {
    return {
      id: giftCard.id,

      name: giftCard.name,

      description:
        giftCard.description,

      image_url:
        giftCard.image_url,

      amount: Number(
        giftCard.amount,
      ),

      currency:
        giftCard.currency,

      expiration_days:
        giftCard.expiration_days,

      is_active:
        giftCard.is_active,

      created_at:
        giftCard.created_at,

      updated_at:
        giftCard.updated_at,
    };
  }
}