import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseGiftCardDto {
  @ApiProperty({
    example: 'e7b5c8f2-5f52-4e6d-97fd-2d7d34f95d77',
    description: 'ID del template de gift card',
  })
  @IsUUID()
  giftCardId: string;

  @ApiProperty({
    example: 'b62f6f08-5b2e-44ea-ae72-f6c0b4d7c7d1',
    description: 'Wallet destinataria',
  })
  @IsUUID()
  recipientWalletId: string;

  @ApiProperty({
    example: 'pi_3S8xKcD1D7cPxxxxxxx',
    description: 'External payment identifier from Payphone',
  })
  @IsString()
  paymentReferenceId: string;

  @ApiPropertyOptional({
    example: 'REF123456789',
    description: 'Optional reference code',
  })
  @IsOptional()
  @IsString()
  referenceCode?: string;
}
