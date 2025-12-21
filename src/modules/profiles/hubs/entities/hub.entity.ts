import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../../users/entities/users.entity'; 
import { UserAddress } from '../../../user-address/entities/user-address.entity'; 
import { HubProduct } from '../../../hub-product/entities/hub-product.entity'; 

@Entity('hubs')
export class Hub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  legal_name?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ruc?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ManyToOne(() => UserAddress)
  @JoinColumn({ name: 'address_id' })
  address: UserAddress;
  @Column('uuid')
  address_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'uuid' })
  user_id: string;

  @OneToMany(() => HubProduct, (hp) => hp.hub)
  products: HubProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
