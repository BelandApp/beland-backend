import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { OwnerTopupEnum } from '../enums/owner-topups.enum';

export class CreateStripeTopupDto {
  @ApiProperty({
    example: 25.5,
    description: 'Monto en USD',
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'amountUsd debe ser un numero con hasta 2 decimales' },
  )
  @Min(0.5)
  @Max(10000)
  amountUsd: number;

  @ApiProperty({
    enum: OwnerTopupEnum,
    example: OwnerTopupEnum.RECHARGE,
  })
  @IsEnum(OwnerTopupEnum)
  @IsNotEmpty()
  owner: OwnerTopupEnum;

  @ApiPropertyOptional({
    description: 'Id del recurso asociado',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @ApiPropertyOptional({
    description:
      'Wallet destino para GiftCards',
  })
  @IsOptional()
  @IsUUID()
  recipient_wallet_id?: string;

  // =====================================================
  // EVENT PASS
  // =====================================================

  @ApiPropertyOptional({
    example: 'Juan Perez',
  })
  @IsOptional()
  @IsString()
  holder_name?: string;

  @ApiPropertyOptional({
    example: '@juanperez',
  })
  @IsOptional()
  @IsString()
  holder_instagram_tiktok?: string;

  @ApiPropertyOptional({
    example: '+5492246123456',
  })
  @IsOptional()
  @IsString()
  holder_phone?: string;

  @ApiPropertyOptional({
    example: 'juan@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  holder_email?: string;
}