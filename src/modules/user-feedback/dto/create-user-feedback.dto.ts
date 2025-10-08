import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
  IsEnum,
} from 'class-validator';
import { SectionCode } from '../enum/feedback.enum';

export class CreateUserFeedbackDto {
  @ApiProperty({
    description: 'ID del usuario que deja la valoración',
    example: 'a3b9f6e4-8d8e-4c0b-bd8a-5a7f88b2f9c1',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Puntuación de la app (1 a 5 estrellas)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comentario opcional del usuario',
    example: 'La app es muy intuitiva y rápida.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Sección de la app donde se pidió el feedback',
    enum: SectionCode,
    example: SectionCode.DASHBOARD,
    required: false,
  })
  @IsOptional()
  @IsEnum(SectionCode)
  section?: SectionCode;

  @ApiProperty({
    description: 'Plataforma desde la que se envió el feedback',
    example: 'android',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  platform?: string;

  @ApiProperty({
    description: 'Versión de la app desde donde se envió el feedback',
    example: '1.0.3',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  app_version?: string;

}
