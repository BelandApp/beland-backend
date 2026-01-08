import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, IsNull, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { NotFoundException } from '@zxing/library';
import { Cart } from '../cart/entities/cart.entity';
import { Group } from '../groups/entities/group.entity';
import { PaymentTypeCode } from '../payment-types/enum/payment-type.enum';

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

  async findAllUserOrGeneral(
    cart_id: string,
    user_id: string,
    page = 1,
    limit = 10,
  ): Promise<[CartItem[], number]> {

    const where: any = {};

    if (cart_id) {
      where.cart_id = cart_id;
    }

    if (user_id) {
      where.user_id = user_id;
    } else {
      where.user_id = IsNull();
    }

    return this.repository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: { product: true },
    });
  }

  async findOne(id: string): Promise<CartItem> {
    return this.repository.findOne({
      where: { id },
      relations: {product:true},
    });
  }

  async findByProduct(product_id: string, cart_id: string): Promise<CartItem> {
    return await this.repository.findOne({
      where: { cart_id, product_id },
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
      body.total_weight = +product.weight * +body.quantity;
      const itemSave = await this.repository.save(body);
      if (itemSave) {
        await this.calculateCuote(itemSave.cart_id);
      } 
      return itemSave
    }
    const quantity = +item.quantity + +body.quantity;
    item.quantity = +quantity;
    item.total_price = +item.unit_price * +quantity
    item.total_becoin = +item.unit_becoin * +quantity
    item.total_weight = +item.unit_weight * +quantity
    const itemSave = await this.repository.save(item);
    if (itemSave) {
      await this.calculateCuote(itemSave.cart_id);
    } 
    return itemSave
  }

  async save(body: Partial<CartItem>): Promise<CartItem> {
    const itemSave = await this.repository.save(body);
    if (itemSave) this.calculateCuote(itemSave.cart_id)
    return itemSave
  }  

  async remove(id: string): Promise<DeleteResult> {
    
    return await this.repository.delete(id);
  }

  async calculateCuote(cart_id: string): Promise<{success: boolean}> {
    try {
    const cart = await this.dataSource.manager.findOne(Cart, {
      where: {id: cart_id},
      relations: {items:true, payment_type:true, group: {members:true}}
    })

    const group = cart.group;
    if (!group) return;

    const members = group.members;
    const balances = new Map<string, number>();

    // Inicializar balances
    for (const member of members) {
      balances.set(member.user_id, 0);
    }

    const items = cart.items ?? [];
    const paymentType = cart.payment_type?.code as PaymentTypeCode;

    // 1️⃣ Items personales (TODOS los payment types)
    for (const item of items) {
      if (item.user_id) {
        balances.set(
          item.user_id,
          (balances.get(item.user_id) ?? 0) + Number(item.total_price),
        );
      }
    }

    // 2️⃣ Items compartidos
    const sharedItemsTotal = items
      .filter(i => !i.user_id)
      .reduce((sum, i) => sum + Number(i.total_price), 0);

    const delivery = Number(cart.delivery_cost ?? 0);

    if (paymentType === PaymentTypeCode.FULL) {
      // 👉 todo lo compartido lo paga el creador
      const creatorId = group.user_id;
      balances.set(
        creatorId,
        (balances.get(creatorId) ?? 0) + sharedItemsTotal + delivery,
      );
    }

    if (paymentType === PaymentTypeCode.EQUAL_SPLIT) {
      const totalShared = sharedItemsTotal + delivery;
      const perMember = totalShared / members.length;

      for (const member of members) {
        balances.set(
          member.user_id,
          (balances.get(member.user_id) ?? 0) + perMember,
        );
      }
    }

    // SPLIT → no hay items compartidos, no se hace nada

    // 3️⃣ Persistir balances
    for (const member of members) {
      member.pendingAmount = Number(
        (balances.get(member.user_id) ?? 0).toFixed(2),
      );
    }

    await this.dataSource.manager.save(members);

    return {success:true}
  } catch (error) {
    throw new ConflictException('no se pudo recalcular la cuota ', error)
  }
  }
}
