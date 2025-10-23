import { PartialType } from '@nestjs/mapped-types';
import { CreateEventPassDto } from './create-event-pass.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ArrayNotEmpty, IsUrl, IsNumber } from 'class-validator';

export class UpdateEventPassDto extends PartialType(CreateEventPassDto) {
  @ApiProperty({
    example: 'https://example.com/event-image.jpg',
    description: 'URL principal de la imagen del evento.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen principal debe ser un texto.' })
  @IsUrl({}, { message: 'La URL de la imagen principal no es válida.' })
  image_url?: string;

  @ApiProperty({
    example: [
      'https://example.com/event-image-1.jpg',
      'https://example.com/event-image-2.jpg',
    ],
    description: 'Lista de URLs de imágenes adicionales del evento.',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las imágenes adicionales deben ser un arreglo de URLs.' })
  @IsString({ each: true, message: 'Cada URL adicional debe ser un texto.' })
  @IsUrl({}, { each: true, message: 'Cada URL adicional debe tener un formato válido.' })
  images_urls?: string[];

    @ApiProperty({
      example: 160,
      required: false,
    })
    @IsOptional()
    @IsNumber()
    total_becoin?: number;
}

