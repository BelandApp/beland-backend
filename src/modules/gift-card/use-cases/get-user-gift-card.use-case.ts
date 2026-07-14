import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { UserGiftCardResponseDto } from '../dto/user-gift-card-response.dto'; 

import { UserGiftCardMapperService } from '../services/user-gift-card-mapper.service'; 

import { UserGiftCardPolicy } from '../policies/user-gift-card.policy';
import { Payload } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class GetUserGiftCardUseCase {
  constructor(
    @InjectRepository(UserGiftCard)
    private readonly userGiftCardRepository: Repository<UserGiftCard>,

    private readonly mapperService: UserGiftCardMapperService,

    private readonly policy: UserGiftCardPolicy,
  ) {}

  async execute(
    id: string,
    currentUser: Payload,
  ): Promise<UserGiftCardResponseDto> {
    const userGiftCard =
      await this.userGiftCardRepository.findOne({
        where: {id},

        relations: {
          gift_card: true,
          sender_user: true,
          recipient_wallet: true,
        },
      });

    if (!userGiftCard) {
      throw new NotFoundException(
        'Gift card not found',
      );
    }

    // =========================================================================
    // POLICY
    // =========================================================================

    this.policy.canView(
      currentUser,
      userGiftCard,
    );

    return this.mapperService.toResponseDto(
      userGiftCard,
    );
  }
}