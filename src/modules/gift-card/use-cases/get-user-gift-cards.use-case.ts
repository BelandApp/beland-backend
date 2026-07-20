import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { GetUserGiftCardsDto } from '../dto/get-user-gift-cards.dto';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { PaginatedUserGiftCardsResponseDto } from '../dto/paginated-user-gift-cards-response.dto';

import { UserGiftCardMapperService } from '../services/user-gift-card-mapper.service';

@Injectable()
export class GetUserGiftCardsUseCase {
  constructor(
    @InjectRepository(UserGiftCard)
    private readonly userGiftCardRepository: Repository<UserGiftCard>,

    private readonly mapperService: UserGiftCardMapperService,
  ) {}

  async execute(
    dto: GetUserGiftCardsDto,
  ): Promise<PaginatedUserGiftCardsResponseDto> {
    const page =
      Number(dto.page) || 1;

    const limit =
      Number(dto.limit) || 10;

    const skip = (page - 1) * limit;

    const name =
      dto.name?.trim();

    // =========================================================================
    // QUERY BUILDER
    // =========================================================================

    const query =
      this.userGiftCardRepository
        .createQueryBuilder(
          'userGiftCard',
        )

        .leftJoinAndSelect(
          'userGiftCard.gift_card',
          'giftCard',
        )

        .leftJoinAndSelect(
          'userGiftCard.sender_user',
          'senderUser',
        )

        .leftJoinAndSelect(
          'userGiftCard.recipient_wallet',
          'recipientWallet',
        )

        .where(
          'userGiftCard.deleted_at IS NULL',
        );

    // =========================================================================
    // SEARCH
    // =========================================================================

    if (name) {
      query.andWhere(
        `
          (
            giftCard.name ILIKE :name
            OR userGiftCard.code ILIKE :name
            OR senderUser.email ILIKE :name
          )
        `,
        {
          name: `%${name}%`,
        },
      );
    }

    // =========================================================================
    // FILTERS
    // =========================================================================

    if (dto.status) {
      query.andWhere(
        'userGiftCard.status = :status',
        {
          status: dto.status,
        },
      );
    }

    if (
      dto.is_active !== undefined
    ) {
      query.andWhere(
        'userGiftCard.is_active = :is_active',
        {
          is_active:
            dto.is_active,
        },
      );
    }

    if (
      dto.expired === true
    ) {
      query.andWhere(
        `
          userGiftCard.expires_at IS NOT NULL
          AND userGiftCard.expires_at < NOW()
        `,
      );
    }

    if (
      dto.expired === false
    ) {
      query.andWhere(
        `
          (
            userGiftCard.expires_at IS NULL
            OR userGiftCard.expires_at > NOW()
          )
        `,
      );
    }

    if (dto.sender_user_id) {
      query.andWhere(
        `
          userGiftCard.sender_user_id =
          :sender_user_id
        `,
        {
          sender_user_id:
            dto.sender_user_id,
        },
      );
    }

    if (
      dto.recipient_wallet_id
    ) {
      query.andWhere(
        `
          userGiftCard.recipient_wallet_id =
          :recipient_wallet_id
        `,
        {
          recipient_wallet_id:
            dto.recipient_wallet_id,
        },
      );
    }

    // =========================================================================
    // ORDER
    // =========================================================================

    query.orderBy(
      'userGiftCard.created_at',
      'DESC',
    );

    // =========================================================================
    // PAGINATION
    // =========================================================================

    query.skip(skip);

    query.take(limit);

    // =========================================================================
    // EXECUTE
    // =========================================================================

    const [giftCards, total] =
      await query.getManyAndCount();

    // =========================================================================
    // RESPONSE
    // =========================================================================

    return {
      data: giftCards.map((giftCard) =>
        this.mapperService.toResponseDto(
          giftCard,
        ),
      ),

      total,

      page,

      limit,

      total_pages: Math.ceil(
        total / limit,
      ),
    };
  }
}