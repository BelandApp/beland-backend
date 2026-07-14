import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginationDto } from './pagination.dto';

import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

export class GetUserGiftCardsDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: UserGiftCardStatus,
  })
  @IsOptional()
  @IsEnum(UserGiftCardStatus)
  status?: UserGiftCardStatus;

  @ApiPropertyOptional()
  @IsOptional()
  expired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sender_user_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recipient_wallet_id?: string;
}