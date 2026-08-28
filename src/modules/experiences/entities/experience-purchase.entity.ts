import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExperiencePurchaseItem } from './experience-purchase-item.entity';

@Entity('experience_purchases')
export class ExperiencePurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  payphone_transaction_id: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', default: 'COMPLETED' })
  status: string;

  @Column({ type: 'boolean', default: false })
  is_reserved: boolean;

  @Column({ type: 'varchar', default: 'PAYPHONE' })
  payment_method: string;

  @Column({ type: 'int', default: 0 })
  orange_reward_amount: number;

  @Column({ type: 'boolean', default: false })
  orange_reward_credited: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => ExperiencePurchaseItem, (item) => item.purchase, { cascade: true })
  items: ExperiencePurchaseItem[];
}
