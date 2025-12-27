import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { WithdrawAccountType } from '../../withdraw-account-type/entities/withdraw-account-type.entity';
import { CountryEnum, Currency, HolderDocumentType } from '../enums/withdraw-account.enum';

@Entity('withdraw_accounts')
export class WithdrawAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Pais
  @Column({ type: 'enum', enum: CountryEnum, nullable:true })
  country: CountryEnum;

  @Column({ type: 'enum', enum: Currency, nullable:true })
  currency: Currency;

  //Banco
  @Column({ length: 50, nullable:true })
  bankCode: string;

  @Column({ length: 150, nullable:true })
  bankName: string;

  @ManyToOne(() => WithdrawAccountType, { eager: true })
  @JoinColumn({ name: 'withdraw_account_type_id'})
  withdraw_account_type: WithdrawAccountType;
  @Column('uuid',{ nullable:true})
  withdraw_account_type_id: string;

  // Ecuador / Colombia
  @Column({ nullable: true, length: 34 })
  accountNumber: string | null;

  // Argentina
  @Column({ nullable: true, length: 22 })
  cbu: string | null;

  @Column({ nullable: true, length: 50 })
  alias: string | null;

  // Datos del titular
  @Column({ length: 150, nullable:true })
  holderName: string;

  @Column({ length: 30, nullable:true })
  holderDocument: string;

  @Column({ type: 'enum', enum: HolderDocumentType, nullable:true })
  holderDocumentType: HolderDocumentType;

  @ManyToOne(() => User, (user) => user.withdraw_accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('uuid')
  user_id: string;

  @OneToOne(() => Wallet, (wallet) => wallet.withdraw_account, { onDelete: 'CASCADE' })
  wallet: Wallet;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
