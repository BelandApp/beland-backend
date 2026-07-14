import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateUserGiftCardDto {
  @ApiProperty({
    example: 'e7b5c8f2-5f52-4e6d-97fd-2d7d34f95d77',
    description: 'ID del template de gift card',
  })
  @IsUUID()
  gift_card_id: string;

  @ApiProperty({
    example: 'b62f6f08-5b2e-44ea-ae72-f6c0b4d7c7d1',
    description: 'Wallet destinataria',
  })
  @IsUUID()
  recipient_wallet_id: string;

  @ApiPropertyOptional({
    example: 'Feliz cumpleaños 🎉',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  message?: string;
}