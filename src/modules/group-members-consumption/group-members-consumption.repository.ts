import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GroupMemberConsumptionFiltersDto } from './dto/group-member-consumption-filters.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { GroupMemberConsumption } from './entities/group-members-consumption.entity';
import { CreateGroupMemberConsumptionDto, CreateManyGroupMemberConsumptionDto } from './dto/create-group-members-consumption.dto';
import { GroupMember } from '../group-members/entities/group-member.entity';
import { UpdateGroupMemberConsumptionDto } from './dto/update-group-members-consumption.dto';

@Injectable()
export class GroupMemberConsumptionsRepository extends Repository<GroupMemberConsumption> {
  constructor(dataSource: DataSource) {
    super(GroupMemberConsumption, dataSource.createEntityManager());
  }

    async findAll(
    filters: GroupMemberConsumptionFiltersDto
    ): Promise<RespGetArrayDto<GroupMemberConsumption>> {
    const {page = 1,limit = 10,...where} = filters;

    const [data, total] = await this.findAndCount({
        where: {
        ...Object.entries(where).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
            acc[key] = value;
            }
            return acc;
        }, {}),
        },
        relations: {
        product: true,
        groupMember: true,
        group: true,
        },
        order: {
        created_at: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        data,
        total,
        page,
        limit,
    };
    }


  async findOneById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['product', 'groupMember', 'group'],
    });
  }

  async findUserConsumptions(group_id: string, user_id: string) {
    return this.find({
      where: { group_id, groupMember: {user_id} },
      relations: ['product', 'groupMember', 'group'],
    });
  }

    async findGroupedByProduct(group_id: string): Promise<Array<{
      product_id: string;
      product_name: string;
      product_image_url: string | null;
      total_consumers: number;
    }>> {
    return this.createQueryBuilder('gmc')
        .innerJoin('gmc.product', 'product')
        .select([
        'product.id AS product_id',
        'product.name AS product_name',
        'product.image_url AS product_image_url',
        'COUNT(gmc.id)::int AS total_consumers',
        ])
        .where('gmc.group_id = :group_id', { group_id })
        .groupBy('product.id')
        .addGroupBy('product.name')
        .addGroupBy('product.image_url')
        .orderBy('total_consumers', 'DESC')
        .getRawMany();
    }


  async createOne(dto: CreateGroupMemberConsumptionDto, user_id:string) {
    const { group_id, product_id, notes } = dto;
    const groupMember = await this.manager.findOne(GroupMember, {
        where: {group_id, user_id}
    })

    if (!groupMember) {
        throw new NotFoundException('Usted no es miembro del grupo donde esta intentando guardar los consumos.');
    }

    const entity = this.create({
      group_id,
      group_member_id: groupMember.id,
      product_id: product_id,
      notes: notes,
    });
    
    return await this.save(entity);
  }

    async createMany(dto: CreateManyGroupMemberConsumptionDto, user_id:string) {
    const { group_id, productsNotes } = dto;

    const groupMember = await this.manager.findOne(GroupMember, {
        where: {group_id, user_id}
    })

    if (!groupMember) {
        throw new NotFoundException('Usted no es miembro del grupo donde esta intentando guardar los consumos.');
    }

    const entities = productsNotes.map((item) =>
        this.create({
        group_id,
        group_member_id: groupMember.id,
        product_id: item.product_id,
        notes: item.notes,
        }),
    );

    return this.save(entities);
    }


  async updateOne(id: string, dto: UpdateGroupMemberConsumptionDto) {
    await this.update(id, dto);
    return this.findOneById(id);
  }

  async deleteOne(id: string) {
    return this.delete(id);
  }
}
