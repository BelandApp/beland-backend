import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Nombre del grupo', example: 'Juntada Histórica' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @ApiPropertyOptional({ description: 'Descripción del grupo', example: 'Grupo de voluntarios del barrio San Martín' })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  description?: string;

  @ApiPropertyOptional({ description: 'Latitud geográfica', example: -34.603722 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitud geográfica', example: -58.381592 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'ID de la dirección por defecto asociada del usuario', example: '8e4d9c44-0f0c-4d77-b8fd-4b9c25c3c999' })
  @IsOptional()
  @IsUUID()
  user_address_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de grupo', example: 'c1a7f0d2-1b43-4f69-9e63-3c2c6b2e7777' })
  @IsOptional()
  @IsUUID()
  group_type_id?: string;

}
