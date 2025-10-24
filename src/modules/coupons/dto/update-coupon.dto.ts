// src/coupons/dto/update-coupon.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @ApiProperty({
    description: 'Estado activo/inactivo del cupón',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
