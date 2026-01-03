// src/group-members/group-members.repository.ts
import { Repository, Not, IsNull, DeleteResult, DataSource } from 'typeorm';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { CreateManyGroupMemberDto } from './dto/create-group-member.dto';
import { Group } from '../groups/entities/group.entity';
import { NotFoundException } from '@zxing/library';
import { User } from '../users/entities/users.entity';
import { RoleGroupEnum } from './enums/role-group.enum';


@Injectable()
export class GroupMembersRepository {
  private readonly logger = new Logger(GroupMembersRepository.name);

  constructor(
    @InjectRepository(GroupMember)
    private readonly repository: Repository<GroupMember>,
    private readonly dataSource: DataSource,
  ) {}

  async findOneById(id: string): Promise<GroupMember | null> {
    return await this.repository.findOne({
      where: {id},
      relations: {group:true, user:true}
    })
  }

  async findOneByGroupAndUser(group_id: string, user_id: string ): Promise<GroupMember | null> {
    return await this.repository.findOne({
      where: {user_id, group_id},
      relations: {group:true, user:true}
    })
  }

  async findMembersByGroupId(group_id: string): Promise<GroupMember[]> {
    return await this.repository.find({
      where: {group_id},
      relations: {user:true}
    })
  }

  async findGroupsByUserId(user_id: string): Promise<GroupMember[]> {
    return await this.repository.find({
      where: {user_id},
      relations: {group:true}
    })
  }

  async create(groupMember: Partial<GroupMember>): Promise<GroupMember> {
    return await this.repository.save(groupMember);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

}
