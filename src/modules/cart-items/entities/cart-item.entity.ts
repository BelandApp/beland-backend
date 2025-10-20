import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, OneToOne, BeforeUpdate, BeforeInsert } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity'; 
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid') 
  id: string;
  
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
  @Column('uuid')
  cart_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Column('uuid')
  product_id: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  unit_becoin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true  })
  total_becoin: number; 

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // 👇 Hook para calcular los valores en base a total_price y unit_price
  @BeforeInsert()
  calculateBecoin() {
    this.total_price = Number(this.unit_price) * Number(this.quantity)
    const rate = 0.05; // 1 Becoin = 0.05 USD
    this.unit_becoin = Number(this.unit_price) / rate;
    this.total_becoin = Number(this.total_price) / rate;
  }
}
