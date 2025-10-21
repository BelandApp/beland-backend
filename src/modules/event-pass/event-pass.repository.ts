import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { EventPass } from './entities/event-pass.entity';
import { EventPassFiltersDto } from './dto/event-pass-filter.dto';
import { RespGetArrayDto } from 'src/dto/resp-get-Array.dto';
import { EventPassType } from './entities/event-pass-type.entity';

@Injectable()
export class EventPassRepository {
  constructor(
    @InjectRepository(EventPass)
    private repository: Repository<EventPass>,
    private readonly datasource: DataSource,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filters?: EventPassFiltersDto,
    ): Promise<RespGetArrayDto<EventPass>> {
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

    const [data, total] = await query.getManyAndCount();
    const respEventPass: RespGetArrayDto<EventPass> = {
      page,
      limit,
      total,
      data
    }
    return respEventPass;
    }
  
  async findAllTypes(
    page: number,
    limit: number,
    ): Promise<RespGetArrayDto<EventPassType>> {
    const typeRepo = this.datasource.manager.getRepository(EventPassType)
    const query = typeRepo.createQueryBuilder('event_type');

    query.skip((page - 1) * limit)
        .take(limit);

    const [data, total] = await query.getManyAndCount();
    const respEventPass: RespGetArrayDto<EventPassType> = {
      page,
      limit,
      total,
      data
    }
    return respEventPass;
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
