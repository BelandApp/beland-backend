// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/users.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { UserAddress } from '../../user-address/entities/user-address.entity';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { TransactionState } from 'src/transaction-state/entities/transaction-state.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TransactionState)
  @JoinColumn({name: 'status_id'})
  status: TransactionState;
  @Column('uuid')
  status_id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'int', default: 0 })
  total_items: number;

  @Column({ type: 'boolean', default: false })
  confirmSend: boolean;

  @Column({ type: 'boolean', default: false })
  confirmReceived: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Group, (group) => group.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({name:'group_ip'})
  group: Group;
  @Column('uuid', { nullable:true })
  group_id: string;
 
  @ManyToOne(() => UserAddress, (address) => address.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({name:'address_ip'})
  address: UserAddress;
  @Column('uuid', { nullable:true })
  address_id: string;

  @ManyToOne(() => User)
  @JoinColumn({name:'user_id'})
  user: User;
  @Column('uuid')
  user_id: string;

  // payments_type: 'FULL' | 'EQUAL_SPLIT';
  @ManyToOne(() => PaymentType, (type) => type.orders, { eager: true })
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType;
  @Column({ type: 'uuid' })
  payment_type_id: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
 