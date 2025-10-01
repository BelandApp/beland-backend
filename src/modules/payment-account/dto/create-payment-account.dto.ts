import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreatePaymentAccountDto {
  @ApiProperty({
    example: 'Cuenta Principal',
    description: 'Nombre identificador de la cuenta',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Titular legal de la cuenta',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  accountHolder: string;

  @ApiProperty({
    example: '2850590940090418135201',
    description: 'CBU de 22 dígitos',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{22}$/, { message: 'El CBU debe tener exactamente 22 dígitos' })
  cbu: string;

  @ApiProperty({
    example: 'mi.alias.cuenta',
    description: 'Alias único de la cuenta',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  alias: string;

  @ApiProperty({
    example: 'Banco Nación',
    description: 'Banco asociado (opcional)',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  bank?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la cuenta está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}
