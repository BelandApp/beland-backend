import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Service } from '../../services/entities/service.entity';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';

@Entity('group_services')
export class GroupService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;
  @Column('uuid')
  group_id: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;
  @Column('uuid')
  service_id: string;

  @ManyToOne(() => PaymentType)
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType;
  @Column('uuid')
  payment_type_id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total_amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
