import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Hub } from '../../profiles/hubs/entities/hub.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('hub_products')
@Unique(['hub_id', 'product_id'])
export class HubProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Hub, (hub) => hub.products, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'hub_id' })
  hub: Hub;
  @Column('uuid')
  hub_id: string;

  @ManyToOne(() => Product, {eager: true,onDelete: 'CASCADE'})
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Column('uuid')
  product_id: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  stock_min: number;
}
