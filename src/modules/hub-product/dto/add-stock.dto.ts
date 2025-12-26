import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddStockDto {
  @ApiProperty({
    description: 'Cantidad a agregar al stock',
    example: 50,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
