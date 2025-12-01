import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderFilterDto } from './dto/order-filter.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async findAll(filters: OrderFilterDto): Promise<[Order[], number]> {
    const {
      page = 1,
      limit = 10,
      min_total,
      max_total,
      fecha_desde,
      fecha_hasta,
      status_id,
    } = filters;

    // WHERE dinámico
    const where: FindOptionsWhere<Order> = {};

    // FILTRO POR TOTAL AMOUNT
    if (min_total && max_total) {
      where.total_amount = Between(min_total, max_total);
    } else if (min_total) {
      where.total_amount = MoreThanOrEqual(min_total);
    } else if (max_total) {
      where.total_amount = LessThanOrEqual(max_total);
    }

    // FILTRO POR STATUS
    if (status_id) {
      where.status_id = status_id;
    }

    // FILTRO POR FECHAS
    if (fecha_desde && fecha_hasta) {
      where.created_at = Between(fecha_desde, fecha_hasta);
    } else if (fecha_desde) {
      where.created_at = MoreThanOrEqual(fecha_desde);
    } else if (fecha_hasta) {
      where.created_at = LessThanOrEqual(fecha_hasta);
    }

    return this.repository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        status: true,
        payment_type: true,
        user: true,
        address:true,
      },
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
        order: { delivery_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {address:true, user:true},
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
