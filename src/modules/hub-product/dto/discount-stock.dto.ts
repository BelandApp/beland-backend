import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DiscountStockDto {
  @ApiProperty({
    description: 'Cantidad a descontar del stock',
    example: 20,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
