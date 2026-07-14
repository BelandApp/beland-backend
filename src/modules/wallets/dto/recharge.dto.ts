import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaymentProviderEnum } from 'src/modules/transactions/enums/transaction.enums'; 

export class RechargeDto {

  @ApiPropertyOptional({
    description: 'Id de la wallet que hizo la recarga',
  })
  @IsOptional()
  @IsUUID()
  walletId?: string;

  @ApiProperty({
    example: 50,
    description: 'Amount in USD to recharge',
  })
  @IsNumber()
  @Type(() => Number)
  amountUsd: number;

  @ApiProperty({
    example: 'REF123456789',
    description: 'Reference code for tracking',
  })
  @IsString()
  referenceCode: string;

  @ApiProperty({
    enum: PaymentProviderEnum,
    example: PaymentProviderEnum.STRIPE,
    description: 'Payment provider',
  })
  @IsEnum(PaymentProviderEnum)
  paymentProvider: PaymentProviderEnum;

  @ApiProperty({
    example: 'pi_3S8xKcD1D7cPxxxxxxx',
    description: 'External payment identifier',
  })
  @IsString()
  paymentReferenceId: string;
}

export class RechargeResponseDto {
  @ApiProperty()
  walletId: string;

  @ApiProperty()
  amountUsd: number;

  @ApiProperty()
  usdBalance: number;

  @ApiProperty()
  becoinOrangeBalance: number;

  @ApiProperty()
  rechargeTransactionId: string;

  @ApiProperty({
    nullable: true,
  })
  orangeTransactionId?: string;
}