import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { EventPass } from '../../event-pass/entities/event-pass.entity';

@Entity({ name: 'user_event_passes' })
export class UserEventPass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 👤 Relación con el usuario comprador
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  user_id: string;

  // 🎟️ Relación con el evento adquirido
  @ManyToOne(() => EventPass, { eager: true })
  @JoinColumn({ name: 'event_pass_id' })
  event_pass: EventPass;

  @Column('uuid')
  event_pass_id: string;

  // 🧾 DATOS DEL TITULAR DE LA ENTRADA
  @Column({ length: 100 })
  holder_name: string;

  @Column({ length: 100 })
  holder_instagram_tiktok: string;

  @Column({ length: 20, nullable: true })
  holder_phone?: string;

  @Column({ length: 30, nullable: true })
  holder_email?: string;

  // 📅 FECHAS DE CONTROL
  @CreateDateColumn({ name: 'purchase_date' })
  purchase_date: Date; // fecha de compra

  @Column({ type: 'timestamp', nullable: true })
  redemption_date?: Date; // fecha de uso o validación

  // ⚙️ ESTADO DE USO
  @Column({ default: false })
  is_consumed: boolean; // si ya fue usada o no

  // 💰 INFO ECONÓMICA
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchase_price?: number;

  // 💸 REEMBOLSO
  @Column({ default: false })
  is_refunded: boolean; // indica si fue reembolsada

  @Column({ type: 'timestamp', nullable: true })
  refunded_at?: Date; // fecha de reembolso

  // 🔐 CONTROL GENERAL
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
