import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('withdraw_account_types')
export class WithdrawAccountType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string; // Ej: BANK, WALLET

  @Column({ type: 'varchar' })
  name: string; // Ej: Cuenta Bancaria, Billetera Virtual
  // agregar tipo de cuenta para ecuador: 
  /** Descripción opcional para la UI */
  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
