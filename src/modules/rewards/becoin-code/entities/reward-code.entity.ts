import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RewardRedemption } from './reward-redemption.entity';

@Entity('reward_codes')
export class RewardCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  code: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount: number; // Cantidad de Orange BeCoins a entregar

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'integer', nullable: true })
  max_uses: number | null; // Null significa sin limite de usos globales

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => RewardRedemption, (redemption) => redemption.reward_code)
  redemptions: RewardRedemption[];
}
