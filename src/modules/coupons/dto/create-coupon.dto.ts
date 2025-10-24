import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDate,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouponType } from '../enum/coupon-type.enum';

export class CreateCouponDto {
  @ApiProperty({ description: 'Nombre/descripción para el usuario' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Código del cupón. Opcional si se usa por ID. (Recomendado)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  code: string | null;

  @ApiProperty({
    description: 'Tipo de cupón',
    enum: CouponType,
    enumName: 'CouponType',
  })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({ description: 'Valor del descuento (10 para 10% o $10)' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  value: number;

  @ApiPropertyOptional({
    description: 'Tope máximo de descuento (para cupones PERCENTAGE)',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  max_discount_cap: number | null;

  @ApiPropertyOptional({
    description: 'Gasto mínimo requerido (para cupones FIXED o PERCENTAGE)',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  min_spend_required: number | null;

  @ApiPropertyOptional({
    description: 'Fecha y hora de expiración (null = nunca expira)',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_at: Date | null;

  @ApiPropertyOptional({
    description: 'Cantidad máxima de usos total (0 o null = ilimitado)',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_usage_count: number | null;

  @ApiPropertyOptional({
    description: 'Usos máximos por usuario (0 o null = ilimitado)',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  usage_limit_per_user: number | null;

  @ApiPropertyOptional({
    description: 'Define si el cupón está activo (por defecto: true)',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  // REMOVED: created_by_user_id: string;
  // Este campo se inyecta desde el token del usuario autenticado en el Controller.
}
