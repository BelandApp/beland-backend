import { GroupMember } from "src/modules/group-members/entities/group-member.entity";
import { Group } from "../../groups/entities/group.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";

@Entity('group_member_consumptions')
export class GroupMemberConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;
  @Column('uuid')
  group_id: string;

  @ManyToOne(() => GroupMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_member_id' })
  groupMember: GroupMember;
  @Column('uuid')
  group_member_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Column('uuid')
  product_id: string;

  @Column({ type: 'varchar', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
