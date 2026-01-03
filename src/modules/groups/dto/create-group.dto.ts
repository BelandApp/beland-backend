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

  @ApiPropertyOptional({ description: 'Descripción del grupo' })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;

  @ApiPropertyOptional({ description: 'Mensaje para invitación del grupo' })
  @IsOptional()
  @IsString()
  @Length(3, 1000)
  message_invitation?: string;

  @ApiPropertyOptional({ description: 'Latitud geográfica' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitud geográfica' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'ID de la dirección del usuario' })
  @IsOptional()
  @IsUUID()
  user_address_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de grupo' })
  @IsOptional()
  @IsUUID()
  group_type_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de privacidad' })
  @IsOptional()
  @IsUUID()
  privacy_id?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de pago' })
  @IsOptional()
  @IsUUID()
  payment_type_id?: string;
}