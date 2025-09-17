import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<[Order[], number]> {

    return this.repository.findAndCount({
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {status: true, payment_type:true},
    });
  }

  async findAllUser(
    user_id: string,
    page: number,
    limit: number,
  ): Promise<[Order[], number]> {

    return this.repository.findAndCount({
        where: {user_id},
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {status: true, payment_type:true},
    });
  }

  async findAllPending(
    status_id:string,
    page: number,
    limit: number,
  ): Promise<[Order[], number]> {

    return this.repository.findAndCount({
        where: {status_id},
        order: { created_at: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {address:true},
    });
  }

  async findOne(id: string): Promise<Order> {
    return this.repository.findOne({
      where: { id },
      relations: {status: true, payment_type:true, address:true, items:true, user:true},
    });
  }

  async create(body: Partial<Order>): Promise<Order> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<Order>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
