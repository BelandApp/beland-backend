import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Service } from '../entities/service.entity';

export class ServiceFiltersDto {
  @ApiPropertyOptional({ description: 'Filtrar por activo' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por disponible' })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @ApiPropertyOptional({ description: 'Buscar por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  // 🔃 ORDER BY

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
     enum: ['created_at', 'name', 'price', 'price_becoin'],
    example: 'created_at',
  })
  @IsOptional()
  order_by?: keyof Service;

  @ApiPropertyOptional({
    description: 'Dirección del orden',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order_direction?: 'ASC' | 'DESC';

  // 📄 PAGINACIÓN

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
