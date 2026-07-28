import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class TransferGiftCardDto {
  @ApiProperty({ description: 'ID de la Gift Card a comprar' })
  @IsNotEmpty()
  @IsUUID()
  giftCardId: string;

  @ApiProperty({ description: 'ID de la Billetera del destinatario' })
  @IsNotEmpty()
  @IsUUID()
  recipientWalletId: string;

  @ApiProperty({ description: 'ID o número de comprobante de la transferencia' })
  @IsNotEmpty()
  @IsString()
  paymentReferenceId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceCode?: string;
}
