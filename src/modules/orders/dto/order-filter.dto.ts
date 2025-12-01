import { Type } from 'class-transformer';
import { 
  IsOptional, 
  IsNumber, 
  IsDate, 
  IsString, 
  Min 
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderFilterDto {

  @ApiPropertyOptional({
    description: 'Monto mínimo del total de la orden',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  min_total?: number;

  @ApiPropertyOptional({
    description: 'Monto máximo del total de la orden',
    example: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_total?: number;

  @ApiPropertyOptional({
    description: 'ID del estado de la orden para filtrar',
    example: 'PAID',
  })
  @IsOptional()
  @IsString()
  status_id?: string;

  @ApiPropertyOptional({
    description: 'Fecha desde (formato ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_desde?: Date;

  @ApiPropertyOptional({
    description: 'Fecha hasta (formato ISO 8601)',
    example: '2025-01-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_hasta?: Date;

  @ApiPropertyOptional({
    description: 'Número de página para la paginación',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
