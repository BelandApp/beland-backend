import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', nullable: true })
  ordered_quantity: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  returned_quantity: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  unit_price: number;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  total_price: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  unit_becoin: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  total_becoin: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column('uuid')
  order_id: string;

  @ManyToOne(() => Product, (product) => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('uuid')
  product_id: string;

  /**
   * Hook que se ejecuta antes de insertar o actualizar el registro.
   * Calcula automáticamente los campos derivados.
   */
  @BeforeInsert()
  @BeforeUpdate()
  updateCalculatedFields() {
    if (this.id !== undefined) {  
    // Calcular quantity
      const ordered = this.ordered_quantity ?? 0;
      const returned = this.returned_quantity ?? 0;
      this.quantity = Math.max(ordered - returned, 0);

      // Calcular total_price
      const price = Number(this.unit_price ?? 0);
      this.total_price = this.quantity * price;

      // Calcular total_becoin si aplica
      const becoin = Number(this.unit_becoin ?? 0);
      this.total_becoin = this.unit_becoin ? this.quantity * becoin : null;
    }
  }
}

