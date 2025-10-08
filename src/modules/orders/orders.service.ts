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
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionCode } from 'src/modules/transactions/enum/transaction-code';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';
import { PaymentTypeCode } from 'src/modules/payment-types/enum/payment-type.enum';
import { DeliveryStatus } from '../delivery-status/entities/delivery-status.entity';
import { DeliveryStatusCode } from '../delivery-status/enums/delivery-status.enum';
import { AmountToPaymentsRepository } from '../amount-to-payment/amount-to-payment.repository';

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
      // a) busco el status id del payment
      const statusPayment = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });
      if (!statusPayment)
        throw new ConflictException("No se encuentra el estado de pago ", StatusCode.PENDING);

      // b) busco el type id de las transacciones PURCHASE_BELAND
      const typeTrans = await queryRunner.manager.findOne(TransactionState, {
        where: { code: TransactionCode.PURCHASE_BELAND },
      });
      if (!typeTrans)
        throw new ConflictException("No se encuentra el tipo de transaccion ", TransactionCode.PURCHASE_BELAND );

      // c) busco el status id del delivery order
      const statusOrder = await queryRunner.manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.PENDING },
      });
      if (!statusOrder)
        throw new ConflictException("No se encuentra el estado de la orden ", DeliveryStatusCode.PENDING);

      //    - Tomamos algunos campos del carrito y seteamos leader_id = user_id

      const { id: _cartId, created_at: _c1, updated_at: _c2, items: _items, payment_type_id, payment_type, address, total_amount, total_becoin, ...createOrder } = cart as Cart;
      const order = queryRunner.manager.create(Order, {
        ...createOrder,
        subtotal_amount: +total_amount,
        subtotal_becoin: +total_becoin,
        total_amount: +total_amount + +this.superadminService.getPriceDelivery(),
        total_becoin: +total_becoin + (+this.superadminService.getPriceDelivery()/+this.superadminService.getPriceOneBecoin()),
        price_delivery: +this.superadminService.getPriceDelivery(),
        payment_type_id: paymentType.id,
        status_id: statusOrder.id,
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
      const cartTotal = Number(cart.total_becoin) + (+this.superadminService.getPriceDelivery()/+this.superadminService.getPriceOneBecoin());
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

          // 8) Crear la transaccion con estado pendiente
          const transaction = queryRunner.manager.create(Transaction, {
            wallet_id: wallet.id,
            type_id: typeTrans.id,
            status_id: statusPayment.id,
            amount_becoin: savedOrder.total_becoin,
            post_balance: wallet.becoin_balance,
            reference: `ORDER- ${savedOrder.id}`
          });
          await queryRunner.manager.save(transaction);

          // 10) Registrar pago de la orden
          const payment = queryRunner.manager.create(Payment, {
            amount_paid: savedOrder.total_becoin,
            order_id: savedOrder.id,
            payment_type_id: savedOrder.payment_type_id,
            user_id: savedOrder.user_id,
            status_id: statusPayment.id,
          });
          await queryRunner.manager.save(Payment, payment);

          break;

        case 'EQUAL_SPLIT':

          throw new BadRequestException('La forma de pago EQUAL_SPLIT no está disponible por el momento');
          // const arrayWallets = await queryRunner.manager.findAndCount(Wallet, {
          //   where: {user: {group_memberships: {group_id : cart.group_id}}},
          //   relations: {user:true}
          // });

          // if (!arrayWallets || arrayWallets[1] === 0) 
          //   throw new NotFoundException('Grupo inexistente o Sin miembros. Use Forma de pago FULL o Asegurese de que el grupo exista o tenga miembros.')
          
          // const amountSplit = cartTotal / wallet[1];
          // const wallets: Wallet[] = arrayWallets[0]
          
          // wallets.forEach ( async (wallet) => {

          //   // 4) Validar saldo suficiente (y normalizar a número)
          //     const currentBalance = Number(wallet.becoin_balance);
          //     if (currentBalance < amountSplit) {
          //       throw new NotAcceptableException(`Saldo insuficiente en Wallet de usuario ${wallet.user.full_name ?? wallet.user.email}. Avisa que recargue su Billetera`);
          //     }

          //   // 7) Descontar saldo, bloquearlo y guardar wallet
          //     wallet.becoin_balance = +currentBalance - +amountSplit;
          //     wallet.locked_balance = +wallet.locked_balance + +amountSplit;
          //     await queryRunner.manager.save(Wallet, wallet);

          //   // 10) Registrar pago de la orden
          //     const payment = queryRunner.manager.create(Payment, {
          //       amount_paid: amountSplit,
          //       order_id: savedOrder.id,
          //       payment_type_id: savedOrder.payment_type_id,
          //       user_id: wallet.user_id,
          //       status_id:status.id,
          //     });
          //     await queryRunner.manager.save(Payment, payment);

          // });
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

  async preparing (order_id: string): Promise<Order> {
    const statusOrder = await this.dataSource.manager.findOne(DeliveryStatus, {
      where: {code: DeliveryStatusCode.PREPARING}
    })
    if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.PREPARING)

    const order = await this.repository.findOne(order_id);
    if (!order) throw new NotFoundException('Orden no encontrada')

    order.status_id = statusOrder.id;
    
    return await this.repository.create(order);
  }

  async onRoute (order_id: string): Promise<Order> {
    const statusOrder = await this.dataSource.manager.findOne(DeliveryStatus, {
      where: {code: DeliveryStatusCode.ON_ROUTE}
    })
    if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.ON_ROUTE)

    const order = await this.repository.findOne(order_id);
    if (!order) throw new NotFoundException('Orden no encontrada')

    order.status_id = statusOrder.id;
    
    return await this.repository.create(order);
  }

  async delivered (order_id: string, code: number): Promise<Order> {
    // 0) Preparar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // opcional: pasar aislamiento

    try {
      // 1) Busco el estado de la orden DELIVERED/Entregado para actualizar la orden
      const statusOrder = await queryRunner.manager.findOne(DeliveryStatus, {
        where: {code: DeliveryStatusCode.DELIVERED}
      })
      if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.DELIVERED)

      // 2) Busco la orden a actualizar y actualizo su status a entregado
      const order = await this.repository.findOne(order_id);
      if (!order) throw new NotFoundException('Orden no encontrada')

      // 2 BIS) PROVISORIO esto esta porque solo esta realizada el pago FULL. 
      // Implementar los otros pagos
      if (order.payment_type.code !== PaymentTypeCode.FULL) throw new BadRequestException('Forma de Pago no habilitadas todavia')
      
      // 3) Verifico que codigo de orden sea correcto para realizar el cobro
      if (order.code !== code) throw new BadRequestException('Codigo de orden equivocado')
    
      order.status_id = statusOrder.id;
      const savedOrder = await queryRunner.manager.save(order)

      // 4) Busco la solicitud de pago para confirmar su estado a COMPLETED
      const payment = await queryRunner.manager.findOne (Payment, {
        where: {order_id: order.id}
      })
      // 4 BIS) Busco el estado COMPLETED para poder actualizar el payment y la transaction
      const statusPayment = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.COMPLETED}
      })

      payment.status_id = statusPayment.id;
      await queryRunner.manager.save(payment);

      // 5) Busco la wallet del usuario para descontar el saldo bloqueado definitivamente
      const wallet = await queryRunner.manager.findOne (Wallet, {
        where: {user_id: payment.user_id}
      })
      if (!wallet) throw new NotFoundException('Billetera de usuario no encotrada')

      wallet.locked_balance = +wallet.locked_balance - +payment.amount_paid;
      queryRunner.manager.save(wallet)

      // 6) Actualizo el estado de la transaccion a completada
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: payment.transaction_id}
      })
      transaction.status_id = statusPayment.id;
      queryRunner.manager.save(transaction);

      // 7) Buscar la wallet del superAdmin y acreditar el saldo.
      const walletAdmin = await queryRunner.manager.findOne(Wallet, {
        where: {id: this.superadminService.getWalletId()}
      })

      walletAdmin.becoin_balance = +walletAdmin.becoin_balance + +savedOrder.total_becoin
      await queryRunner.manager.save(walletAdmin);

      // 8) Buscar el tipo de transaccion SALE_BELAND
      const type = await queryRunner.manager.findOne(TransactionType, {
        where: {code: TransactionCode.SALE_BELAND}
      })
      if (!type) throw new NotFoundException ('No se encuentra el tipo de transaccion ', TransactionCode.SALE_BELAND)
      
      // 9) Crear la transaccion para el super Admin
      await queryRunner.manager.save(Transaction, {
        wallet_id: walletAdmin.id,
        type_id: type.id,
        status_id: statusPayment.id,
        amount_becoin: savedOrder.total_becoin,
        post_balance: walletAdmin.becoin_balance,
        reference: `ORDER- ${savedOrder.id}`
      })

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

  async cancelled (order_id: string, observation:string): Promise<Order> {
    // 0) Preparar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // opcional: pasar aislamiento

    try {
      // 1) Busco el estado de la orden CANCELLED/cancelado para actualizar la orden
      const statusOrder = await queryRunner.manager.findOne(DeliveryStatus, {
        where: {code: DeliveryStatusCode.CANCELLED}
      })
      if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.CANCELLED)

      // 2) Busco la orden a actualizar y actualizo su status a entregado
      const order = await this.repository.findOne(order_id);
      if (!order) throw new NotFoundException('Orden no encontrada')

      // 2 BIS) PROVISORIO esto esta porque solo esta realizada el pago FULL. 
      // Implementar los otros pagos
      if (order.payment_type.code !== PaymentTypeCode.FULL) throw new BadRequestException('Forma de Pago no habilitadas todavia')
    
      order.status_id = statusOrder.id;
      order.observation = observation;
      const savedOrder = await queryRunner.manager.save(order)

      // 4) Busco la solicitud de pago para confirmar su estado a FAILED
      const payment = await queryRunner.manager.findOne (Payment, {
        where: {order_id: order.id}
      })
      // 4 BIS) Busco el estado FAILED para poder actualizar el payment y la transaction
      const statusPayment = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.FAILED}
      })

      payment.status_id = statusPayment.id;
      await queryRunner.manager.save(payment);

      // 5) Busco la wallet del usuario para descontar el saldo bloqueado definitivamente
      const wallet = await queryRunner.manager.findOne (Wallet, {
        where: {user_id: payment.user_id}
      })
      if (!wallet) throw new NotFoundException('Billetera de usuario no encotrada')

      wallet.becoin_balance = +wallet.becoin_balance + +payment.amount_paid;
      wallet.locked_balance = +wallet.locked_balance - +payment.amount_paid;
      queryRunner.manager.save(wallet)

      // 6) Actualizo el estado de la transaccion a completada
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: payment.transaction_id}
      })
      transaction.status_id = statusPayment.id;
      transaction.post_balance = +wallet.becoin_balance;
      queryRunner.manager.save(transaction);

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
        // wallet.locked_balance = +wallet.locked_balance - +payment.amount_paid
        // await queryRunner.manager.save(Wallet, wallet);

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
