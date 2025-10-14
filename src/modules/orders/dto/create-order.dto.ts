import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNumber, IsDateString } from 'class-validator';

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
    description: 'Cantidad total de ítems en la orden',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  total_items?: number;

  @ApiProperty({
    description: 'Fecha y hora estimada de entrega de la orden',
    example: '2025-10-13T15:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  delivery_at?: Date;
}
