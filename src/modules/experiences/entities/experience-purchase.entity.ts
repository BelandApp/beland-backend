import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExperiencePurchaseItem } from './experience-purchase-item.entity';

@Entity('experience_purchases')
export class ExperiencePurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  payphone_transaction_id: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', default: 'COMPLETED' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ExperiencePurchaseItem, (item) => item.purchase, { cascade: true })
  items: ExperiencePurchaseItem[];
}
