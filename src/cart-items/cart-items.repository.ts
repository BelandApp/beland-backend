import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { NotFoundException } from '@zxing/library';

@Injectable()
export class CartItemsRepository {
  constructor(
    @InjectRepository(CartItem)
    private repository: Repository<CartItem>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    cart_id: string,
    page: number,
    limit: number,
  ): Promise<[CartItem[], number]> {
    const where = cart_id ? { cart_id } : {};

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: {product:true},
    });
  }

  async findOne(id: string): Promise<CartItem> {
    return this.repository.findOne({
      where: { id },
      relations: {product:true},
    });
  }

  async create(body: Partial<CartItem>): Promise<CartItem> {
    const item = await this.repository.findOne({where: {cart_id: body.cart_id, product_id:body.product_id}})
    if (!item) {
      const product = await this.dataSource.manager.findOneBy(Product, {id: body.product_id})
      if (!product) throw new NotFoundException('Producto no encontrado')
      body.unit_price = +product.price;
      body.unit_becoin = +product.price_becoin;
      body.total_price = +product.price * +body.quantity;
      body.total_becoin = +product.price_becoin * +body.quantity;
      return await this.repository.save(body);
    }
    const quantity = +item.quantity + +body.quantity;
    item.quantity = +quantity;
    item.total_price = +item.unit_price * +quantity
    item.total_becoin = +item.unit_becoin * +quantity
    return await this.repository.save(item);
  }

  async update(id: string, body: Partial<CartItem>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
