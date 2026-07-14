import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  IsNull,
  Repository,
} from 'typeorm';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { PaginatedUserGiftCardsResponseDto } from '../dto/paginated-user-gift-cards-response.dto';

import { UserGiftCardMapperService } from '../services/user-gift-card-mapper.service';
import { User } from 'src/modules/users/entities/users.entity';
import { Payload } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class GetMyReceivedGiftCardsUseCase {
  constructor(
    @InjectRepository(UserGiftCard)
    private readonly userGiftCardRepository: Repository<UserGiftCard>,

    private readonly mapperService: UserGiftCardMapperService,
  ) {}

  async execute(
    currentUser: Payload,
    paginationDto: PaginationDto,
  ): Promise<PaginatedUserGiftCardsResponseDto> {
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
            recipient_wallet_id:
              currentUser.wallet_id
          },

          relations: {
            gift_card: true,
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