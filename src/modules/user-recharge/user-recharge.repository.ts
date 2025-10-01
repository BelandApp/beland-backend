import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RechargeTransfer } from './entities/user-recharge.entity';

@Injectable()
export class UserRechargeRepository {
  constructor(
    @InjectRepository(RechargeTransfer)
    private repository: Repository<RechargeTransfer>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    status_id?:string,
  ): Promise<[RechargeTransfer[], number]> {
    
    const where = status_id ? {status_id} : {}
    
    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {user:true, status:true},
    });
  } 

  async findOne(id: string): Promise<RechargeTransfer> {
    return this.repository.findOne({
      where: { id },
      relations: {user:true, paymentAccount:true, status:true}
    });
  }

  async update(id: string, body: Partial<RechargeTransfer>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

}
