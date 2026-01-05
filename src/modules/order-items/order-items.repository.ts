import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrderItemsRepository {
  constructor(
    @InjectRepository(OrderItem)
    private repository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    order_id: string,
  ): Promise<[OrderItem[], number]> {

    return this.repository.findAndCount({
        where: {order_id},
        order: { created_at: 'DESC' },
        relations: {product:true},
    });
  }

  async findOne(id: string): Promise<OrderItem> {
    return this.repository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async create(body: Partial<OrderItem>): Promise<OrderItem> {
    const product = await this.dataSource.manager.findOne(Product, {
      where: {id: body.product_id}
    })
    body.unit_weight = Number(product.weight);
    body.total_weight = Number(product.weight) * body.ordered_quantity;
    return await this.repository.save(body);
  }

  async createMany(items: Partial<OrderItem>[]) {
    const itemsToSave = await Promise.all(
      items.map(async (item) => {
        const product = await this.dataSource.manager.findOne(Product, {
          where: { id: item.product_id },
        });

        if (!product) {
          throw new Error(`Producto ${item.product_id} no encontrado`);
        }

        item.unit_weight = Number(product.weight);
        item.total_weight =
          Number(product.weight) * Number(item.ordered_quantity ?? 0);

        return item;
      }),
    );

    return await this.repository.save(itemsToSave);
  }

  async update(id: string, body: Partial<OrderItem>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
