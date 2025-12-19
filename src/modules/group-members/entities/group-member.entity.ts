// src/group-members/entities/group-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/users.entity';
import { RoleGroupNames } from '../enums/role-group.enum';

@Entity('group_members')
@Unique(['group_id', 'user_id']) // Ensures a user can only be a member of a group once
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', default: 'MEMBER' })
  role: RoleGroupNames;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ManyToOne relationship with Group
  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group;
  @Column('uuid')
  group_id:string;

  // ManyToOne relationship with User
  @ManyToOne(() => User, (user) => user.group_memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id'})
  user: User;
  @Column('uuid')
  user_id:string;
}
