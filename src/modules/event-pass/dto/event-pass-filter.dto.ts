import { IsOptional, IsBoolean, IsString, IsUUID, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EventPassFiltersDto {
  @ApiPropertyOptional({ description: 'Filtrar por estado activo', example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Buscar por nombre del evento', example: 'Concierto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID del creador', example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @IsOptional()
  @IsUUID()
  created_by_id?: string;

  @ApiPropertyOptional({ description: 'Precio mínimo en becoins', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiPropertyOptional({ description: 'Precio máximo en becoins', example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiPropertyOptional({ description: 'Filtrar eventos desde esta fecha', example: '2025-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Filtrar eventos hasta esta fecha', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
