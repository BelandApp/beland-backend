import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  IsNull,
  Repository,
} from 'typeorm';

import { GiftCard } from '../entities/gift-card.entity';

import { GiftCardResponseDto } from '../dto/gift-card-response.dto';

import { GiftCardMapperService } from '../services/gift-card-mapper.service';

@Injectable()
export class ToggleGiftCardStatusUseCase {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,

    private readonly mapperService: GiftCardMapperService,
  ) {}

  async execute(
    id: string,
  ): Promise<GiftCardResponseDto> {
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
    // TOGGLE STATUS
    // =========================================================================

    giftCard.is_active =
      !giftCard.is_active;

    const updatedGiftCard =
      await this.giftCardRepository.save(
        giftCard,
      );

    return this.mapperService.toResponseDto(
      updatedGiftCard,
    );
  }
}