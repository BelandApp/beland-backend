import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsLatitude,
  IsLongitude,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @ApiProperty({ description: 'Nombre del grupo', example: 'Juntada Histórica' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @ApiPropertyOptional({ description: 'URL Imagen de grupo' })
  @IsString()
  @IsOptional()
  @Length(3, 255)
  image_url: string;

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

 @ApiProperty({
    description: 'Fecha y hora en la que se realiza el evento',
    type: 'string',
    format: 'date-time',
    example: '2026-03-15T22:00:00-03:00',
  })
  @Type(() => Date)
  @IsDate({ message: 'event_at must be a valid date-time' })
  event_at: Date;
}