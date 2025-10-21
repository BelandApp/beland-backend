// src/coupons/entities/coupon-usage.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { User } from '../../users/entities/users.entity';

// Entidad para registrar cada vez que un cupón es utilizado
@Entity('coupon_usages')
@Index(['coupon_id', 'user_id']) // Índice compuesto para búsquedas rápidas de uso por usuario/cupón
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Cupón utilizado
  @ManyToOne(() => Coupon, (coupon) => coupon.usages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column('uuid')
  coupon_id: string;

  // Usuario que utilizó el cupón
  @ManyToOne(() => User, (user) => user.coupon_usages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  // Total de la compra antes del descuento (para auditoría)
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  original_amount: number;

  // Monto del descuento aplicado
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discount_amount: number;

  // ID de la orden/compra donde se aplicó (asumiendo que existe una entidad Order)
  // Se deja como UUID, pero podría ser de otro tipo si Order usa otro ID
  @Column('uuid', { nullable: true })
  order_id: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  used_at: Date;
}
