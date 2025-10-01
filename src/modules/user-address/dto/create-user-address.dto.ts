import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Primera línea de la dirección',
    example: 'Av. Siempre Viva 742',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  addressLine1: string;

  @ApiPropertyOptional({
    description: 'Segunda línea de la dirección',
    example: 'Piso 3, Depto B',
    maxLength: 150,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  addressLine2?: string;

  @ApiProperty({
    description: 'Ciudad de la dirección',
    example: 'Springfield',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({
    description: 'Estado o provincia',
    example: 'Buenos Aires',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiProperty({
    description: 'País de la dirección',
    example: 'Argentina',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '1234',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Latitud de la dirección',
    example: -34.6037,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitud de la dirección',
    example: -58.3816,
  })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Indica si esta dirección es la predeterminada',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;
}
