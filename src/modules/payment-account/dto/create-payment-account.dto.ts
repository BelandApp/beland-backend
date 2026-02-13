import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  Length,
  IsEmail,
} from 'class-validator';
import { TypeAccountEnum } from '../enums/account.enum';

export class CreatePaymentAccountDto {

  @ApiProperty({
    example: 'Cuenta principal',
    description: 'Nombre identificador de la cuenta'
  })
  @IsString()
  @Length(1, 100)
  name: string;


  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Titular de la cuenta'
  })
  @IsString()
  @Length(1, 150)
  accountHolder: string;


  @ApiProperty({
    example: 'Banco Pichincha',
    description: 'Banco asociado'
  })
  @IsString()
  @Length(1, 50)
  bank: string;


  @ApiPropertyOptional({
    example: 'juan@mail.com',
    description: 'Email asociado a la cuenta'
  })
  @IsOptional()
  @IsEmail()
  email?: string;


  @ApiPropertyOptional({
    example: true,
    description: 'Estado de la cuenta'
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;


  // ---------- ECUADOR ----------
  @ApiPropertyOptional({
    example: '1790012345001',
    description: 'RUC ecuatoriano'
  })
  @IsOptional()
  @IsString()
  ruc?: string;


  @ApiPropertyOptional({
    example: '220123456789',
    description: 'Número de cuenta bancaria'
  })
  @IsOptional()
  @IsString()
  nro_account?: string;


  // ---------- ARGENTINA ----------
  @ApiPropertyOptional({
    example: '2850590940090418135201',
    description: 'CBU argentino (22 dígitos)'
  })
  @IsOptional()
  @IsString()
  @Length(22, 22)
  cbu?: string;


  @ApiPropertyOptional({
    example: 'juan.perez.mp',
    description: 'Alias bancario'
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  alias?: string;


  @ApiProperty({
    enum: TypeAccountEnum,
    example: TypeAccountEnum.AHORRO,
    description: 'Tipo de cuenta'
  })
  @IsEnum(TypeAccountEnum)
  type_account: TypeAccountEnum;
}
