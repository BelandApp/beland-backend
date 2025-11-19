import {
  IsUUID,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PurchaseWhitRechargeDto {

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
  @IsString() // Podés cambiar 'AR' por el código del país o quitarlo si es multi-país
  @IsOptional()
  holder_phone?: string;

  @ApiPropertyOptional({
    example: 'example@email.com',
    description: 'Correo Electronico (opcional)',
  })
  @IsEmail()
  @IsOptional()
  holder_email?: string;

    @ApiProperty({ example: 50.0, description: 'Amount in USD to recharge' })
    @IsNumber()
    @Type(() => Number)
    amountUsd: number;

    @ApiProperty({
        example: 'REF123456789',
        description: 'Reference code for tracking',
    })
    @IsString()
    referenceCode: string;

    @ApiProperty({
        example: 'PAYPHONE-TransactionID',
        description: 'Identificador entregado por Payphone para seguimientos',
    })
    @IsNumber()
    payphone_transactionId: number;

    @ApiProperty({
        example: '8f03a1de-b71c-4a5a-a9ff-0d9a3a3c5b2a',
        description: 'codigo interno para seguimientos',
    })
    @IsUUID()
    clientTransactionId: string;

}
