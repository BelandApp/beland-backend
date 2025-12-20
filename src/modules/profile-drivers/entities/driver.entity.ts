import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/users.entity'; 
import { UserAddress } from '../../user-address/entities/user-address.entity';
import { Vehicle } from './vehicle.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con el usuario base
  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'uuid' })
  user_id: string;

  // --- DATOS HUMANOS / CONEXIÓN ---
  @Column({ type: 'text', nullable: true })
  motivation_bio: string; // "Este trabajo me ayuda a pagar mis estudios de medicina..."

  @Column({ type: 'text', nullable: true })
  profile_tagline: string; // Ej: "Padre de familia y amante del reciclaje"

  @Column({ type: 'text', nullable: true })
  face_image_url: string;

  // --- DATOS OPERATIVOS ---
  @ManyToOne(() => Vehicle)
  @JoinColumn({name:'vehicle_type_id'})
  vehicle_type: Vehicle
  @Column('uuid')
  vehicle_type_id: string;

  @Column({ type: 'text', nullable: true })
  vehicle_description: string; // Ej: "Honda CB125 Color Roja"

  @Column({ type: 'text', nullable: true })
  vehicle_plate: string; // Patente/Placa

  @Column({ type: 'text', nullable: true })
  vehicle_image_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Para "conectarse" o "desconectarse" de la app

  // --- UBICACIÓN DE TRABAJO ---
  // Relación con tu tabla de direcciones existente
  @ManyToOne(() => UserAddress, { nullable: true })
  @JoinColumn({ name: 'work_address_id' })
  work_address: UserAddress;

  @Column({ type: 'uuid', nullable: true })
  work_address_id: string;

  // --- DOCUMENTACIÓN (Privado) ---
  @Column({ type: 'text', nullable: true })
  license_number: string;

  // --- ESTADÍSTICAS RÁPIDAS (Opcional) ---
  @Column({ type: 'float', default: 0 })
  rating: number; // Promedio de estrellas

  @Column({ type: 'int', default: 0 })
  total_deliveries: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}