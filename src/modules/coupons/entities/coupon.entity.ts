import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { CouponUsage } from './coupon-usage.entity';
import { User } from '../../users/entities/users.entity';
import { CouponType } from '../enum/coupon-type.enum';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string; // Nombre/descripción para el usuario

  // El código se mantiene, pero es opcional en el flujo de selección UI.
  @Column({ type: 'text', unique: true, nullable: true })
  code: string | null;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  // Valor del descuento (ej: 10 para 10% o 10 para $10)
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  // **Reglas de Negocio Específicas**

  // Para PERCENTAGE: Tope máximo de descuento (ej: 10% hasta $50)
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  max_discount_cap: number | null;

  // Para FIXED: Gasto mínimo requerido para aplicar el cupón
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  min_spend_required: number | null;

  // **Reglas de Uso y Vigencia**

  @Column({ type: 'timestamptz', nullable: true })
  expires_at: Date;

  // Cantidad máxima de usos total (0 o null significa ilimitado)
  @Column({ type: 'integer', nullable: true })
  max_usage_count: number | null;

  // Usos máximos por usuario (0 o null significa ilimitado)
  @Column({ type: 'integer', nullable: true })
  usage_limit_per_user: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // **Relaciones**

  // Relación con el Comercio/Usuario que creó el cupón
  @ManyToOne(() => User, (user) => user.created_coupons, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  created_by_user: User;
  @Column('uuid')
  created_by_user_id: string; // ID del comercio/creador

  // Relación OneToMany con los registros de uso (historial de redenciones)
  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  usages: CouponUsage[];
}
