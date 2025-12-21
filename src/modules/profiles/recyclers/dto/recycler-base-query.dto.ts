import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
} from 'class-validator';
import { RecyclerBase } from '../entities/recycler.entity';

export class RecyclerBaseQueryDto {
  // --- PAGINACIÓN ---
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  limit?: string;

  // --- FILTROS ---
  @ApiPropertyOptional({
    description: 'Filtrar por UUID de usuario',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por cédula de identidad',
    example: '0912345678',
  })
  @IsOptional()
  @IsString()
  national_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por pertenencia a asociación',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  belongs_to_association?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de asociación',
  })
  @IsOptional()
  @IsString()
  association_name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por disponibilidad de centro de acopio',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  has_collection_center?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por disponibilidad de movilidad',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  has_mobility?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo/inactivo',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  is_active?: string;

  // --- ORDEN ---
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'created_at',
  })
  @IsOptional()
  orderBy?: keyof RecyclerBase;

  @ApiPropertyOptional({
    description: 'Dirección del orden',
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
