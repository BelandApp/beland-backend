import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { SectionCode } from '../enum/feedback.enum';

@Entity('user_feedback')
export class UserFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación: quién dejó la valoración
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  user_id: string;

  // Puntuación de la app (1 a 5 estrellas)
  @Column({ type: 'int', width: 1 })
  rating: number;

  // Comentario opcional
  @Column({ type: 'text', nullable: true })
  comment?: string;

  // Contexto opcional: en qué parte de la app se pidió feedback
  @Column({
    type: 'enum',
    enum: SectionCode,
    nullable: true,
  })
  section?: SectionCode;

  // Ej: "checkout", "home", "feature_x"

  // Si querés capturar metadata técnica
  @Column({ type: 'varchar', length: 50, nullable: true })
  platform?: string; 
  // Ej: "android", "ios", "web"

  @Column({ type: 'varchar', length: 50, nullable: true })
  app_version?: string;

  // Control de estados (si lo vas a moderar o responder)
  @Column({ type: 'boolean', default: false })
  reviewed: boolean;

  // Timestamps
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
