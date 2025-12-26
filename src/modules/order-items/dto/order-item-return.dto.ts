// dto/order-item-return.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class OrderItemReturnDto {
  @ApiProperty({
    description: 'ID del item de la orden',
    example: '7c9a2c4e-1c6b-4d3f-9a8b-6b3e2f0a9d12',
  })
  @IsUUID()
  order_item_id: string;

  @ApiProperty({
    description: 'Cantidad devuelta del item',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  returned_quantity: number;
}
