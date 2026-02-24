// src/groups/groups.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeleteResult,
  UpdateResult,
  DataSource,
  FindOptionsWhere,
  ILike,
} from 'typeorm'; 
import { Group } from './entities/group.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderDto } from 'src/common/dto/order.dto';
import { GroupPrivacy } from './entities/group-privacy.entity';
import { RespGetTypeDto } from 'src/dto/resp-app.dto';
import { GetGroupsQueryDto } from './dto/filters-groups.dto';

@Injectable()
export class GroupsRepository {
  private readonly logger = new Logger(GroupsRepository.name);

  constructor(
    @InjectRepository(Group)
    private readonly repository: Repository<Group>,
    private readonly dataSurce: DataSource,
  ) {}

  async findAllWithFilters(
    query: GetGroupsQueryDto,
  ): Promise<[Group[], number]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
      name,
      is_active,
      user_id,
      privacy_id,
      is_delete = false,
    } = query;

    const where: FindOptionsWhere<Group> = {};

    // 🔹 Soft delete
    if (!is_delete) {
      where.is_delete = false;
    }

    // 🔹 Filtros simples
    if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    if (privacy_id) {
      where.privacy_id = privacy_id;
    }

    // 🔹 Filtro por nombre (LIKE)
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    return this.repository.findAndCount({
      where,
      relations: {
        user: true,
        group_type: true,
        privacy: true,
        cart:true
      },
      order: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOneById( id: string ): Promise<Group | null> {
    return await this.repository.findOne({
      where: {id},
      relations: {group_type:true, privacy:true, payment_type:true, user_address:true, cart:true}
    })
  }

  async findAllGroupPrivacy(): Promise<RespGetTypeDto<GroupPrivacy>> {
    const [data, total] = await this.dataSurce.manager.findAndCount(GroupPrivacy, {
      where: {is_active: true}
    })
    return {data, total}
  }

  async getGroupsByUserId (user_id:string, is_active: boolean = true): Promise <Group[]> {
    return await this.repository.find({
      where: {members: {user_id}, is_active},
      relations: {group_type:true, privacy:true, payment_type:true, cart:true},
    })
  }

  async getGroupsCreatedByUserId (user_id:string, is_active: boolean = true): Promise <Group[]> {
    return await this.repository.find({
      where: {user_id, is_active},
      relations: {group_type:true, privacy:true, payment_type:true, cart:true},
    })
  }

  async findOneByName(name: string): Promise<Group | null> {
    return this.repository.findOne({
      where: { name: name },
      relations: ['user', 'members.user', 'cart'], // Eager load relations for completeness
    });
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
    orderDto: OrderDto,
    filters?: {
      name?: string;
      is_active?: boolean;
      user_id?: string;
      is_delete?: boolean;
    },
  ): Promise<{ groups: Group[]; total: number }> {
    const { page, limit } = paginationDto;
    const { sortBy = 'created_at', order = 'DESC' } = orderDto;

    const qb = this.repository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.user', 'user')
      .leftJoinAndSelect('group.group_type', 'group_type')
      .leftJoinAndSelect('group.user_address', 'user_address');

    if (filters?.name)
      qb.andWhere('LOWER(group.name) LIKE LOWER(:name)', {
        name: `%${filters.name}%`,
      });

    if (filters?.is_active !== undefined)
      qb.andWhere('group.is_active = :is_active', {
        is_active: filters.is_active,
      });

    if (filters?.user_id)
      qb.andWhere('group.user_id = :user_id', {
        user_id: filters.user_id,
      });

    if (!filters?.is_delete)
      qb.andWhere('group.deleted_at IS NULL');

    qb.orderBy(`group.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [groups, total] = await qb.getManyAndCount();

    return { groups, total };
  }

  async create(group: Partial<Group>): Promise<Group> {
    
    return await this.repository.save(group);
  }

  async update (id:string, dto: Partial<Group>, user_id:string): Promise<UpdateResult> {
    return await this.repository.update({id, user_id}, dto);
  }

  async remove (id:string, user_id:string): Promise<DeleteResult> {
    return await this.repository.delete({id, user_id})
  }

}
