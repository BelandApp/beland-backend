import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassFiltersDto } from './dto/user-eventpass-filters.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@Injectable()
export class UserEventPassRepository {
  constructor(
    @InjectRepository(UserEventPass)
    private readonly repository: Repository<UserEventPass>,
  ) {}

  // 🔍 FIND ALL (paginated + filters)
  async findAll(
    page: number,
    limit: number,
    filters?: UserEventPassFiltersDto,
  ): Promise<RespGetArrayDto<UserEventPass>> {
    const where: FindOptionsWhere<UserEventPass> = {};

    if (filters?.is_consumed !== undefined)
      where.is_consumed = filters.is_consumed;
    if (filters?.is_active !== undefined)
      where.is_active = filters.is_active;
    if (filters?.is_refunded !== undefined)
      where.is_refunded = filters.is_refunded;
    if (filters?.event_pass_id)
      where.event_pass_id = filters.event_pass_id;
    if (filters?.user_id)
      where.user_id = filters.user_id;

    const [data, total] = await this.repository.findAndCount({
      where,
      relations: ['event_pass'],
      order: { purchase_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      page,
      limit,
      total,
      data
    };
  }

  // 🔎 FIND ONE (with relations)
  async findOne(id: string): Promise<UserEventPass | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['event_pass', 'user'],
    });
  }
}
