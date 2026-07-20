import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  IsNull,
  Repository,
} from 'typeorm';

import { Payload } from 'src/modules/auth/dto/payload.dto';

import { PaginationDto } from '../dto/pagination.dto';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { MySentGiftCardResponseDto } from '../dto/my-sent-gift-card-response.dto';
import { PaginatedMySentGiftCardsResponseDto } from '../dto/paginated-my-sent-gift-cards-response.dto';

@Injectable()
export class GetMySentGiftCardsUseCase {
  constructor(
    @InjectRepository(UserGiftCard)
    private readonly userGiftCardRepository: Repository<UserGiftCard>,
  ) {}

  async execute(
    currentUser: Payload,
    paginationDto: PaginationDto,
  ): Promise<PaginatedMySentGiftCardsResponseDto> {
    const page =
      Number(paginationDto.page) || 1;

    const limit =
      Number(paginationDto.limit) || 10;

    const skip = (page - 1) * limit;

    // =========================================================================
    // QUERY
    // =========================================================================

    const [giftCards, total] =
      await this.userGiftCardRepository.findAndCount(
        {
          where: {
            sender_user_id:
              currentUser.id,

          },

          relations: {
            gift_card: true,
            recipient_wallet: {
              user: true,
            },
          },

          order: {
            created_at: 'DESC',
          },

          skip,
          take: limit,
        },
      );

    // =========================================================================
    // RESPONSE
    // =========================================================================

    const data: MySentGiftCardResponseDto[] =
      giftCards.map((giftCard) => ({
        id: giftCard.id,

        message:
          giftCard.message,

        // TEMPLATE
        gift_card_id:
          giftCard.gift_card_id,

        gift_card_name:
          giftCard.gift_card?.name,

        gift_card_image_url:
          giftCard.gift_card?.image_url,

        // RECIPIENT
        recipient_user_id:
          giftCard.recipient_wallet
            ?.user?.id,

        recipient_user_email:
          giftCard.recipient_wallet
            ?.user?.email,

        // DATES
        expires_at:
          giftCard.expires_at,

        created_at:
          giftCard.created_at,
      }));

    return {
      data,

      total,

      page,

      limit,

      total_pages: Math.ceil(
        total / limit,
      ),
    };
  }
}