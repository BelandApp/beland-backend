import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GiftCard } from "../entities/gift-card.entity";
import { Repository } from "typeorm";
import { GiftCardValidationService } from "../services/gift-card-validation.service";
import { GiftCardMapperService } from "../services/gift-card-mapper.service";
import { CreateGiftCardDto } from "../dto/create-gift-card.dto";
import { GiftCardResponseDto } from "../dto/gift-card-response.dto";

@Injectable()
export class CreateGiftCardUseCase {
  constructor(
    @InjectRepository(GiftCard)
    private readonly repository: Repository<GiftCard>,

    private readonly validationService:
      GiftCardValidationService,

    private readonly mapperService:
      GiftCardMapperService,
  ) {}

  async execute(
    dto: CreateGiftCardDto,
  ): Promise<GiftCardResponseDto> {
    this.validationService.validateAmount(
      dto.amount,
    );

    this.validationService.validateCurrency(
      dto.currency,
    );

    this.validationService.validateExpirationDays(
      dto.expiration_days,
    );

    const entity =
      this.repository.create({
        name: dto.name.trim(),
        description:
          dto.description?.trim() ||
          null,

        image_url:
          dto.image_url || null,

        amount: dto.amount,

        currency:
          dto.currency?.toUpperCase() ||
          'USD',

        expiration_days:
          dto.expiration_days ||
          null,

        is_active:
          dto.is_active ?? true,
      });

    const saved =
      await this.repository.save(
        entity,
      );

    return this.mapperService.toResponseDto(
      saved,
    );
  }
}