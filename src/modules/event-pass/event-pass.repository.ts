import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { EventPass } from './entities/event-pass.entity';
import { EventPassFiltersDto } from './dto/event-pass-filter.dto';

@Injectable()
export class EventPassRepository {
  constructor(
    @InjectRepository(EventPass)
    private repository: Repository<EventPass>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filters?: EventPassFiltersDto,
    ): Promise<[EventPass[], number]> {
    const query = this.repository.createQueryBuilder('event');

    // FILTROS DINÁMICOS
    if (filters) {
        if (filters.is_active !== undefined) {
        query.andWhere('event.is_active = :is_active', { is_active: filters.is_active });
        }

        if (filters.name) {
        query.andWhere('event.name ILIKE :name', { name: `%${filters.name}%` });
        }

        if (filters.created_by_id) {
        query.andWhere('event.created_by_id = :created_by_id', { created_by_id: filters.created_by_id });
        }

        if (filters.min_price !== undefined) {
        query.andWhere('event.final_becoin >= :min_price', { min_price: filters.min_price });
        }

        if (filters.max_price !== undefined) {
        query.andWhere('event.final_becoin <= :max_price', { max_price: filters.max_price });
        }

        if (filters.start_date) {
        query.andWhere('event.event_date >= :start_date', { start_date: filters.start_date });
        }

        if (filters.end_date) {
        query.andWhere('event.event_date <= :end_date', { end_date: filters.end_date });
        }
    }

    // ORDEN y PAGINACIÓN
    query.orderBy('event.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

    const [data, count] = await query.getManyAndCount();
    return [data, count];
    }

  async findOne(id: string): Promise<EventPass> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(body: Partial<EventPass>): Promise<EventPass> {
    return await this.repository.save(body);
  }

  async update(id: string, body: Partial<EventPass>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
