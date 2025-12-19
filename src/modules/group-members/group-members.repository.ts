// src/group-members/group-members.repository.ts
import { Repository, Not, IsNull, DeleteResult } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderDto } from 'src/common/dto/order.dto';
import { Group } from 'src/modules/groups/entities/group.entity'; // Importar Group entity
import { User } from 'src/modules/users/entities/users.entity'; // Importar User entity

@Injectable()
export class GroupMembersRepository {
  private readonly logger = new Logger(GroupMembersRepository.name);

  constructor(
    @InjectRepository(GroupMember)
    private readonly repository: Repository<GroupMember>,
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
    return this.repository.save(groupMember);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

}
