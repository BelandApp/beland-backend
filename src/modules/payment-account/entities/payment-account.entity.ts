import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity'; 

@Entity({ name: 'payment_accounts' })
export class PaymentAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // nombre de la cuenta o etiqueta

  @Column({ type: 'varchar', length: 150 })
  accountHolder: string; // titular de la cuenta

  @Column({ type: 'varchar', length: 22, unique: true })
  cbu: string; // CBU argentino (22 dígitos)

  @Column({ type: 'varchar', length: 50, unique: true })
  alias: string; // alias de la cuenta

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank?: string; // banco asociado (opcional)

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // activar/desactivar cuenta

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
