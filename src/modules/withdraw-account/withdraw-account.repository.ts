import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { WithdrawAccount } from './entities/withdraw-account.entity';

@Injectable()
export class WithdrawAccountsRepository {
  constructor(
    @InjectRepository(WithdrawAccount)
    private repository: Repository<WithdrawAccount>,
  ) {}

  async findAll(
    user_id: string,
    page: number,
    limit: number,
    is_active?: boolean,
  ): Promise<[WithdrawAccount[], number]> {
    const where: any = {} 
    where.user_id = user_id;

    if (is_active) where.is_active = is_active;

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit
    });
  }

  async findOne(id: string): Promise<WithdrawAccount> {
    return this.repository.findOne({
      where: { id }
    });
  }

  async create(body: Partial<WithdrawAccount>): Promise<WithdrawAccount> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<WithdrawAccount>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
