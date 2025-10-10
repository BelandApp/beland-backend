import {
  IsUUID,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserEventPassDto {

  // 🎟️ EVENTO ADQUIRIDO
  @ApiProperty({
    example: '8aef5c2e-4f83-4a0f-8e6b-d36ac4e4f33a',
    description: 'ID del evento (EventPass) adquirido',
  })
  @IsUUID()
  @IsNotEmpty()
  event_pass_id: string;

  // 🧾 DATOS DEL TITULAR DE LA ENTRADA
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del titular de la entrada',
  })
  @IsString()
  @IsNotEmpty()
  holder_name: string;

  @ApiPropertyOptional({
    example: '+5491122334455',
    description: 'Teléfono del titular (opcional)',
  })
  @IsPhoneNumber('AR') // Podés cambiar 'AR' por el código del país o quitarlo si es multi-país
  @IsOptional()
  holder_phone?: string;

  @ApiPropertyOptional({
    example: 'DNI 40222333',
    description: 'Documento del titular (opcional)',
  })
  @IsString()
  @IsOptional()
  holder_document?: string;

}
