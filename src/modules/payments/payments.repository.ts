import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private repository: Repository<Payment>,
  ) {}

  async findAll(
    order_id: string, 
    user_id: string,
    page: number,
    limit: number,
  ): Promise<[Payment[], number]> {
    let where: Object; 
    if (order_id) {
        where = {order_id} 
    } else {
        where = user_id ? {user_id} : {};
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {order:true, user:true},
    });
  }

  async findPaymentsByOrder(
    order_id: string, 
    user_id: string,
    uncompleted:boolean,
    page: number,
    limit: number,
  ): Promise<[Payment[], number]> {
    const where: any = {
      order_id,
      order: { user_id },
    };

    if (uncompleted) {
      where.is_fully_paid = false;
    }
    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: { user:true},
    });
  }

  async findOne(id: string): Promise<Payment> {
    return this.repository.findOne({
      where: { id },
      relations: ['group', 'user'],
    });
  }

  async create(body: Partial<Payment>): Promise<Payment> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<Payment>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
