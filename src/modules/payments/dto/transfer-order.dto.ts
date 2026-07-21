import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TransferOrderDto {
  @ApiProperty({ description: 'ID o número de comprobante de la transferencia' })
  @IsNotEmpty()
  @IsString()
  paymentReferenceId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceCode?: string;
}
