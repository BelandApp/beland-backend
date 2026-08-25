import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ExperiencePurchaseItemDto {
  @ApiProperty({ description: 'ID del producto (Experience)' })
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ description: 'Cantidad comprada', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateExperiencePurchaseDto {
  @ApiProperty({ type: [ExperiencePurchaseItemDto], description: 'Items comprados' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperiencePurchaseItemDto)
  items: ExperiencePurchaseItemDto[];

  @ApiProperty({ description: 'Monto total informado por el frontend' })
  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @ApiProperty({ description: 'Indica si es una reserva' })
  @IsBoolean()
  @IsNotEmpty()
  is_reserved: boolean;

  @ApiProperty({ description: 'Método de pago (PAYPHONE o TRANSFER)' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PAYPHONE', 'TRANSFER'])
  payment_method: string;

  @ApiPropertyOptional({ description: 'ID de transacción de Payphone' })
  @IsOptional()
  @IsString()
  payphone_transaction_id?: string;

  @ApiProperty({ description: 'Email del comprador' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Teléfono del comprador' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
