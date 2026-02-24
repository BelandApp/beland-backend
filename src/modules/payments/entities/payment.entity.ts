// payment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/users.entity';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 💸 Monto efectivamente pagado por el usuario
  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  amount_paid: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ───────────── Relaciones ─────────────

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
  @Column('uuid')
  order_id: string;

  @ManyToOne(() => PaymentType)
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType;
  @Column('uuid')
  payment_type_id: string;

  // Última transacción asociada (puede haber más en el futuro)
  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
  @Column('uuid', { nullable: true })
  transaction_id: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => TransactionState)
  @JoinColumn({ name: 'status_id' })
  status: TransactionState;
  @Column('uuid')
  status_id: string;
}
