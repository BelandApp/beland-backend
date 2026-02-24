import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, MaxLength, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateGroupMemberConsumptionDto {
  @ApiProperty({
    description: 'ID del grupo',
    example: '3f9d6d3e-9d2c-4a9a-9c5c-8b2b0c2e1c11',
  })
  @IsUUID()
  group_id: string;

  @ApiProperty({
    description: 'ID del producto que el miembro va a consumir',
    example: 'e7d2c1b9-3c44-4f6d-9b8c-2e91f9a81234',
  })
  @IsUUID()
  product_id: string;

  @ApiPropertyOptional({
    description: 'Notas u observaciones del consumo',
    example: 'Sin hielo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}

export class ProductNoteDto {

  @ApiProperty({
    description: 'ID del producto que el miembro va a consumir',
    example: 'e7d2c1b9-3c44-4f6d-9b8c-2e91f9a81234',
  })
  @IsUUID()
  product_id: string;

  @ApiPropertyOptional({
    description: 'Notas u observaciones del consumo',
    example: 'Sin hielo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

}

export class CreateManyGroupMemberConsumptionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  group_id: string;

  @ApiProperty({ type: [ProductNoteDto] })
  @IsArray()
  @ArrayNotEmpty()
  productsNotes: ProductNoteDto[];
}
