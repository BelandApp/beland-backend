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
import { TypeAccountEnum } from '../enums/account.enum';

@Entity({ name: 'payment_accounts' })
export class PaymentAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // nombre de la cuenta o etiqueta

  // datos generales
  @Column({ type: 'varchar', length: 150 })
  accountHolder: string; // titular de la cuenta

  @Column({ type: 'varchar', length: 50})
  bank: string; // banco asociado (opcional)

  @Column({ type: 'varchar', length: 50, nullable: true })
  email?: string; 

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // activar/desactivar cuenta



  // datos para Ecuador
  @Column({ type: 'varchar', unique: true, nullable: true })
  ruc: string; // RUC ecuatoriano (22 dígitos)

  @Column({ type: 'varchar', unique: true, nullable: true })
  nro_account: string; // RUC ecuatoriano (22 dígitos)

  // datos para argentina
  @Column({ type: 'varchar', length: 22, unique: true, nullable: true  })
  cbu: string; 

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true  })
  alias: string; // alias de la cuenta

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @Column({
    type: 'enum',
    enum: TypeAccountEnum,
    enumName: 'type_account_enum',
    nullable: true,
  })
  type_account: TypeAccountEnum;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
