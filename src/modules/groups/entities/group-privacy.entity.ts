import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('group_privacies')
export class GroupPrivacy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_visible:boolean;

  @Column({ type: 'boolean', default: false })
  allow_free_join:boolean;

  @Column({ type: 'boolean', default: false })
  require_approval:boolean;

  @Column({ type: 'boolean', default: true })
  is_active:boolean;
}
