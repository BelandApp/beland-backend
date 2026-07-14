import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class MySentGiftCardResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  message?: string;

  // TEMPLATE

  @ApiProperty()
  gift_card_id: string;

  @ApiProperty()
  gift_card_name: string;

  @ApiPropertyOptional()
  gift_card_image_url?: string;

  // RECIPIENT

  @ApiProperty()
  recipient_user_id: string;

  @ApiProperty()
  recipient_user_email: string;

  // DATES

  @ApiPropertyOptional()
  expires_at?: Date;

  @ApiProperty()
  created_at: Date;
}