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
import { PaymentAccount } from '../../payment-account/entities/payment-account.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity({ name: 'recharge_transfers' })
export class RechargeTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PaymentAccount, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_account_id' })
  paymentAccount: PaymentAccount;
  @Column('uuid')
  payment_account_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount_usd: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  transfer_id: string; // identificador bancario

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => TransactionState, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'status_id' })
  status: TransactionState;
  @Column('uuid')
  status_id: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
  @Column('uuid')
  transaction_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
