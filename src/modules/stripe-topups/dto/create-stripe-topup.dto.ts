import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateStripeTopupDto {
  @ApiProperty({
    example: 25.5,
    description: 'Monto en USD a recargar con hasta 2 decimales',
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'amountUsd debe ser un numero con hasta 2 decimales' },
  )
  @Min(0.5, { message: 'amountUsd debe ser mayor o igual a 0.50 USD' })
  @Max(10000, { message: 'amountUsd no puede superar 10000 USD' })
  amountUsd: number;
}
