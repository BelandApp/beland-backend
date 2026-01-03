import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { PaymentType } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypesRepository {
  constructor(
    @InjectRepository(PaymentType)
    private repository: Repository<PaymentType>,
  ) {}

  async findAll(
  ): Promise<[PaymentType[], number]> {

    return this.repository.findAndCount({
        order: { created_at: 'DESC' }
    });
  }

async findAtServices(): Promise<[PaymentType[], number]> {
  return this.repository.findAndCount({
    where: {
      code: Not('SPLIT'),
    },
    order: {
      created_at: 'DESC',
    },
  });
}

  async findOne(id: string): Promise<PaymentType> {
    return this.repository.findOne({
      where: { id }
    });
  }

  async create(body: Partial<PaymentType>): Promise<PaymentType> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<PaymentType>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
