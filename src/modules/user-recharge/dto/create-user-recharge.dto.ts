import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateRechargeTransferDto {
  @ApiProperty({
    example: 'a3b7c1d2-9f12-4b0a-85d4-123456789abc',
    description: 'UUID de la cuenta de pago a la que se transfiere el dinero',
  })
  @IsUUID()
  @IsNotEmpty()
  payment_account_id: string;

  @ApiProperty({
    example: 150.75,
    description: 'Monto transferido en USD',
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El monto debe ser mayor que 0' })
  amount_usd: number;

  @ApiProperty({
    example: 'TRX1234567890',
    description: 'Identificador bancario de la transferencia',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  transfer_id: string;
}
