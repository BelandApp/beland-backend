import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { User } from "../../users/entities/users.entity";

@Entity('order_item_consumptions')
@Unique(['order_item_id', 'user_id'])
export class OrderItemConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_item_id' })
  order_item: OrderItem;
  @Column('uuid')
  order_item_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
