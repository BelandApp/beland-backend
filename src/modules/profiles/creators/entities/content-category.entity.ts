import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('content_categories')
@Unique(['code'])
export class ContentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Código técnico (FOOD, TECH, FITNESS, etc)
  @Column({ type: 'varchar', length: 50 })
  code: string;

  // Nombre visible en español
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
