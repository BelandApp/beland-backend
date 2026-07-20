import { Injectable } from '@nestjs/common';

import { UserGiftCard } from '../entities/user-giftcard.entity';

import { UserGiftCardResponseDto } from '../dto/user-gift-card-response.dto';

@Injectable()
export class UserGiftCardMapperService {
  toResponseDto(
    entity: UserGiftCard,
  ): UserGiftCardResponseDto {
    return {
      // =======================================================================
      // MAIN
      // =======================================================================

      id: entity.id,

      message: entity.message,

      // =======================================================================
      // GIFT CARD TEMPLATE
      // =======================================================================

      gift_card_id:
        entity.gift_card_id,

      gift_card_name:
        entity.gift_card?.name,

      gift_card_image_url:
        entity.gift_card?.image_url,

      // =======================================================================
      // USERS
      // =======================================================================

      sender_user_id:
        entity.sender_user_id,

      recipient_wallet_id:
        entity.recipient_wallet_id,

      // =======================================================================
      // BALANCE
      // =======================================================================

      original_balance: Number(
        entity.original_balance,
      ),

      current_balance: Number(
        entity.current_balance,
      ),

      consumed_amount: Number(entity.original_balance) - Number(entity.current_balance),

      // =======================================================================
      // STATUS
      // =======================================================================

      status: entity.status,

      is_active:
        entity.is_active,

      // =======================================================================
      // DATES
      // =======================================================================

      redeemed_at:
        entity.redeemed_at,

      expires_at:
        entity.expires_at,

      last_used_at:
        entity.last_used_at,

      created_at:
        entity.created_at,

      updated_at:
        entity.updated_at,
    };
  }
}