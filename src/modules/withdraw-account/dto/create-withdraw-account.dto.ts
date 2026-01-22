import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CountryEnum,
  Currency,
  HolderDocumentType,
} from '../enums/withdraw-account.enum';

export class CreateWithdrawAccountDto {
  /* =============================
   * País y moneda
   * ============================= */

  @ApiProperty({
    description: 'País donde está registrada la cuenta bancaria',
    enum: CountryEnum,
    example: CountryEnum.AR,
  })
  @IsEnum(CountryEnum)
  country: CountryEnum;

  @ApiProperty({
    description: 'Moneda de la cuenta bancaria',
    enum: Currency,
    example: Currency.ARS,
  })
  @IsEnum(Currency)
  currency: Currency;

  /* =============================
   * Banco
   * ============================= */

  @ApiProperty({
    description: 'Nombre del banco',
    example: 'Banco Santander Río',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  bankName: string;

  /* =============================
   * Tipo de cuenta
   * ============================= */

  @ApiProperty({
    description: 'ID del tipo de cuenta de retiro (ahorros / corriente)',
    example: '8c1f2f42-9c8a-4c5b-a0e2-3b9a9b3c0f91',
  })
  @IsUUID()
  withdraw_account_type_id: string;

  /* =============================
   * Identificadores bancarios
   * ============================= */

  @ApiPropertyOptional({
    description:
      'Número de cuenta bancaria (obligatorio para Ecuador y Colombia)',
    example: '210012345678',
  })
  @ValidateIf(
    (o) => o.country === CountryEnum.EC || o.country === CountryEnum.CO,
  )
  @IsString()
  @IsNotEmpty()
  @Length(4, 34)
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'CBU (22 dígitos) - obligatorio para Argentina',
    example: '0720123488000001234567',
  })
  @ValidateIf((o) => o.country === CountryEnum.AR)
  @IsString()
  @IsNotEmpty()
  @Length(22, 22)
  cbu?: string;

  @ApiPropertyOptional({
    description: 'Alias CBU (solo Argentina)',
    example: 'mi.cuenta.banco',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  alias?: string;

  /* =============================
   * Datos del titular
   * ============================= */

  @ApiProperty({
    description: 'Nombre completo del titular de la cuenta',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  holderName: string;

  @ApiProperty({
    description: 'Documento del titular',
    example: '20345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  holderDocument: string;

  @ApiProperty({
    description: 'Tipo de documento del titular',
    enum: HolderDocumentType,
    example: HolderDocumentType.CUIT,
  })
  @IsEnum(HolderDocumentType)
  holderDocumentType: HolderDocumentType;

}
