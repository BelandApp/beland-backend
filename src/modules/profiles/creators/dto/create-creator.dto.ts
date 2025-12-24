import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCreatorDto {

  @ApiProperty({description: 'UUID de la categoría de contenido'})
  @IsUUID()
  category_id: string;

  @ApiProperty({
    description: 'UUID de la red social principal',
  })
  @IsUUID()
  main_social_network_id: string;

  @ApiProperty({
    description: 'Biografía corta del creador',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Link principal del creador',
    required: false,
  })
  @IsOptional()
  @IsString()
  main_link?: string;

  @ApiProperty({
    description: 'Cantidad aproximada de seguidores',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  followers_count?: number;
}
