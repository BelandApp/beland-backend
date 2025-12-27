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
import { RoleGroupEnum } from '../enums/role-group.enum';

@Entity('group_members')
@Unique(['group_id', 'user_id'])
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleGroupEnum,
    enumName: 'group_member_role_enum',
    default: RoleGroupEnum.MEMBER,
  })
  role: RoleGroupEnum;

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
