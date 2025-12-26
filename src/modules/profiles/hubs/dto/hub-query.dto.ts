import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Hub } from '../entities/hub.entity';

export class HubQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por usuario' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por dirección' })
  @IsOptional()
  @IsUUID()
  address_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo' })
  @IsOptional()
  @IsString()
  is_active?: string;

  @ApiPropertyOptional({ description: 'Buscar por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Buscar por razón social' })
  @IsOptional()
  @IsString()
  legal_name?: string;

  @ApiPropertyOptional({ description: 'Buscar por RUC' })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({ description: 'Buscar por email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Buscar por teléfono' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Campo para ordenar' })
  @IsOptional()
  @IsString()
  orderBy?: keyof Hub;

  @ApiPropertyOptional({ description: 'Orden ASC o DESC' })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Página' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Cantidad por página' })
  @IsOptional()
  @IsString()
  limit?: string;
}
