import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RewardCode } from './reward-code.entity';
import { User } from '../../../users/entities/users.entity';

export enum RedemptionStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
}

@Entity('reward_redemptions')
@Index('idx_reward_redemptions_email_unique', ['email'], { unique: true }) // REGLA CRITICA: 1 recompensa por email
export class RewardRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ManyToOne(() => RewardCode, (rc) => rc.redemptions, { nullable: false })
  @JoinColumn({ name: 'reward_code_id' })
  reward_code: RewardCode;
  
  @Column('uuid')
  reward_code_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column('uuid', { nullable: true })
  user_id: string | null;

  @Column({
    type: 'enum',
    enum: RedemptionStatus,
    default: RedemptionStatus.PENDING,
  })
  status: RedemptionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
