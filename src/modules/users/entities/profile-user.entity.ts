import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Profile } from './profile.entity';

@Entity('users-profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Clave primaria UUID

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({name: 'user_id'})
  user: User;
  @Column({ type: 'uuid'})
  user_id: string

  @ManyToOne(() => Profile, (profile) => profile.users)
  @JoinColumn({name: 'profile_id'})
  profile: Profile;
  @Column({ type: 'uuid'})
  profile_id: string

  @CreateDateColumn()
  created_at: Date;

}
