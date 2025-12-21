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

export class CreateHubDto {
  @ApiProperty({
    description: 'Nombre del centro de acopio',
    example: 'Centro de Acopio Norte',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @Length(2, 150)
  name: string;

  @ApiPropertyOptional({
    description: 'Nombre legal del centro de acopio',
    example: 'Centro de Acopio Norte S.A.',
    minLength: 2,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @Length(2, 150)
  legal_name?: string;

  @ApiPropertyOptional({
    description: 'RUC o identificador fiscal',
    example: '1790012345001',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Descripción del centro de acopio',
    example: 'Centro de recepción y clasificación de residuos reciclables',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+593 99 123 4567',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto',
    example: 'contacto@acopionorte.ec',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'UUID de la dirección del centro de acopio',
  })
  @IsNotEmpty()
  @IsUUID()
  address_id: string;

  @ApiPropertyOptional({
    description: 'Sitio web del centro de acopio',
    example: 'https://www.acopionorte.ec',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
