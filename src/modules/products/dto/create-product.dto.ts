// src/products/dto/create-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, IsArray, ArrayNotEmpty, IsBoolean, isNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción del producto', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Codigo de Barras del producto', required: false })
  @IsOptional()
  @IsString()
  codbar?: string;

  @ApiPropertyOptional({ description: 'Peso del producto en Kilogramos' })
  @IsNumber()
  @IsOptional()
  weight: number;

  @ApiProperty({ description: 'Costo del producto en USD' })
  @IsNumber()
  cost: number;

  @ApiProperty({ description: 'Cantidad del producto en stock' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Es circular?' })
  @IsBoolean()
  @IsNotEmpty()
  is_circular: boolean;

  @ApiProperty({ description: 'Precio del producto en USD' })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ description: 'UUID de la Categoría del producto', required: false })
  @IsOptional()
  @IsUUID()
  category_id?: string;
}


export class AddGroupTypesDto {
  @ApiProperty({
    description: 'Array de IDs de tipos de grupo a asociar',
    example: [
      'e0a1c8e0-4f12-11ee-be56-0242ac120002',
      'd8a7c5a0-4f12-11ee-be56-0242ac120002',
    ],
    type: [String],
  })
  @IsArray({ message: 'groupTypeIds debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debe incluir al menos un ID de tipo de grupo' })
  @IsUUID()
  groupTypeIds: string[];
}