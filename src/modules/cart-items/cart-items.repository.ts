import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, IsNull, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { NotFoundException } from '@zxing/library';
import { Cart } from '../cart/entities/cart.entity';
import { Group } from '../groups/entities/group.entity';
import { PaymentTypeCode } from '../payment-types/enum/payment-type.enum';
import { GroupMember } from '../group-members/entities/group-member.entity';

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

  async findByProduct(
    product_id: string,
    cart_id: string,
    user_id?: string | null,
  ): Promise<CartItem | null> {

    const qb = this.repository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.cart', 'cart')
      .where('item.cart_id = :cart_id', { cart_id })
      .andWhere('item.product_id = :product_id', { product_id });

    if (user_id) {
      qb.andWhere('item.user_id = :user_id', { user_id });
    } else {
      qb.andWhere('item.user_id IS NULL');
    }

    return qb.getOne();
  }

  async create(body: Partial<CartItem>): Promise<CartItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscar si el producto ya existe en el carrito
      // Importante usar el manager del queryRunner para estar dentro de la transacción
      const item = await queryRunner.manager
        .createQueryBuilder(CartItem, 'item')
        .where('item.cart_id = :cartId', { cartId: body.cart_id })
        .andWhere('item.product_id = :productId', { productId: body.product_id })
        .andWhere(
          body.user_id
            ? 'item.user_id = :userId'
            : 'item.user_id IS NULL',
          body.user_id ? { userId: body.user_id } : {}
        )
        .getOne();

      let itemSave: CartItem;
      console.log("llegamos hasta aca 1");
      if (!item) {
        // 2. Si no existe, buscamos el producto para obtener precios y pesos
        console.log("llegamos hasta aca 2");
        const product = await queryRunner.manager.findOneBy(Product, { id: body.product_id });
        if (!product) throw new NotFoundException('Producto no encontrado');

        // Crear nueva instancia de CartItem
        const newItem = queryRunner.manager.create(CartItem, {
          ...body,
          unit_price: +product.price,
          unit_becoin: +product.price_becoin,
          unit_weight: +product.weight, // Asumiendo que existe este campo
          total_price: +product.price * +body.quantity,
          total_becoin: +product.price_becoin * +body.quantity,
          total_weight: +product.weight * +body.quantity,
        });

        itemSave = await queryRunner.manager.save(newItem);
        console.log("llegamos hasta aca 3");
      } else {
        // 3. Si ya existe, actualizamos cantidades y totales
        console.log("llegamos hasta aca 4");
        const newQuantity = +item.quantity + +body.quantity;
        
        item.quantity = newQuantity;
        item.total_price = +item.unit_price * newQuantity;
        item.total_becoin = +item.unit_becoin * newQuantity;
        item.total_weight = +item.unit_weight * newQuantity;

        itemSave = await queryRunner.manager.save(item);
        console.log("llegamos hasta aca 5");
      }

      // 4. Recalcular balances usando las funciones obligatorias con el queryRunner
      // Usamos itemSave.cart_id para asegurar que tenemos el ID correcto
      if (itemSave.user_id) {
        // Caso Personal: Solo afecta a este usuario
        console.log("llegamos hasta aca 6");
        await this.recalculateUserPersonalBalance(itemSave.cart_id, itemSave.user_id, queryRunner);
        console.log("llegamos hasta aca 7");
      } else {
        // Caso General: Afecta a todos (Shared Items)
        console.log("llegamos hasta aca 8");
        await this.recalculateSharedBalances(itemSave.cart_id, queryRunner);
        console.log("llegamos hasta aca 9");
      }

      // Si todo salió bien, confirmamos la transacción
      await queryRunner.commitTransaction();
      console.log("llegamos hasta aca 10");
      return itemSave;

    } catch (error) {
      // Si algo falla, revertimos todos los cambios (el item no se crea y el balance no se toca)
      await queryRunner.rollbackTransaction();
      console.error("error: ", JSON.stringify(error))
      throw new ConflictException('No se pudo procesar la creación del item', JSON.stringify(error));
    } finally {
      // Siempre liberamos el queryRunner
      await queryRunner.release();
    }
  }

  async save(body: Partial<CartItem>): Promise<CartItem> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Guardar el ítem (TypeORM manejará INSERT o UPDATE según si existe el ID)
      // Usamos el manager de la transacción para asegurar atomicidad
      const itemSave = await queryRunner.manager.save(CartItem, body);

      // 2. Determinar qué balance recalcular
      if (itemSave.user_id) {
        // Si el ítem tiene dueño, solo actualizamos el monto personal de ese usuario
        await this.recalculateUserPersonalBalance(
          itemSave.cart_id,
          itemSave.user_id,
          queryRunner,
        );
      } else {
        // Si es un ítem general (sin user_id), recalculamos el reparto para todos
        await this.recalculateSharedBalances(itemSave.cart_id, queryRunner);
      }

      // 3. Confirmar los cambios en la base de datos
      await queryRunner.commitTransaction();
      
      return itemSave;
    } catch (error) {
      // Si algo falla, revertimos tanto el guardado del ítem como los balances
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Error al guardar el ítem y actualizar balances',
        error,
      );
    } finally {
      // Liberar siempre el queryRunner
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<DeleteResult> { 
    return await this.repository.delete(id);
  }

async recalculateSharedBalances(cartId: string, queryRunner: QueryRunner): Promise<void> {
  console.log('🛒 recalculating balances for cart:', cartId);

  const cart = await queryRunner.manager.findOne(Cart, {
    where: { id: cartId },
    relations: { 
      items: true, 
      group: { members: true, payment_type:true }
    },
  });

  if (!cart) {
    console.log('❌ Cart not found');
    return;
  }

  if (!cart.group) {
    console.log('❌ Cart has no group');
    return;
  }

  const { items, group, delivery_cost } = cart;

  console.log('📦 Items:', items);
  console.log('👥 Group members:', group.members);
  console.log('🚚 Delivery cost:', delivery_cost);
  console.log('💳 Payment type:', group.payment_type);

  const paymentTypeCode = group.payment_type?.code as PaymentTypeCode;
  const members = group.members;
  const delivery = Number(delivery_cost ?? 0);

  console.log('🔢 PaymentTypeCode:', paymentTypeCode);
  console.log('👤 Members count:', members.length);
  console.log('🚚 Delivery numeric:', delivery);

  // Items compartidos (sin user)
  const sharedItems = items.filter((i) => !i.user_id);

  console.log('📦 Shared items (user_id null):', sharedItems);

  const sharedItemsTotal = sharedItems.reduce((sum, i) => {
    console.log(
      '➕ item:',
      i.id,
      'total_becoin:',
      i.total_becoin,
      'numeric:',
      Number(i.total_becoin)
    );
    return sum + Number(i.total_becoin);
  }, 0);

  console.log('💰 Shared items total:', sharedItemsTotal);

  const sharedTotal = sharedItemsTotal + delivery;

  console.log('💰💰 FINAL sharedTotal:', sharedTotal);

  for (const member of members) {
    let groupAmount = 0;

    if (paymentTypeCode === PaymentTypeCode.FULL) {
      groupAmount = (member.user_id === group.user_id) ? sharedTotal : 0;
    } 
    else if (paymentTypeCode === PaymentTypeCode.EQUAL_SPLIT) {
      groupAmount = members.length > 0
        ? sharedTotal / members.length
        : 0;
    }

    console.log(
      '👤 Member:',
      member.user_id,
      'groupAmount:',
      groupAmount
    );

    await queryRunner.manager.update(
      GroupMember,
      { id: member.id },
      { pending_amount_group: Number(groupAmount.toFixed(2)) }
    );
  }

  console.log('✅ Recalculation finished');
}


  async recalculateUserPersonalBalance(cartId: string, memberId: string, queryRunner: QueryRunner ): Promise<void> {
    // 1. Obtener el total de items personales de ese usuario en este carrito
    const groupMember = await queryRunner.manager.findOne(GroupMember, {
      where: { group: {cart: {id: cartId}}, user_id: memberId },
      relations: { group: {cart: {items:true}}},
    });

    const cart = groupMember.group.cart;

    if (!cart) return;

    const personalTotal = cart.items
      .filter((i) => i.user_id === memberId)
      .reduce((sum, i) => sum + Number(i.total_becoin), 0);

    // 2. Actualizar solo la columna personal del miembro correspondiente
    await queryRunner.manager.update(
      GroupMember,
      { id: groupMember.id },
      { pending_amount_personal: Number(personalTotal.toFixed(2)) }
    );
  }
}
