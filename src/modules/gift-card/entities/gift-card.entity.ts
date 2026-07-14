import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'gift_cards' })

// 🔎 Índices de búsqueda y filtros frecuentes
@Index('IDX_GIFT_CARD_IS_ACTIVE', ['is_active'])
@Index('IDX_GIFT_CARD_CREATED_AT', ['created_at'])
@Index('IDX_GIFT_CARD_CURRENCY', ['currency'])
@Index('IDX_GIFT_CARD_AMOUNT', ['amount'])
@Index('IDX_GIFT_CARD_ACTIVE_CREATED', ['is_active', 'created_at'])
export class GiftCard {
  // 🆔 ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🪧 Nombre visible
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  name: string;

  // 📝 Descripción
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  // 🖼️ Imagen principal
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  image_url?: string;

  // 💰 Monto de la gift card
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount: number;

  // 💱 Moneda
  @Column({
    type: 'varchar',
    length: 10,
    default: 'USD',
    nullable: false,
  })
  currency: string;

  // ⏳ Cantidad de días hasta expiración
  // null = nunca expira
  @Column({
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  expiration_days?: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
    nullable: false,
  })
  sold_quantity: number;

  // ⚙️ Estado activo/inactivo
  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  is_active: boolean;

  // 🕓 Fecha creación
  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  // 🕓 Fecha actualización
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at?: Date;
}