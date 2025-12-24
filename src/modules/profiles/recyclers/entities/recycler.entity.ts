import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../users/entities/users.entity'; 
import { UserAddress } from '../../../user-address/entities/user-address.entity';

@Entity('recyclers')
export class RecyclerBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación 1 a 1 con el usuario base
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => UserAddress)
  @JoinColumn({name:'address_id'})
  address: UserAddress
  @Column('uuid')
  address_id: string

  // --- IDENTIFICACIÓN ---
  @Column({ type: 'varchar', length: 20, unique: true })
  national_id: string; // Cédula de identidad (Ecuador)

  // --- INFORMACIÓN SOCIAL ---
  @Column({ type: 'boolean', default: false })
  belongs_to_association: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  association_name?: string;

  // --- INFORMACIÓN OPERATIVA ---
  @Column({ type: 'boolean', default: false })
  has_collection_center: boolean; // Centro de acopio propio

  @Column({ type: 'boolean', default: false })
  has_mobility: boolean; // Tiene algún medio de transporte

  @Column({ type: 'varchar', length: 100, nullable: true })
  mobility_description?: string; // Ej: triciclo, carrito, moto

  // --- ESTADO ---
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
