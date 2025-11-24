import { IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopupDto {
  @ApiProperty({ description: 'Wallet id del usuario que recarga', example: 'uuid' })
  @IsUUID()
  walletId: string;

  @ApiProperty({ description: 'Monto en USD que el usuario quiere pagar', example: 5.00 })
  @IsNumber()
  @Min(0.01)
  amountUsd: number;
}
