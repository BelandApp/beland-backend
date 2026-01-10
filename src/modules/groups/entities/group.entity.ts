// src/groups/entities/group.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  OneToOne, // <-- Correctly imported
} from 'typeorm';
import { GroupMember } from '../../group-members/entities/group-member.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/users.entity';
import { GroupType } from '../../group-type/entities/group-type.entity';
import { UserAddress } from '../../user-address/entities/user-address.entity';
import { GroupPrivacy } from './group-privacy.entity';
import { EventPass } from '../../event-pass/entities/event-pass.entity';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  message_invitation: string;

  @ManyToOne(() => UserAddress, {onDelete : 'SET NULL'})
  @JoinColumn({name:'user_address_id'})
  user_address: UserAddress;
  @Column('uuid', { nullable:true })
  user_address_id:string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_delete: boolean;

  @Column({ type: 'timestamptz', nullable: true }) // <-- New column for soft delete
  deleted_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true }) // <-- New column for soft delete
  event_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' }) // <-- New column for last update date
  updated_at: Date;

  // ManyToOne relationship with User entity (the group leader)
  @ManyToOne(() => User, (user) => user.led_groups, {
    nullable: true, // A group might not have a leader assigned initially (though logic assigns one)
    onDelete: 'SET NULL', // If the leader user is deleted, their reference in the group is set to NULL
  })
  @JoinColumn({ name: 'user_id'}) 
  user: User;
  @Column('uuid') 
  user_id: string;

  @ManyToOne(() => GroupType, {onDelete : 'SET NULL'})
  @JoinColumn({name:'group_type_id'})
  group_type: GroupType;
  @Column('uuid', { nullable:true })
  group_type_id:string;

  @ManyToOne(() => GroupPrivacy)
  @JoinColumn({ name: 'privacy_id' })
  privacy: GroupPrivacy;
  @Column({ type: 'uuid', nullable:true })
  privacy_id: string;

  @ManyToOne(() => PaymentType, {onDelete : 'SET NULL'})
  @JoinColumn({name:'payment_type_id'})
  payment_type: PaymentType;
  @Column('uuid', { nullable:true })
  payment_type_id:string;

  @OneToOne(() => EventPass, (event) => event.group)
  @JoinColumn({ name: 'event_pass_id' })
  event_pass: EventPass;
  @Column({ type: 'uuid', nullable:true })
  event_pass_id: string;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => Order, (order) => order.group)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.group)
  cart: Cart[];
}
