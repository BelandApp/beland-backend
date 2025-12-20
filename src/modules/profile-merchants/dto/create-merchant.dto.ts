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

export class CreateMerchantDto {
  @ApiProperty({
    description: 'Nombre comercial del negocio',
    example: 'Tienda La Buena Compra',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @Length(2, 150)
  name: string;

  @ApiPropertyOptional({
    description: 'Nombre legal del negocio',
    example: 'La Buena Compra S.A.',
    minLength: 2,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @Length(2, 150)
  legal_name?: string;

  @ApiPropertyOptional({
    description: 'RUC o número de identificación fiscal',
    example: '20123456789',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Descripción del negocio',
    example: 'Venta de productos electrónicos y accesorios',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del negocio',
    example: '+54 9 11 1234 5678',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto',
    example: 'contacto@buenacompra.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'UUID de la Dirección física del negocio',
  })
  @IsNotEmpty()
  @IsUUID()
  address_id: string;

  @ApiPropertyOptional({
    description: 'URL del logo del negocio',
    example: 'https://miapp.com/logos/buenacompra.png',
  })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiPropertyOptional({
    description: 'Sitio web del negocio',
    example: 'https://www.buenacompra.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo del negocio',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
