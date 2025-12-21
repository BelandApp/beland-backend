import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../users/entities/users.entity'; 
import { UserAddress } from '../../../user-address/entities/user-address.entity';

@Entity('foundations')
export class Foundation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string; // Nombre comercial

  @Column({ type: 'varchar', length: 150, nullable: true })
  legal_name?: string; // Razón social (opcional)

  @Column({ type: 'varchar', length: 20, nullable: true })
  ruc?: string; // identificador fiscal

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ManyToOne(() => UserAddress)
  @JoinColumn({name:'address_id'})
  address: UserAddress
  @Column('uuid')
  address_id: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'uuid' })
  user_id: string; // Referencia al usuario propietario

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
