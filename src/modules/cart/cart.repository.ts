import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@zxing/library';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(Cart)
    private repository: Repository<Cart>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUser(user_id: string): Promise<Cart> {
    return this.repository.findOne({
      where: { user_id },
      relations: {payment_type:true, items: {product: true}}
    });
  }

  async findOne(id: string): Promise<Cart> {
    return this.repository.findOne({
      where: { id },
      relations: {payment_type:true, items: {product: true}}
    });
  }

  async create(body: Partial<Cart>): Promise<Cart> {
    return await this.repository.save(body);
  }

  async updateCleanCart(id: string): Promise<Cart> {
    const cart = await this.repository.findOne({
      where: {id},
      relations: {items:true},
    })

    if (!cart) throw new NotFoundException ("Carrito no encontrado")

    cart.address_id = null;
    cart.group_id = null;
    cart.payment_type_id = null;
    cart.total_amount = 0;
    cart.total_items = 0;

    await this.dataSource.manager.delete(CartItem, {cart_id : cart.id})

    const cartClean = await this.repository.save(cart)
    
    return cartClean;
  }

  async update(id: string, body: Partial<Cart>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
