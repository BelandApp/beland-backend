import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayphoneOrderDto {
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

  @ApiPropertyOptional({
    description: 'UUID de la GiftCard a utilizar opcionalmente',
  })
  @IsOptional()
  @IsUUID()
  userGiftCardId?: string;
}
