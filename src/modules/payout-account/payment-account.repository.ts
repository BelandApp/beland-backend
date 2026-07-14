import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PaymentAccount } from './entities/payment-account.entity';

@Injectable()
export class PaymentAccountRepository {
  constructor(
    @InjectRepository(PaymentAccount)
    private repository: Repository<PaymentAccount>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<[PaymentAccount[], number]> {

    return this.repository.findAndCount({
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user'],
    });
  }

  async findAllUser(
    user_id: string,
    page: number,
    limit: number,
    active?: boolean,
  ): Promise<[PaymentAccount[], number]> {
    const where: any = {};
    if (user_id)
      where.user_id = user_id;
    if (active)
      where.is_active = active;

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit
    });
  }

  async findOne(id: string): Promise<PaymentAccount> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(body: Partial<PaymentAccount>): Promise<PaymentAccount> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<PaymentAccount>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
