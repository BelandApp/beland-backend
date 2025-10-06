import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity'; 

export enum AdminBecoinOperation {
  CREATE = 'CREATE',   // creación de becoins (cuando entran USD al sistema)
  DESTROY = 'DESTROY', // destrucción de becoins (cuando se retiran o se queman)
}

@Entity({ name: 'admin-becoins' })
export class AdminBecoin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // cantidad de becoins (siempre positivo)
  @Column('int')
  becoin: number;

  // tipo de operación (creación o destrucción)
  @Column({
    type: 'enum',
    enum: AdminBecoinOperation,
  })
  operation_type: AdminBecoinOperation;

  // transacción relacionada
  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column('uuid')
  transaction_id: string;

  // fecha de registro
  @CreateDateColumn()
  created_at: Date;
}
