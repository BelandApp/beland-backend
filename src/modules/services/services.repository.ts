import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Service } from "./entities/service.entity";
import { ServiceFiltersDto } from "./dto/service-filters.dto";
import { RespGetArrayDto } from "src/dto/resp-app.dto";

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filters?: ServiceFiltersDto,
  ): Promise<RespGetArrayDto<Service>> {
    const query = this.repository.createQueryBuilder('service');

    if (filters) {
      if (filters.is_active !== undefined) {
        query.andWhere('service.is_active = :is_active', { is_active: filters.is_active });
      }

      if (filters.is_available !== undefined) {
        query.andWhere('service.is_available = :is_available', { is_available: filters.is_available });
      }

      if (filters.name) {
        query.andWhere('service.name ILIKE :name', { name: `%${filters.name}%` });
      }

    }
    const orderBy = filters?.order_by ?? 'created_at';
    const orderDirection = filters?.order_direction ?? 'DESC';


    query
      .orderBy(`service.${orderBy}`, orderDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return { page, limit, total, data };
  }

  async findOne(id: string): Promise<Service> {
    return this.repository.findOne({ where: { id } });
  }

  async create(body: Partial<Service>): Promise<Service> {
    return this.repository.save(body);
  }

  async update(id: string, body: Partial<Service>): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
