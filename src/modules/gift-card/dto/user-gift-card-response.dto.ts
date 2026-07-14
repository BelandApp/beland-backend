import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

export class UserGiftCardResponseDto {
  // ===========================================================================
  // MAIN
  // ===========================================================================

  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  message?: string;

  // ===========================================================================
  // GIFT CARD TEMPLATE
  // ===========================================================================

  @ApiProperty()
  gift_card_id: string;

  @ApiProperty()
  gift_card_name: string;

  @ApiPropertyOptional()
  gift_card_image_url?: string;

  // ===========================================================================
  // USERS
  // ===========================================================================

  @ApiProperty()
  sender_user_id: string;

  @ApiProperty()
  recipient_wallet_id: string;

  // ===========================================================================
  // BALANCE
  // ===========================================================================

  @ApiProperty()
  original_balance: number;

  @ApiProperty()
  current_balance: number;

  @ApiProperty()
  consumed_amount: number;

  // ===========================================================================
  // STATUS
  // ===========================================================================

  @ApiProperty({
    enum: UserGiftCardStatus,
  })
  status: UserGiftCardStatus;

  @ApiProperty()
  is_active: boolean;

  // ===========================================================================
  // DATES
  // ===========================================================================

  @ApiPropertyOptional()
  redeemed_at?: Date;

  @ApiPropertyOptional()
  expires_at?: Date;

  @ApiPropertyOptional()
  last_used_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}