import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Wallet } from '../../../wallets/entities/wallet.entity';

export type TopupStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

@Entity('topups')
@Index('idx_topup_merchantTradeNo_unique', ['merchantTradeNo'], { unique: true })
export class Topup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column('uuid')
  wallet_id: string;

  /** 🔥 Identificador único TUYO, para correlacionar webhooks */
  @Column({ type: 'text' })
  merchantTradeNo: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount_usd: number;

  @Column({ type: 'text', default: 'USDT' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  prepayId: string | null;

  @Column({ type: 'text', nullable: true })
  checkoutUrl: string | null;

  @Column({ type: 'text', default: 'PENDING' })
  status: TopupStatus;

  @Column({ type: 'text', nullable: true })
  raw_webhook_payload: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  usd_granted: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
