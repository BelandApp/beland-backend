import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { DataSource, Not, QueryRunner } from 'typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';
import { PaymentTypeCode } from 'src/modules/payment-types/enum/payment-type.enum';
import { DeliveryStatus } from '../delivery-status/entities/delivery-status.entity';
import { DeliveryStatusCode } from '../delivery-status/enums/delivery-status.enum';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { OrderFilterDto } from './dto/order-filter.dto';

@Injectable()
export class OrdersService {
  private readonly completeMessage = 'la orden';

  private generateRandomCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const bytes = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const index = bytes[i] % chars.length;
      code += chars[index];
    }

    return code;
  }

  constructor(
    private readonly repository: OrdersRepository,
    private readonly superadminService: SuperadminConfigService,
    private readonly dataSource: DataSource,
    private readonly notificationsGateway: NotificationsGateway,

  ) {}

  async generateUniqueCode(): Promise<string> {
    let code = this.generateRandomCode();

    const exists = await this.dataSource.manager.findOne(Order, {
      where: { recycled_code: code },
    });

    if (exists) {
      return this.generateUniqueCode(); // recursion hasta que salga único
    }

    return code;
  }

  async findAll(filters: OrderFilterDto): Promise<[Order[], number]> {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las órdenes');
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
      // 1) Traer wallet del usuario
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: userId },
      });
      if (!wallet) throw new NotFoundException('Wallet no encontrada');

      // 2) Traer el carrito con sus ítems
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { id: cart_id },
        relations: {items:true, group:true}
      });
      if (!cart) throw new NotFoundException('Carrito no encontrado');

      if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('El carrito esta vacio');
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
          where: { id: cart.group.payment_type_id },
        });
      }
      
      if (!paymentType) {
        throw new ConflictException('Forma de pago no disponible. Pruebe otra o intente luego.');
      }

      // HASTA ACA TODO EN CONDICIONES PARA HACER LA TRANSACCION

      // 5) Crear la orden desde el carrito (copiando campos necesarios)
      // a) busco el status id del payment
      const statusTransaction = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });
      if (!statusTransaction)
        throw new ConflictException("No se encuentra el estado de transaccion ", StatusCode.PENDING);

      // b) busco el type id de las transacciones PURCHASE_BELAND
      const typeTrans = await queryRunner.manager.findOne(TransactionType, {
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

      //    - Tomamos algunos campos del carrito

      const { id: _cartId, created_at: _c1, updated_at: _c2, items: _items, user_id, payment_type_id, payment_type, address, total_amount, total_becoin, ...createOrder } = cart as Cart;
      const order = queryRunner.manager.create(Order, {
        ...createOrder,
        user_id,
        subtotal_amount: +total_amount,
        subtotal_becoin: +total_becoin,
        total_amount: +total_amount + +createOrder.delivery_cost,
        total_becoin: +total_becoin + (+createOrder.delivery_cost/+this.superadminService.getPriceOneBecoin()),
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
        ordered_quantity: rest.quantity,
        order_id: savedOrder.id,
      }));

      const orderItems = queryRunner.manager.create(OrderItem, orderItemsPayload);
      const itemsCreated = await queryRunner.manager.save(OrderItem, orderItems);
      if (!itemsCreated || itemsCreated.length === 0) {
        throw new ConflictException('No se pudieron crear los ítems asociados a la orden');
      }

      // Retener saldo segun la forma de pago
      const cartTotal = Number(cart.total_becoin) + (+createOrder.delivery_cost/+this.superadminService.getPriceOneBecoin());
      switch (paymentType.code) {
        case 'SPLIT':
        case 'FULL':

          const currentBalance = Number(wallet.becoin_balance);
          if (currentBalance < cartTotal) {
            throw new NotAcceptableException(
              'Saldo insuficiente. Para esta forma de pago se requiere cubrir el total de la orden',
            );
          }

          // Retener todo al creador
          wallet.becoin_balance = +currentBalance - +cartTotal;
          wallet.locked_balance = +wallet.locked_balance + +cartTotal;
          await queryRunner.manager.save(Wallet, wallet);

          // Crear transacción pendiente
          const transaction = queryRunner.manager.create(Transaction, {
            wallet_id: wallet.id,
            type_id: typeTrans.id,
            status_id: statusTransaction.id,
            amount_becoin: savedOrder.total_becoin,
            post_balance: wallet.becoin_balance,
            reference: `ORDER- ${savedOrder.id}`,
          });
          await queryRunner.manager.save(Transaction, transaction);

          break;

        case 'EQUAL_SPLIT': {
          // 1️⃣ Obtener wallets de todos los miembros del grupo
          const [wallets, membersCount] = await queryRunner.manager.findAndCount(Wallet, {
            where: {
              user: {
                group_memberships: {
                  group_id: cart.group_id,
                },
              },
            },
            relations: { user: true },
          });

          if (!wallets || membersCount === 0) {
            throw new NotFoundException(
              'Grupo inexistente o sin miembros. Use FULL o asegúrese de que el grupo tenga miembros.',
            );
          }

          // 2️⃣ Calcular monto a retener por usuario
          const amountSplit =
            Number(cartTotal) / Number(membersCount);

          // (opcional pero recomendable) redondeo defensivo
          const splitAmount = Number(amountSplit.toFixed(2));

          // 3️⃣ Retener saldo, crear transacciones y payments por cada miembro
          for (const memberWallet of wallets) {

            const currentBalance = Number(memberWallet.becoin_balance);

            if (currentBalance < splitAmount) {
              throw new NotAcceptableException(
                `Saldo insuficiente en la billetera de ${
                  memberWallet.user.full_name ?? memberWallet.user.email
                }`,
              );
            }

            // 🔒 Retener saldo
            memberWallet.becoin_balance = currentBalance - splitAmount;
            memberWallet.locked_balance =
              Number(memberWallet.locked_balance) + splitAmount;

            await queryRunner.manager.save(Wallet, memberWallet);

            // 🧾 Crear transacción pendiente
            const transactionSplit = queryRunner.manager.create(Transaction, {
              wallet_id: memberWallet.id,
              type_id: typeTrans.id,
              status_id: statusTransaction.id,
              amount_becoin: splitAmount,
              post_balance: memberWallet.becoin_balance,
              reference: `ORDER-${savedOrder.id}`,
            });

            await queryRunner.manager.save(Transaction, transactionSplit);

          }

          break;
        }

        default:
          throw new BadRequestException('La forma de pago no existe');
      }

       // 11) Resetear el carrito
      cart.address_id = null;
      cart.delivery_at = null;
      cart.group_id = null;
      cart.payment_type_id = null;
      cart.total_amount = 0;
      cart.total_items = 0;
      cart.total_becoin = 0;

      await queryRunner.manager.save(Cart, cart);
      await queryRunner.manager.delete(CartItem, {cart_id : cart.id})

      // 12) Confirmar transacción
      await queryRunner.commitTransaction();

      // 12Bis) Emiten un mensaje al Superadmin por socket
      const superadminId = this.superadminService.getSuperadminId();
      this.notificationsGateway.notifyOrders(superadminId, {
            order_id: savedOrder.id,
            total_becoin: savedOrder.total_becoin,
            items: +savedOrder.items,
          });

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

  async registerReturnsAndRecalculate(
    orderId: string,
    returns: { order_item_id: string; returned_quantity: number }[],
  ): Promise<{ success: boolean }> {

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      /* =======================================================
      * 1️⃣ ORDEN + VALIDACIONES
      * ======================================================= */
      const order = await qr.manager.findOne(Order, {
        where: { id: orderId },
        relations: ['payment_type'],
      });
      if (!order) throw new NotFoundException('Orden no encontrada');

      if (order.collected_at)
        throw new BadRequestException('La orden ya fue recolectada');

      /* =======================================================
      * 2️⃣ REGISTRAR DEVOLUCIONES
      * ======================================================= */
      for (const r of returns) {
        const item = await qr.manager.findOne(OrderItem, {
          where: { id: r.order_item_id, order_id: order.id },
        });
        if (!item) throw new NotFoundException('Item inválido');

        item.returned_quantity = r.returned_quantity;
        await qr.manager.save(item); // recalcula por hooks
      }

      /* =======================================================
      * 3️⃣ RECALCULAR TOTAL DE ORDEN
      * ======================================================= */
      const items = await qr.manager.find(OrderItem, {
        where: { order_id: order.id },
      });

      const newTotalBecoin = items.reduce(
        (acc, i) => acc + Number(i.total_becoin ?? 0),
        0,
      );

      order.total_becoin = newTotalBecoin;
      await qr.manager.save(order);

      /* =======================================================
      * 4️⃣ PREPARAR ESTADOS
      * ======================================================= */
      const statusPending = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });

      const purchaseType = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.PURCHASE_BELAND },
      });

      /* =======================================================
      * 5️⃣ FULL
      * ======================================================= */
      if (order.payment_type.code === PaymentTypeCode.FULL) {

        const tx = await qr.manager.findOne(Transaction, {
          where: { reference: `ORDER-${order.id}` },
        });

        const wallet = await qr.manager.findOne(Wallet, {
          where: { id: tx.wallet_id },
        });

        const diff = Number(tx.amount_becoin) - newTotalBecoin;

        if (diff > 0) {
          wallet.locked_balance = +wallet.locked_balance - +diff;
          wallet.becoin_balance = +wallet.becoin_balance + +diff;
        }

        tx.amount_becoin = newTotalBecoin;
        await qr.manager.save([wallet, tx]);

        await qr.manager.save(Payment, {
          order_id: order.id,
          user_id: wallet.user_id,
          payment_type_id: order.payment_type_id,
          total_due: newTotalBecoin,
          amount_paid: newTotalBecoin,
          outstanding_amount: 0,
          is_fully_paid: true,
          status_id: statusPending.id,
        });
      }

      /* =======================================================
      * 6️⃣ EQUAL_SPLIT
      * ======================================================= */
      if (order.payment_type.code === PaymentTypeCode.EQUAL_SPLIT) {

        const txs = await qr.manager.find(Transaction, {
          where: { reference: `ORDER-${order.id}` },
        });

        const split = newTotalBecoin / txs.length;

        for (const tx of txs) {
          const wallet = await qr.manager.findOne(Wallet, {
            where: { id: tx.wallet_id },
          });

          const diff = Number(tx.amount_becoin) - split;

          if (diff > 0) {
            wallet.locked_balance = +wallet.locked_balance - +diff;
            wallet.becoin_balance = +wallet.becoin_balance + +diff;
          }

          tx.amount_becoin = split;

          await qr.manager.save([wallet, tx]);

          await qr.manager.save(Payment, {
            order_id: order.id,
            user_id: wallet.user_id,
            payment_type_id: order.payment_type_id,
            total_due: split,
            amount_paid: split,
            outstanding_amount: 0,
            is_fully_paid: true,
            status_id: statusPending.id,
          });
        }
      }

      /* =======================================================
      * 7️⃣ SPLIT
      * ======================================================= */
      if (order.payment_type.code === PaymentTypeCode.SPLIT) {

        const consumptions = await qr.manager.query(`
          SELECT
            c.user_id,
            SUM(i.total_becoin / NULLIF(cnt.total_consumers,1)) as due
          FROM order_item_consumptions c
          JOIN order_items i ON i.id = c.order_item_id
          JOIN (
            SELECT order_item_id, COUNT(*) total_consumers
            FROM order_item_consumptions
            GROUP BY order_item_id
          ) cnt ON cnt.order_item_id = c.order_item_id
          WHERE i.order_id = $1
          GROUP BY c.user_id
        `, [order.id]);

        let guarantee = 0;

        for (const row of consumptions) {
          const wallet = await qr.manager.findOne(Wallet, {
            where: { user_id: row.user_id },
          });

          const due = Number(row.due);
          const payable = Math.min(due, Number(wallet.becoin_balance));

          if (payable > 0) {
            wallet.becoin_balance = +wallet.becoin_balance - +payable;
            wallet.locked_balance = +wallet.locked_balance + +payable;

            await qr.manager.save(wallet);

            await qr.manager.save(Transaction, {
              wallet_id: wallet.id,
              type_id: purchaseType.id,
              status_id: statusPending.id,
              amount_becoin: payable,
              post_balance: wallet.becoin_balance,
              reference: `ORDER-${order.id}`,
            });
          }

          await qr.manager.save(Payment, {
            order_id: order.id,
            user_id: wallet.user_id,
            payment_type_id: order.payment_type_id,
            total_due: due,
            amount_paid: payable,
            outstanding_amount: due - payable,
            is_fully_paid: payable === due,
            status_id: statusPending.id,
          });

          guarantee += due - payable;
        }

        // 🔒 AJUSTAR CREADOR
        const creatorTx = await qr.manager.findOne(Transaction, {
          where: { reference: `ORDER-${order.id}` },
        });

        const creatorWallet = await qr.manager.findOne(Wallet, {
          where: { id: creatorTx.wallet_id },
        });

        creatorTx.amount_becoin = +creatorTx.amount_becoin + +guarantee;
        creatorWallet.locked_balance = +creatorWallet.locked_balance + +guarantee;
        creatorWallet.becoin_balance = +creatorWallet.becoin_balance - +guarantee;

        await qr.manager.save([creatorWallet, creatorTx]);
      }

      await qr.commitTransaction();
      return { success: true };

    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async preparing (order_id: string): Promise<Order> {
    const statusOrder = await this.dataSource.manager.findOne(DeliveryStatus, {
      where: {code: DeliveryStatusCode.PREPARING}
    })
    if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.PREPARING)

    const order = await this.dataSource.manager.findOne(Order, {where: {id: order_id}});
    if (!order) throw new NotFoundException('Orden no encontrada')
    const statusOld= order.status_id;
    order.status_id = statusOrder.id;

    const orderSave = await this.dataSource.manager.save(order);
    if (!orderSave) throw new ConflictException ("No se pudo actualizar el estado de la orden");

    this.notificationsGateway.notifyStatusOrders(order.user_id, {
      status_old_id: statusOld,
      status_new_id: statusOrder.id,
    });
    
    return orderSave
  }

  async onRoute (order_id: string): Promise<Order> {
    const statusOrder = await this.dataSource.manager.findOne(DeliveryStatus, {
      where: {code: DeliveryStatusCode.ON_ROUTE}
    })
    if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.ON_ROUTE)

    const order = await this.dataSource.manager.findOne(Order, {where: {id:order_id}});
    if (!order) throw new NotFoundException('Orden no encontrada')

    const statusOld = order.status_id
    order.status_id = statusOrder.id;
    order.delivery_at = new Date ();

    const orderSave = await this.dataSource.manager.save(order);

    if (!orderSave) throw new ConflictException ("No se pudo actualizar el estado de la orden");
    
    this.notificationsGateway.notifyStatusOrders(order.user_id, {
      status_old_id: statusOld,
      status_new_id: statusOrder.id,
    });
    
    return orderSave;
  }

  async delivered(order_id: string, code: number): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Estado DELIVERED
      const statusOrder = await queryRunner.manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.DELIVERED },
      });
      if (!statusOrder)
        throw new NotFoundException('Estado DELIVERED no encontrado');

      // 2️⃣ Orden
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: order_id },
      });
      if (!order) throw new NotFoundException('Orden no encontrada');

      // 3️⃣ Validar código
      if (order.code !== code)
        throw new BadRequestException('Código de orden incorrecto');

      const statusOld = order.status_id;

      // 4️⃣ Actualizar orden
      order.status_id = statusOrder.id;
      order.delivered_at = new Date();

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      this.notificationsGateway.notifyStatusOrders(order.user_id, {
        status_old_id: statusOld,
        status_new_id: statusOrder.id,
      });

      return savedOrder;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async collected(order_id: string): Promise<{ success: boolean; code: string }> {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      /* =======================================================
      * 1️⃣ ESTADO COLLECTED
      * ======================================================= */
      const statusCollected = await qr.manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.COLLECTED },
      });
      if (!statusCollected)
        throw new NotFoundException('Estado COLLECTED no encontrado');

      /* =======================================================
      * 2️⃣ ORDEN
      * ======================================================= */
      const order = await qr.manager.findOne(Order, {
        where: { id: order_id },
      });
      if (!order) throw new NotFoundException('Orden no encontrada');

      if (order.collected_at)
        throw new BadRequestException('La orden ya fue recolectada');

      const oldStatus = order.status_id;

      order.status_id = statusCollected.id;
      order.collected_at = new Date();
      order.recycled_code = await this.generateUniqueCode();

      await qr.manager.save(order);

      /* =======================================================
      * 3️⃣ TRANSACTIONS → EJECUTAR COBROS
      * ======================================================= */
      const txStatusCompleted = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      const txs = await qr.manager.find(Transaction, {
        where: {
          reference: `ORDER-${order.id}`,
          status_id: Not(txStatusCompleted.id),
        },
      });

      let totalCollected = 0;

      for (const tx of txs) {
        const wallet = await qr.manager.findOne(Wallet, {
          where: { id: tx.wallet_id },
        });

        // liberar saldo retenido
        wallet.locked_balance = +wallet.locked_balance - Number(tx.amount_becoin);

        // no se devuelve balance: ya fue descontado
        tx.status_id = txStatusCompleted.id;

        totalCollected += Number(tx.amount_becoin);

        await qr.manager.save([wallet, tx]);
      }

      /* =======================================================
      * 4️⃣ PAYMENTS → ESTADOS
      * ======================================================= */
      const paymentStatusCompleted = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      const paymentStatusPartial = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.PARTIAL },
      });

      const payments = await qr.manager.find(Payment, {
        where: { order_id: order.id },
      });

      for (const p of payments) {
        p.status_id =
          Number(p.amount_paid) === Number(p.total_due)
            ? paymentStatusCompleted.id
            : paymentStatusPartial.id;

        await qr.manager.save(p);
      }

      /* =======================================================
      * 5️⃣ SUPERADMIN → ACREDITAR TOTAL COBRADO
      * ======================================================= */
      const superadminWallet = await qr.manager.findOne(Wallet, {
        where: { user_id: this.superadminService.getSuperadminId() },
      });
      if (!superadminWallet)
        throw new NotFoundException('Wallet superadmin no encontrada');

      const txTypeSale = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.SALE_BELAND },
      });
      if (!txTypeSale)
        throw new NotFoundException('Transaction SALE_BELAND no encontrada');

      superadminWallet.becoin_balance =
        Number(superadminWallet.becoin_balance) + Number(totalCollected);

      await qr.manager.save(superadminWallet);

      // 🧾 Transaction ingreso superadmin
      const txSuperadmin = qr.manager.create(Transaction, {
        wallet_id: superadminWallet.id,
        type_id: txTypeSale.id,
        status_id: txStatusCompleted.id,
        amount_becoin: totalCollected,
        post_balance: superadminWallet.becoin_balance,
        reference: `ORDER-${order.id}`,
      });

      await qr.manager.save(Transaction, txSuperadmin);


      /* =======================================================
      * 6️⃣ BECOIN GREEN AL USUARIO
      * ======================================================= */
      const userWallet = await qr.manager.findOne(Wallet, {
        where: { user_id: order.user_id },
      });
      if (!userWallet)
        throw new NotFoundException('Wallet del usuario no encontrada');

      userWallet.becoin_green = +userWallet.becoin_green + Number(
        this.superadminService.recicled_becoin,
      );

      await qr.manager.save(userWallet);

      /* =======================================================
      * 7️⃣ COMMIT + NOTIFICACIÓN
      * ======================================================= */
      await qr.commitTransaction();

      this.notificationsGateway.notifyStatusOrders(order.user_id, {
        status_old_id: oldStatus,
        status_new_id: statusCollected.id,
      });

      return { success: true, code: order.recycled_code };

    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async recycled (code:string, recycled_weight:number): Promise<Order> {
    const statusOrder = await this.dataSource.manager.findOne(DeliveryStatus, {
      where: {code: DeliveryStatusCode.RECYCLED}
    })
    if (!statusOrder) throw new NotFoundException('Estado de envio de orden no encontrada ', DeliveryStatusCode.RECYCLED)

    const order = await this.dataSource.manager.findOne(Order, {where: {recycled_code: code}});
    if (!order) throw new NotFoundException('Orden no encontrada con codigo: ', code)

    const statusOld = order.status_id;
    order.status_id = statusOrder.id;
    order.recycled_weight= recycled_weight;
    order.recycled_at = new Date ();

    const orderSave = await this.dataSource.manager.save(order);

    if (!orderSave) throw new ConflictException ('Error al actualizar la orden')

    this.notificationsGateway.notifyStatusOrders(order.user_id, {
        status_old_id: statusOld,
        status_new_id: statusOrder.id,
      });
    
    return orderSave;
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

      // 2) Busco la orden a actualizar y actualizo su status
      const order = await this.repository.findOne(order_id);
      if (!order) throw new NotFoundException('Orden no encontrada')

      const allowedStatus = [
        DeliveryStatusCode.PENDING as string,
        DeliveryStatusCode.PREPARING as string
      ];

      // Si el estado actual NO está permitido → lanzar error
      if (!allowedStatus.includes(order.status.code)) {
        throw new NotImplementedException(
          'Solo puede cancelar la orden hasta el momento de su preparación.'
        );
      }

      // 2 BIS) PROVISORIO esto esta porque solo esta realizada el pago FULL. 
      // Implementar los otros pagos
      if (order.payment_type.code !== PaymentTypeCode.FULL) throw new BadRequestException('Forma de Pago no habilitadas todavia')
    
      const statusOld = order.status_id;
      order.status_id = statusOrder.id;
      order.observation = observation;
      const savedOrder = await queryRunner.manager.save(order)

      // 4) Busco la solicitud de pago para confirmar su estado a Cancelado
      const payment = await queryRunner.manager.findOne (Payment, {
        where: {order_id: order.id}
      })
      // 4 BIS) Busco el estado CANCELLED para poder actualizar el payment y la transaction
      const statusPayment = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.CANCELLED}
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

      // 6) Actualizo el estado de la transaccion a cancelada
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: payment.transaction_id}
      })
      transaction.status_id = statusPayment.id;
      transaction.post_balance = +wallet.becoin_balance;
      queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      this.notificationsGateway.notifyStatusOrders(this.superadminService.getSuperadminId(), {
        status_old_id: statusOld,
        status_new_id: statusOrder.id,
      });

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
