import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { HubProduct } from '../entities/hub-product.entity';

export class HubProductQueryDto {
  @ApiPropertyOptional({
    description: 'UUID del centro de acopio',
  })
  @IsOptional()
  @IsUUID()
  hub_id?: string;

  @ApiPropertyOptional({
    description: 'UUID del producto',
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @ApiPropertyOptional({
    description: 'Cantidad mínima en stock',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity_min?: number;

  @ApiPropertyOptional({
    description: 'Cantidad máxima en stock',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity_max?: number;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'quantity',
  })
  @IsOptional()
  orderBy?: keyof HubProduct;

  @ApiPropertyOptional({
    description: 'Orden de la consulta',
    example: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
