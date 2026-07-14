import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { OwnerTopupEnum } from '../enums/owner-topups.enum';
import { User } from '../../users/entities/users.entity';

export type StripeTopupStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

@Entity('stripe_topups')
@Index('IDX_stripe_topups_client_transaction_id_unique', ['client_transaction_id'], {
  unique: true,
})
@Index('IDX_stripe_topups_payment_intent_id_unique', ['payment_intent_id'], {
  unique: true,
  where: `"payment_intent_id" IS NOT NULL`,
})
@Index('IDX_stripe_topups_event_id_unique', ['stripe_event_id'], {
  unique: true,
  where: `"stripe_event_id" IS NOT NULL`,
})
@Index('IDX_stripe_topups_wallet_status_created_at', [
  'wallet_id',
  'status',
  'created_at',
])
export class StripeTopup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
  @Column('uuid')
  wallet_id: string;

  @Column('uuid',{nullable: true})
  recipient_wallet_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  client_transaction_id: string;

  @Column({ type: 'text', nullable: true })
  payment_intent_id: string | null;

  @Column({ type: 'text', nullable: true })
  stripe_event_id: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount_usd: number;

  @Column({ type: 'text', default: 'usd' })
  currency: string;

  @Column({ type: 'text', default: 'PENDING' })
  status: StripeTopupStatus;

  @Column({ type: 'text', nullable: true })
  failure_code: string | null;

  @Column({ type: 'text', nullable: true })
  failure_message: string | null;

  @Column({ type: 'text', nullable: true })
  stripe_signature: string | null;

  @Column({ type: 'text', nullable: true })
  raw_webhook_payload: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  failed_at: Date | null;

  @Column({ type: 'enum', enum: OwnerTopupEnum, nullable:true })
  owner: OwnerTopupEnum;

  @Column('uuid', {nullable:true})
  owner_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  holder_name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  holder_instagram_tiktok?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  holder_phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  holder_email?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
