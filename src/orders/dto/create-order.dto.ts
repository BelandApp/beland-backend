// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { StatusCode } from 'src/transaction-state/enum/status.enum';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID del grupo asociado a la orden' })
  @IsUUID()
  group_id: string;

  @ApiProperty({ description: 'ID del líder que inició la orden' })
  @IsUUID()
  leader_id: string;

  @ApiProperty({
    description: 'UUID Estado de la orden',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  status_id?: string;

  @ApiProperty({
    description: 'Total de la orden en monedas internas',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @ApiProperty({
    description: 'Total de la orden en monedas internas',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total_items?: number;
}
