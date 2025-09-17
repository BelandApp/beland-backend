import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { CreateOrderByCartDto } from './dto/create-order-cart.dto';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { PaymentType } from 'src/payment-types/entities/payment-type.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { TransactionState } from 'src/transaction-state/entities/transaction-state.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { TransactionType } from 'src/transaction-type/entities/transaction-type.entity';
import { TransactionCode } from 'src/transactions/enum/transaction-code';
import { SuperadminConfigService } from 'src/superadmin-config/superadmin-config.service';
import { StatusCode } from 'src/transaction-state/enum/status.enum';
import { PaymentTypeCode } from 'src/payment-types/enum/payment-type.enum';

@Injectable()
export class OrdersService {
  private readonly completeMessage = 'la orden';

  constructor(
    private readonly repository: OrdersRepository,
    private readonly superadminService: SuperadminConfigService,
    private readonly dataSource: DataSource

  ) {}

   async findAll(
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Order[], number]> {
    try {
      const response = await this.repository.findAll(
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllUser(
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Order[], number]> {
    try {
      const response = await this.repository.findAllUser(
        user_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllPending(
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Order[], number]> {
    try {
      const status = await this.dataSource.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.PENDING);
      const response = await this.repository.findAllPending(
        status.id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Order>): Promise<Order> {
    try {
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createOrderByCart(cart_id:string, userId:string): Promise<Order> {
    // 0) Preparar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // opcional: pasar aislamiento

    try {
      // 1) Traer wallet (evita condiciones de carrera al descontar saldo)
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: userId },
      });
      if (!wallet) throw new NotFoundException('Wallet no encontrada');

      // 2) Traer el carrito con sus ítems
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { id: cart_id },
        relations: {items:true}
      });
      if (!cart) throw new NotFoundException('Carrito no encontrado');
      if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('El carrito no tiene ítems');
      }

      // (opcional recomendado) Validar que el carrito pertenezca al mismo usuario de la wallet
       if (cart.user_id !== wallet.user_id) throw new BadRequestException('Carrito no pertenece al usuario de la wallet');

      // 3) Validar forma de pago
      let paymentType: PaymentType;
      if (!cart.group_id) {
        paymentType = await queryRunner.manager.findOne(PaymentType, {
          where: { code: PaymentTypeCode.FULL },
        });
      } else {
        paymentType = await queryRunner.manager.findOne(PaymentType, {
          where: { id: cart.payment_type_id },
        });
      }
      
      if (!paymentType) {
        throw new ConflictException('Forma de pago no disponible. Pruebe otra o intente luego.');
      }

      // HASTA ACA TODO EN CONDICIONES PARA HACER LA TRANSACCION

      // 5) Crear la orden desde el carrito (copiando campos necesarios)
      // busco el status id
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.PENDING);

      //    - Tomamos algunos campos del carrito y seteamos leader_id = user_id
      const { id: _cartId, user_id, created_at: _c1, updated_at: _c2, items: _items, payment_type_id, payment_type, ...createOrder } = cart as any;
      const order = queryRunner.manager.create(Order, {
        ...createOrder,
        payment_type_id: paymentType.id,
        user_id,
        status_id: status.id,
      });
      const savedOrder = await queryRunner.manager.save(Order, order);
      if (!savedOrder) {
        throw new ConflictException('No se pudo crear la orden');
      }

      // 6) Crear ítems de la orden a partir de los ítems del carrito
      const orderItemsPayload = (cart.items as CartItem[]).map(({ id, created_at, cart_id, ...rest }) => ({
        ...rest,
        order_id: savedOrder.id,
      }));

      const orderItems = queryRunner.manager.create(OrderItem, orderItemsPayload);
      const itemsCreated = await queryRunner.manager.save(OrderItem, orderItems);
      if (!itemsCreated || itemsCreated.length === 0) {
        throw new ConflictException('No se pudieron crear los ítems asociados a la orden');
      }

      // QUITAR ESTO CUANDO ESTEN TODAS LAS FORMAS DE PAGO DISPONIBLES COMPROBANDO SI ES A UN GRUPO
      const cartTotal = Number(cart.total_becoin);
      switch (paymentType.code) {
        case 'FULL':
          // 4) Validar saldo suficiente (y normalizar a número)
            const currentBalance = Number(wallet.becoin_balance);
            if (currentBalance < cartTotal) {
              throw new NotAcceptableException('Saldo insuficiente. Recarga primero tu Billetera');
            }
          // 7) Descontar saldo, bloquearlo y guardar wallet
            wallet.becoin_balance = +currentBalance - +cartTotal;
            wallet.locked_balance = +wallet.locked_balance + +cartTotal;
            await queryRunner.manager.save(Wallet, wallet);

          // 10) Registrar pago de la orden
            const payment = queryRunner.manager.create(Payment, {
              amount_paid: savedOrder.total_becoin,
              order_id: savedOrder.id,
              payment_type_id: savedOrder.payment_type_id,
              user_id: savedOrder.user_id,
              status_id:status.id,
            });
            await queryRunner.manager.save(Payment, payment);
            
          break;

        case 'EQUAL_SPLIT':
          const arrayWallets = await queryRunner.manager.findAndCount(Wallet, {
            where: {user: {group_memberships: {group_id : cart.group_id}}},
            relations: {user:true}
          });

          if (!arrayWallets || arrayWallets[1] === 0) 
            throw new NotFoundException('Grupo inexistente o Sin miembros. Use Forma de pago FULL o Asegurese de que el grupo exista o tenga miembros.')
          
          const amountSplit = cartTotal / wallet[1];
          const wallets: Wallet[] = arrayWallets[0]
          
          wallets.forEach ( async (wallet) => {

            // 4) Validar saldo suficiente (y normalizar a número)
              const currentBalance = Number(wallet.becoin_balance);
              if (currentBalance < amountSplit) {
                throw new NotAcceptableException(`Saldo insuficiente en Wallet de usuario ${wallet.user.full_name ?? wallet.user.email}. Avisa que recargue su Billetera`);
              }

            // 7) Descontar saldo, bloquearlo y guardar wallet
              wallet.becoin_balance = +currentBalance - +amountSplit;
              wallet.locked_balance = +wallet.locked_balance + +amountSplit;
              await queryRunner.manager.save(Wallet, wallet);

            // 10) Registrar pago de la orden
              const payment = queryRunner.manager.create(Payment, {
                amount_paid: amountSplit,
                order_id: savedOrder.id,
                payment_type_id: savedOrder.payment_type_id,
                user_id: wallet.user_id,
                status_id:status.id,
              });
              await queryRunner.manager.save(Payment, payment);
          });
          break;

        case 'SPLIT':
          throw new BadRequestException('La forma de pago SPLIT no está disponible por el momento');

        default:
          throw new BadRequestException('La forma de pago no existe');
      }

       // 11) Resetear el carrito
      cart.address_id = null;
      cart.group_id = null;
      cart.payment_type_id = null;
      cart.total_amount = 0;
      cart.total_items = 0;
      cart.total_becoin = 0;

      await queryRunner.manager.save(Cart, cart);
      await queryRunner.manager.delete(CartItem, {cart_id : cart.id})

      // 12) Confirmar transacción
      await queryRunner.commitTransaction();

      // 13) Devolver la orden creada (podés cargar relaciones si querés)
      return savedOrder;
    } catch (err) {
      // Revertir todo si falla algo
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Liberar recursos
      await queryRunner.release();
    }
  }

  async confrimed (order_id: string, delivered: boolean): Promise<Order> {
    // 0) Preparar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // opcional: pasar aislamiento

    try {
      // 1) Actualizo la confirmacion del estado a entregado
      if (delivered) {await queryRunner.manager.update(Order, {id: order_id}, {confirmSend:true})}
      else {await queryRunner.manager.update(Order, {id: order_id}, {confirmReceived:true})}

      // 2) Busco la orden.
      const order = await queryRunner.manager.findOne(Order, {
        where: {id:order_id}, 
        relations: {payment_type:true}
      })
      if (!order) throw new NotFoundException('La orden de compra no existe')

      // 3) Busco la wallet del usuario que genero la orden
      const wallet = await queryRunner.manager.findOne(Wallet, {where: {user_id: order.user_id}})
      if (!wallet) throw new NotFoundException('La wallet del usuario no existe')
      
      // 4) busco el estado correspondiente para actualiar la orden y el payment
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.COMPLETED);

      // 5) Si esta todo OK hago la transferencia
      if (order.confirmSend && order.confirmReceived && order.payment_type.code === "FULL") {
        await this.transferOrder (
          queryRunner,
          order,
          status
        )

        // 6) actualizo la orden
        order.status = status;
        await queryRunner.manager.save(Order, order);

      }

      return order
    } catch (err) {
      // Revertir todo si falla algo
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Liberar recursos
      await queryRunner.release();
    }
  }

  async transferOrder (queryRunner: QueryRunner, order:Order,status: TransactionState ): Promise<void> {
    // 8) Traer tipo y estado de transacción (correcto: TransactionType y TransactionState)
      const txType = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.PURCHASE_BELAND },
      });
      if (!txType) throw new ConflictException(`No se encuentra el tipo ${TransactionCode.PURCHASE_BELAND}`);

      const txTypeSale = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.SALE_BELAND },
      });
      if (!txTypeSale) throw new ConflictException(`No se encuentra el tipo ${TransactionCode.SALE_BELAND}`);

      const payments: Payment[] = await queryRunner.manager.find(Payment, {
        where: {order_id: order.id},
        relations: {user: {wallet:true}}
      })

      payments.forEach ( async (payment) => {
        // 8 BIS) Libero los fondos de la billetera del usuario
        const wallet = payment.user.wallet;
        wallet.locked_balance = +wallet.locked_balance - +payment.amount_paid
        await queryRunner.manager.save(Wallet, wallet);

        // 9) Registrar transacción (post_balance debe reflejar el saldo luego del descuento)
        const txPurchase = queryRunner.manager.create(Transaction, {
          wallet_id: wallet.id,
          type_id: txType.id,
          status_id: status.id,
          amount_becoin: +payment.amount_paid,
          post_balance: wallet.becoin_balance,
          reference: `PURCHASEBELAND-${order.id}`,
        });
        const txPurchaseSaved = await queryRunner.manager.save(Transaction, txPurchase);

        payment.status = status;
        payment.transaction_id = txPurchase.id
        await queryRunner.manager.save(Payment, payment)

      })

      // 9 Bis) aca deberia incrementar el saldo del wallet SuperAdmin, registrar tambien la transaccion, y generar una nueva tabla para enviar los pedidos para generar el envio.
      const walletSuperadmin = await queryRunner.manager.findOne(Wallet, {
        where: { id: this.superadminService.getWalletId() },
      });
      if (!walletSuperadmin) throw new NotFoundException('Wallet del Super Admin no encontrada');
      
      walletSuperadmin.becoin_balance = +walletSuperadmin.becoin_balance + +order.total_becoin;
      await queryRunner.manager.save(Wallet, walletSuperadmin);

      const txSale = queryRunner.manager.create(Transaction, {
        wallet_id: walletSuperadmin.id,
        type_id: txTypeSale.id,
        status_id: status.id,
        amount_becoin: +order.total_becoin,
        post_balance: +walletSuperadmin.becoin_balance,
        reference: `SALEBELAND-${order.id}`,
      });
      await queryRunner.manager.save(Transaction, txSale);
  }
}
