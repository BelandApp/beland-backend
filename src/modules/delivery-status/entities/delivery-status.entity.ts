import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delivery_status')
export class DeliveryStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Código único del estado del delivery: PENDING, PREPARING, ON_ROUTE, DELIVERED */
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  /** Nombre legible del estado: Pendiente, En preparación, En camino, Entregado */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** Descripción opcional para mostrar en la interfaz de usuario */
  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
