// src/coupons/dto/apply-coupon.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({
    description: 'ID del cupón seleccionado por el usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  coupon_id: string;

  @ApiProperty({
    description: 'ID del usuario que intenta aplicar el cupón',
    example: '789e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  user_id: string; // Inyectado desde el token de autenticación

  @ApiProperty({
    description: 'Monto total de la compra antes de aplicar el descuento',
    example: 150.75,
  })
  @IsNumber()
  @Min(0.01)
  purchase_total: number;

  @ApiProperty({
    description: 'ID del comercio al que pertenece la compra',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  commerce_id: string;

  @ApiProperty({
    description: 'ID de la orden o transacción (opcional para pre-validación)',
    example: '00000000-0000-0000-0000-000000000000',
    required: false,
  })
  @IsUUID()
  order_id?: string;
}
