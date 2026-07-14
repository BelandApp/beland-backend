import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

import { UserGiftCardResponseDto } from '../dto/user-gift-card-response.dto';

import { UserGiftCardMapperService } from '../services/user-gift-card-mapper.service';

@Injectable()
export class CancelUserGiftCardUseCase {
  constructor(
    @InjectRepository(UserGiftCard)
    private readonly userGiftCardRepository: Repository<UserGiftCard>,

    private readonly mapperService: UserGiftCardMapperService,
  ) {}

  async execute(
    id: string,
  ): Promise<UserGiftCardResponseDto> {
    const userGiftCard =
      await this.userGiftCardRepository.findOne({
        where: {
          id
        },

        relations: {
          gift_card: true,
        },
      });

    if (!userGiftCard) {
      throw new NotFoundException(
        'User gift card not found',
      );
    }

    // =========================================================================
    // VALIDATIONS
    // =========================================================================

    if (
      userGiftCard.status ===
      UserGiftCardStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Gift card is already cancelled',
      );
    }

    if (
      userGiftCard.status ===
      UserGiftCardStatus.REDEEMED
    ) {
      throw new BadRequestException(
        'Redeemed gift cards cannot be cancelled',
      );
    }

    if (
      Number(
        userGiftCard.current_balance,
      ) <
      Number(
        userGiftCard.original_balance,
      )
    ) {
      throw new BadRequestException(
        'Gift card already has balance consumption',
      );
    }

    // =========================================================================
    // CANCEL
    // =========================================================================

    userGiftCard.status =
      UserGiftCardStatus.CANCELLED;

    userGiftCard.is_active = false;

    const updatedGiftCard =
      await this.userGiftCardRepository.save(
        userGiftCard,
      );

    // =========================================================================
    // TODO
    // =========================================================================
    //
    // Future improvements:
    //
    // - refund payment
    // - send notification
    // - audit log
    // - admin reason
    // - cancellation metadata
    //
    // =========================================================================

    return this.mapperService.toResponseDto(
      updatedGiftCard,
    );
  }
}