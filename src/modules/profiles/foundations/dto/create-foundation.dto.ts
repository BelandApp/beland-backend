import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsUUID,
  Length,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoundationDto {
  @ApiProperty({
    description: 'Nombre de la fundación sin fines de lucro',
    example: 'Fundación Manos Solidarias',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @Length(2, 150)
  name: string;

  @ApiPropertyOptional({
    description: 'Nombre legal de la fundación',
    example: 'Fundación Manos Solidarias Asociación Civil',
    minLength: 2,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @Length(2, 150)
  legal_name?: string;

  @ApiPropertyOptional({
    description: 'CUIT o número de identificación fiscal de la fundación',
    example: '30712345678',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la misión u objetivo social de la fundación',
    example: 'Organización dedicada a la asistencia social y comunitaria',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de contacto de la fundación',
    example: '+54 9 11 4567 8901',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto institucional',
    example: 'contacto@manossolidarias.org',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'UUID de la dirección física de la fundación',
  })
  @IsNotEmpty()
  @IsUUID()
  address_id: string;

  @ApiPropertyOptional({
    description: 'URL del logo institucional de la fundación',
    example: 'https://miapp.com/logos/manossolidarias.png',
  })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiPropertyOptional({
    description: 'Sitio web oficial de la fundación',
    example: 'https://www.manossolidarias.org',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo de la fundación',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
