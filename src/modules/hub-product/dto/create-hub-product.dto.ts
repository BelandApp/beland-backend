import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateHubProductDto {
  @ApiProperty({
    description: 'UUID del centro de acopio',
  })
  @IsUUID()
  hub_id: string;

  @ApiProperty({
    description: 'UUID del producto',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Cantidad disponible del producto en el centro de acopio',
    example: 100,
  })
  @IsInt()
  @Min(0)
  quantity: number;

    @ApiProperty({
    description: 'Cantidad minima que debe haber en stock',
    example: 10,
  })
  @IsInt()
  @Min(0)
  stock_min: number;
}
