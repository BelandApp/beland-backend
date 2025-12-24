import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { Creator } from '../entities/creator.entity';

export class CreatorQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoría de contenido',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por red social principal',
  })
  @IsOptional()
  @IsUUID()
  main_social_network_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por usuario',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Estado del perfil',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Campo de orden',
    example: 'followers_count',
  })
  @IsOptional()
  orderBy?: keyof Creator;

  @ApiPropertyOptional({
    description: 'Orden ASC o DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional()
  page?: string;

  @ApiPropertyOptional()
  limit?: string;
}
