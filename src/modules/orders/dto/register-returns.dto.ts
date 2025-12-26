// dto/register-returns.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemReturnDto } from '../../order-items/dto/order-item-return.dto';

export class RegisterReturnsDto {
  @ApiProperty({
    description: 'Listado de devoluciones de items de la orden',
    type: [OrderItemReturnDto],
    example: [
      {
        order_item_id: '7c9a2c4e-1c6b-4d3f-9a8b-6b3e2f0a9d12',
        returned_quantity: 1,
      },
      {
        order_item_id: 'b12a4c9d-4f32-4c6b-9e8d-123456789abc',
        returned_quantity: 0,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemReturnDto)
  returns: OrderItemReturnDto[];
}
