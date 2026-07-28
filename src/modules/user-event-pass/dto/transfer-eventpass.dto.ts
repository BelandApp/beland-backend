import {
  IsUUID,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferEventPassDto {

  @ApiProperty({
    example: '8aef5c2e-4f83-4a0f-8e6b-d36ac4e4f33a',
    description: 'ID del evento (EventPass) adquirido',
  })
  @IsUUID()
  @IsNotEmpty()
  event_pass_id: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del titular de la entrada',
  })
  @IsString()
  @IsNotEmpty()
  holder_name: string;

  @ApiProperty({
    example: '@JuanPerez',
    description: 'Usuario de Instagram o Tiktok',
  })
  @IsString()
  @IsNotEmpty()
  holder_instagram_tiktok: string;

  @ApiPropertyOptional({
    example: '+5491122334455',
    description: 'Teléfono del titular (opcional)',
  })
  @IsString()
  @IsOptional()
  holder_phone?: string;

  @ApiPropertyOptional({
    example: 'example@email.com',
    description: 'Correo Electronico (opcional)',
  })
  @IsEmail()
  @IsOptional()
  holder_email?: string;

  @ApiProperty({
      example: 'TRANSF-123456789',
      description: 'Reference code for tracking',
  })
  @IsString()
  @IsOptional()
  referenceCode?: string;

  @ApiProperty({
      example: '123456',
      description: 'ID o comprobante de la transferencia',
  })
  @IsString()
  transferReferenceId: string;
}
