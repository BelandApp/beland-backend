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

@Entity({ name: 'event_pass' })
export class EventPass {
  // 🆔 Identificador único
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🪧 DATOS PRINCIPALES
  @Column({ type: 'varchar', length: 100 })
  code: string; // codigo unico del pass

  @Column({ type: 'varchar', length: 200 })
  name: string; // nombre del evento

  @Column({ type: 'text', nullable: true })
  description: string; // descripcion o mensaje slogan del evento

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string; // imagen publicitaria del evento

  // 📅 FECHAS DE CONTROL
  @Column({ type: 'timestamp', nullable: false })
  event_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  // 📊 DATOS DE DISPONIBILIDAD Y CONTROL
  @Column({ type: 'int', nullable: false, default: 0 })
  limit_tickets: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  sold_tickets: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  // 💰 DATOS ECONÓMICOS
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price_becoin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total_becoin: number;

  // 👤 RELACIÓN CON USUARIO (creador)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;
  @Column({ type: 'uuid' })
  created_by_id: string;

  // ⚙️ ESTADO
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // 🕓 CONTROL DE CREACIÓN / ACTUALIZACIÓN
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
