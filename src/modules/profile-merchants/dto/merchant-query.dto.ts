import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsIn,
  IsBooleanString,
  IsNumberString,
} from 'class-validator';

export class MerchantQueryDto {
  // --- PAGINACIÓN ---
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  // --- ORDEN ---
  @ApiPropertyOptional({
    example: 'created_at',
    description: 'Campo por el cual ordenar',
  })
  @IsOptional()
  @IsIn([
    'created_at',
    'name',
    'legal_name',
    'is_active',
  ])
  orderBy?: string;

  @ApiPropertyOptional({ example: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  // --- FILTROS ---
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  address_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  is_active?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  legal_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
