import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GiftCard } from '../entities/gift-card.entity';

import { UpdateGiftCardDto } from '../dto/update-gift-card.dto';

import { GiftCardResponseDto } from '../dto/gift-card-response.dto';
import { GiftCardValidationService } from '../services/gift-card-validation.service';
import { GiftCardMapperService } from '../services/gift-card-mapper.service';

@Injectable()
export class UpdateGiftCardUseCase {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,

    private readonly validationService: GiftCardValidationService,

    private readonly mapperService: GiftCardMapperService,
  ) {}

  async execute(
    id: string,
    dto: UpdateGiftCardDto,
  ): Promise<GiftCardResponseDto> {
    const giftCard =
      await this.giftCardRepository.findOne({
        where: { id },
      });

    if (!giftCard) {
      throw new NotFoundException(
        'Gift card not found',
      );
    }

    // =========================================================================
    // VALIDATIONS
    // =========================================================================

    if (dto.amount !== undefined) {
      this.validationService.validateAmount(
        dto.amount,
      );
    }

    if (dto.currency !== undefined) {
      this.validationService.validateCurrency(
        dto.currency,
      );
    }

    if (
      dto.expiration_days !== undefined
    ) {
      this.validationService.validateExpirationDays(
        dto.expiration_days,
      );
    }

    // =========================================================================
    // UPDATE FIELDS
    // =========================================================================

    if (dto.name !== undefined) {
      giftCard.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      giftCard.description =
        dto.description?.trim() || null;
    }

    if (dto.image_url !== undefined) {
      giftCard.image_url =
        dto.image_url || null;
    }

    if (dto.amount !== undefined) {
      giftCard.amount = dto.amount;
    }

    if (dto.currency !== undefined) {
      giftCard.currency =
        dto.currency.toUpperCase();
    }

    if (
      dto.expiration_days !== undefined
    ) {
      giftCard.expiration_days =
        dto.expiration_days;
    }

    if (dto.is_active !== undefined) {
      giftCard.is_active =
        dto.is_active;
    }

    // =========================================================================
    // SAVE
    // =========================================================================

    const updatedGiftCard =
      await this.giftCardRepository.save(
        giftCard,
      );

    return this.mapperService.toResponseDto(
      updatedGiftCard,
    );
  }
}