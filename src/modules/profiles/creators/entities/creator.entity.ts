import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../../users/entities/users.entity';
import { SocialNetwork } from './social-network.entity';
import { ContentCategory } from './content-category.entity';

@Entity('creators')
export class Creator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  user_id: string;

  // Categoría de contenido
  @ManyToOne(() => ContentCategory)
  @JoinColumn({ name: 'category_id' })
  category: ContentCategory;
  @Column('uuid')
  category_id: string;

  // Red social principal
  @ManyToOne(() => SocialNetwork)
  @JoinColumn({ name: 'main_social_network_id' })
  main_social_network: SocialNetwork;
  @Column('uuid')
  main_social_network_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  main_link: string;

  @Column({ type: 'int', nullable: true })
  followers_count: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
