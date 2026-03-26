import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  IsIn,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleEnum, ValidRoleNames } from 'src/modules/roles/enum/role-validate.enum';

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página. Empezando por 1.',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página.',
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Columna por la que ordenar los resultados.',
    default: 'created_at',
    type: String,
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Dirección de la ordenación (ASC o DESC).',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    type: String,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Si se deben incluir usuarios desactivados.',
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por email de usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de rol.',
    enum: RoleEnum,
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(RoleEnum))
  roleName?: ValidRoleNames;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de bloqueo.',
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBlocked?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre de usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre completo del usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por proveedor de OAuth.',
    type: String,
  })
  @IsOptional()
  @IsString()
  oauth_provider?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por número de teléfono.',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  phone?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por país del usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ciudad del usuario.',
    type: String,
  })
  @IsOptional()
  @IsString()
  city?: string;
}
