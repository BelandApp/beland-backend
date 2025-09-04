import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserFeedback } from './entities/user-feedback.entity';
import { FindAllFilters } from './dto/find-all-filter.dto';

@Injectable()
export class UserFeedbackRepository {
  constructor(
    @InjectRepository(UserFeedback)
    private repository: Repository<UserFeedback>,
  ) {}

  async findAllUser(
    user_id:string,
    page: number,
    limit: number,
  ): Promise<[UserFeedback[], number]> {

    return this.repository.findAndCount({
        where: {user_id},
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit
    });
  }

  async findAllWithFilters(
    filters: FindAllFilters,
  ): Promise<{ data: UserFeedback[]; total: number }> {
    const { page, limit, user_id, section, rating, platform } = filters;

    const query = this.repository.createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user'); // 👈 trae la relación user

    if (user_id) {
      query.andWhere('feedback.user_id = :user_id', { user_id });
    }
    if (section) {
      query.andWhere('feedback.section = :section', { section });
    }
    if (rating) {
      query.andWhere('feedback.rating = :rating', { rating });
    }
    if (platform) {
      query.andWhere('feedback.platform = :platform', { platform });
    }

    query.orderBy('feedback.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }


  async findOne(id: string): Promise<UserFeedback> {
    return this.repository.findOne({
      where: { id }
    });
  }

  async create(body: Partial<UserFeedback>): Promise<UserFeedback> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<UserFeedback>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
