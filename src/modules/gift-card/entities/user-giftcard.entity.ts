import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GiftCard } from './gift-card.entity';
import { User } from '../../users/entities/users.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { UserGiftCardStatus } from '../enums/giftcard-status.enum';

@Entity({ name: 'user_gift_cards' })

// 🔎 Índices simples
@Index('IDX_USER_GIFT_CARD_STATUS', ['status'])
@Index('IDX_USER_GIFT_CARD_IS_ACTIVE', ['is_active'])
@Index('IDX_USER_GIFT_CARD_EXPIRES_AT', ['expires_at'])
@Index('IDX_USER_GIFT_CARD_CREATED_AT', ['created_at'])

@Index('IDX_USER_GIFT_CARD_SENDER', ['sender_user_id'])
@Index('IDX_USER_GIFT_CARD_RECIPIENT_WALLET', ['recipient_wallet_id'])
@Index('IDX_USER_GIFT_CARD_TEMPLATE', ['gift_card_id'])

// 🔎 Índices compuestos
@Index('IDX_USER_GIFT_CARD_RECIPIENT_STATUS', [
  'recipient_wallet_id',
  'status',
])

@Index('IDX_USER_GIFT_CARD_ACTIVE_EXPIRES', [
  'is_active',
  'expires_at',
])

@Index('IDX_USER_GIFT_CARD_RECIPIENT_ACTIVE', [
  'recipient_wallet_id',
  'is_active',
])

@Index('IDX_USER_GIFT_CARD_STATUS_CREATED', [
  'status',
  'created_at',
])

export class UserGiftCard {
  // 🆔 ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🎁 Template usado
  @ManyToOne(() => GiftCard, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'gift_card_id' })
  gift_card: GiftCard;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  gift_card_id: string;

  // 👤 Usuario que la regaló
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sender_user_id' })
  sender_user: User;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  sender_user_id: string;

  // 👛 Wallet que la recibió
  @ManyToOne(() => Wallet, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'recipient_wallet_id' })
  recipient_wallet: Wallet;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  recipient_wallet_id: string;

  // 💌 Mensaje personalizado
  @Column({
    type: 'text',
    nullable: true,
  })
  message?: string;

  // 💰 Saldo original
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  original_balance: number;

  // 💵 Saldo actual disponible
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  current_balance: number;

  // 🔒 Saldo reservado temporalmente
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  reserved_balance: number;

  // 📅 Fecha de uso total
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  redeemed_at?: Date;

  // 📅 Fecha de expiración
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expires_at?: Date;

  // 📅 Fecha de ultimo uso
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  last_used_at?: Date;

  // ⚙️ Estado activo
  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  is_active: boolean;

  // 📦 Estado de negocio
  @Column({
    type: 'enum',
    enum: UserGiftCardStatus,
    default: UserGiftCardStatus.ACTIVE,
    nullable: false,
  })
  status: UserGiftCardStatus;

  // 🕓 Auditoría
  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}