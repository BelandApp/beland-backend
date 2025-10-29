import { IsOptional, IsBoolean, IsString, IsUUID, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EventPassFiltersDto {
  @ApiPropertyOptional({ description: 'Filtrar por estado activo'})
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Buscar por nombre del evento'})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID del creador'})
  @IsOptional()
  @IsUUID()
  created_by_id?: string;

  @ApiPropertyOptional({ description: 'Precio mínimo en becoins'})
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiPropertyOptional({ description: 'Precio máximo en becoins'})
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiPropertyOptional({ description: 'Cantidad de registros por pagina'})
  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ description: 'Numero de pagina a visualizar'})
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @ApiPropertyOptional({ description: 'Filtrar eventos desde esta fecha'})
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Filtrar eventos hasta esta fecha'})
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
