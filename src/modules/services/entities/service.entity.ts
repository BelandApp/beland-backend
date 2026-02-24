import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost: number | null; // costo interno

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number | null; // precio fiat

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price_becoin: number | null; // precio becoin

  @Column({ type: 'int', nullable: true })
  day_limit_cancelled: number | null; // cantidad de dias previos para cancelar sin consecuencias

  @Column({ type: 'int', nullable: true })
  porcent_cancelled: number | null; // cantidad de porcentaje del precio del servicio a retener en caso de cancelar fuera de tiempo 0-100

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @Column('boolean', {default:true})
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
