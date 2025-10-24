import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsRepository } from './coupons.repository';
import { CouponUsage } from './entities/coupon-usage.entity';

@Module({
  // Incluir CouponUsage para poder inyectar su repositorio
  imports: [TypeOrmModule.forFeature([Coupon, CouponUsage])],
  controllers: [CouponsController],
  providers: [CouponsService, CouponsRepository],
  exports: [CouponsService], // Exportar el servicio si otros módulos lo usarán (ej. Módulo de Pagos/Órdenes)
})
export class CouponsModule {}
