import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsWhere,
  ILike,
  IsNull,
  Repository,
} from 'typeorm';

import { GiftCard } from '../entities/gift-card.entity';

import { PaginationDto } from '../dto/pagination.dto';

import { PaginatedGiftCardsResponseDto } from '../dto/paginated-gift-cards-response.dto';

import { GiftCardMapperService } from '../services/gift-card-mapper.service';

@Injectable()
export class GetGiftCardsUseCase {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,

    private readonly mapperService: GiftCardMapperService,
  ) {}

  async execute(
    paginationDto: PaginationDto,
  ): Promise<PaginatedGiftCardsResponseDto> {
    const page =
      Number(paginationDto.page) || 1;

    const limit =
      Number(paginationDto.limit) || 10;

    const search =
      paginationDto.name?.trim();

    const skip = (page - 1) * limit;

    // =========================================================================
    // WHERE
    // =========================================================================

    const where: FindOptionsWhere<GiftCard> = {
      deleted_at: IsNull(),
    };

    if (search) {
      where.name = ILike(
        `%${search}%`,
      );
    }

    // =========================================================================
    // QUERY
    // =========================================================================

    const [giftCards, total] =
      await this.giftCardRepository.findAndCount(
        {
          where,

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