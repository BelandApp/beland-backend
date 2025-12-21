import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecyclerBaseDto {

  @ApiProperty({
    description: 'Número de cédula de identidad (Ecuador)',
    example: '0912345678',
    minLength: 5,
    maxLength: 20,
  })
  @IsString()
  @Length(5, 20)
  national_id: string;

  @ApiPropertyOptional({
    description: 'Indica si pertenece a una asociación de recicladores',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  belongs_to_association?: boolean;

  @ApiPropertyOptional({
    description: 'Nombre de la asociación de recicladores',
    example: 'Asociación de Recicladores Nueva Vida',
  })
  @IsOptional()
  @IsString()
  @Length(2, 150)
  association_name?: string;

  @ApiPropertyOptional({
    description: 'Indica si posee centro de acopio propio',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  has_collection_center?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si posee algún medio de movilidad',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  has_mobility?: boolean;

  @ApiPropertyOptional({
    description: 'Descripción del medio de movilidad',
    example: 'Triciclo',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  mobility_description?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo del reciclador',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
