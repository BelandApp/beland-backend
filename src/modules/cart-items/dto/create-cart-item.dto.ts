import { IsUUID, IsInt, Min, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'ID del carrito al que pertenece el ítem',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  cart_id: string;

  @ApiProperty({
    description: 'ID del producto agregado al carrito',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 19.99,
    type: Number,
    format: 'float',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  unit_price: number;

  @ApiPropertyOptional({
    description: 'Precio unitario del producto en Becoin',
    example: 399,
    type: Number,
    format: 'float',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  unit_becoin?: number;
}
