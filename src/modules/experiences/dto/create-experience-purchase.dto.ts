import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
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

  @ApiProperty({ description: 'ID de transacción de Payphone' })
  @IsString()
  @IsNotEmpty()
  payphone_transaction_id: string;

  @ApiPropertyOptional({ description: 'Email del comprador (opcional)' })
  @IsOptional()
  @IsString()
  email?: string;
}
