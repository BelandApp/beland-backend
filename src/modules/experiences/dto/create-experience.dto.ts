import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, ArrayMaxSize, IsBoolean } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ description: 'Nombre de la experiencia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción de la experiencia' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio de la experiencia en USD' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Nombre del creador, por defecto Beland' })
  @IsOptional()
  @IsString()
  creator_name?: string;

  @ApiPropertyOptional({ description: 'Tags de la experiencia, máximo 3' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3, { message: 'El máximo de tags permitidos es 3' })
  tags?: string[];

  @ApiPropertyOptional({ description: 'URL del video de la experiencia' })
  @IsOptional()
  @IsString()
  video_url?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen principal de la experiencia' })
  @IsOptional()
  @IsString()
  image_url?: string;
}
