import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsIn,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { Vehicle } from '../entities/vehicle.entity';

export class DriverQueryDto {
  // --- PAGINACIÓN ---
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: 10, description: 'Cantidad por página' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  // --- ORDEN ---
  @ApiPropertyOptional({
    example: 'created_at',
    description: 'Campo por el cual ordenar',
  })
  @IsOptional()
  orderBy?: keyof Vehicle;

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Dirección del orden',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  // --- FILTROS ---
  @ApiPropertyOptional({ description: 'ID del usuario asociado' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de vehículo' })
  @IsOptional()
  @IsUUID()
  vehicle_type_id?: string;

  @ApiPropertyOptional({ description: 'Conductor activo/inactivo' })
  @IsOptional()
  @IsBooleanString()
  is_active?: string;

  @ApiPropertyOptional({ description: 'Buscar por patente' })
  @IsOptional()
  @IsString()
  vehicle_plate?: string;

  @ApiPropertyOptional({ description: 'Buscar por descripción del vehículo' })
  @IsOptional()
  @IsString()
  vehicle_description?: string;
}
