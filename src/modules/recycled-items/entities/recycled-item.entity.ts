// recycled-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('recycled_items')
export class RecycledItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 7, scale: 3, default: 0, nullable:true })
  weight: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.recycledItems, { nullable: true })
  @JoinColumn({name: 'user_id'})
  user: User;
  @Column('uuid', { nullable: true })
  user_id: string
}
