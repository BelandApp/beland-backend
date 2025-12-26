import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('social_networks')
@Unique(['code'])
export class SocialNetwork {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Código técnico (INSTAGRAM, TIKTOK, etc)
  @Column({ type: 'varchar', length: 50 })
  code: string;

  // Nombre legible en español
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
