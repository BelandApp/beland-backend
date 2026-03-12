import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RecycledItem } from './entities/recycled-item.entity';

@Injectable()
export class RecycledItemsRepository {
  constructor(
    @InjectRepository(RecycledItem)
    private repository: Repository<RecycledItem>,
  ) {}

  async findAll(
    user_id: string,
    page: number,
    limit: number,
  ): Promise<[RecycledItem[], number]> {
    let where: Object; 
    if (user_id) {
        where = {user_id} 
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: [ 'user' ],
    });
  }

  async findOne(id: string): Promise<RecycledItem> {
    return this.repository.findOne({
      where: { id },
      relations: ['product', 'scanned_by_user'],
    });
  }

  async create(body: Partial<RecycledItem>): Promise<RecycledItem> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<RecycledItem>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
