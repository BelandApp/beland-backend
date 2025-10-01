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
import { Resource } from '../../resources/entities/resource.entity';

@Entity({ name: 'transfer_resources' })
export class TransferResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PaymentAccount, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payment_account_id' })
  payment_account: PaymentAccount;
  @Column('uuid')
  payment_account_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount_usd: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  transfer_id: string; // identificador bancario de la transferencia

  @Column({ type: 'varchar', length: 100 })
  holder: string; // titular de la cuenta que realiza la transferencia

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

  @ManyToOne(() => Resource)
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;
  @Column('uuid')
  resource_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
