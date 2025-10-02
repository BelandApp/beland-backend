import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserWithdraw } from './entities/user-withdraw.entity';

@Injectable()
export class UserWithdrawsRepository {
  constructor(
    @InjectRepository(UserWithdraw)
    private repository: Repository<UserWithdraw>,
  ) {}

  async findAll(
    status_id: string,
    page: number,
    limit: number,
  ): Promise<[UserWithdraw[], number]> {
    const where: any = {};
    if (status_id) {
        where.status_id = status_id;
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['status', 'type'],
    });
  }

  async findAllUser(
    user_id: string,
    status_id: string,
    account_id: string,
    page: number,
    limit: number,
  ): Promise<[UserWithdraw[], number]> {
    const where: any = {};
    where.user_id = user_id;

    if (status_id) {
        where.status_id = status_id;
    }

    if (account_id) {
        where.withdraw_account_id = account_id;
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['status', 'type'],
    });
  }

  async findOne(id: string): Promise<UserWithdraw> {
    return this.repository.findOne({
      where: { id },
      relations: ['status', 'type'],
    });
  }

  async create(body: Partial<UserWithdraw>): Promise<UserWithdraw> {
    return await this.repository.save({...body});
  }

  async update(id: string, body: Partial<UserWithdraw>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
