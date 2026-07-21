import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { DataSource, Not, QueryRunner, EntityManager } from 'typeorm';
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
import { User } from '../users/entities/users.entity';
import { Product } from '../products/entities/product.entity';
import { RecycledItem } from '../recycled-items/entities/recycled-item.entity';
import { EmailService } from '../email/email.service';
import {
  superadminNotificationEmailSubject,
  superadminNotificationEmailTemplate,
} from '../email/plantilla/htmlNotificacionSuperadmin';
import { SpendOrangeUseCase } from '../rewards/becoin-orange/use-cases/spend-orange.use-case';
import { FinancialReversalService, ReversalPayload } from '../wallets/financial-reversal.service';
import { PurchaseOrderPaymentUseCase } from '../wallets/use-cases/purchase-order-payment.use-case';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
@Injectable()
export class OrdersService {
  private readonly completeMessage = 'la orden';
  private readonly logger = new Logger(OrdersService.name);

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
    private readonly emailService: EmailService,
    private readonly spendOrangeUseCase: SpendOrangeUseCase,
    private readonly financialReversalService: FinancialReversalService,
    private readonly purchaseOrderPaymentUseCase: PurchaseOrderPaymentUseCase,
  ) {}

  async generateUniqueCode(manager?: EntityManager): Promise<string> {
    let code = this.generateRandomCode();

    const exists = await (manager || this.dataSource.manager).findOne(Order, {
      where: { recycled_code: code },
    });

    if (exists) {
      return this.generateUniqueCode(manager); // recursion hasta que salga único
    }

    return code;
  }

  private async sendSuperadminOrderEmail(
    order: Order,
    paymentType: PaymentType,
  ): Promise<void> {
    try {
      const superadminEmail = this.superadminService.getEmail();

      if (!superadminEmail) {
        this.logger.warn(
          `No se envio email de orden ${order.id}: email de superadmin no configurado`,
        );
        return;
      }

      const user = order.user_id
        ? await this.dataSource.manager.findOne(User, {
            where: { id: order.user_id },
          })
        : null;

      const subject = superadminNotificationEmailSubject('PURCHASE');
      const html = superadminNotificationEmailTemplate({
        type: 'PURCHASE',
        amount: Number(order.total_amount),
        currency: 'USD',
        userName: user?.full_name,
        userEmail: user?.email,
        operationId: order.id,
        reference: order.order_number
          ? `ORDER-${order.order_number}`
          : `ORDER-${order.id}`,
        status: order.paied ? 'PAGADA' : 'PENDIENTE',
        paymentMethod: paymentType?.description || paymentType?.code,
        createdAt: order.created_at,
        details: {
          'Total': order.total_amount,
          'Items': order.total_items,
          'Costo de envio': order.delivery_cost,
          'Tipo de pago': paymentType?.code,
        },
      });

      await this.emailService.sendMail({
        to: superadminEmail,
        subject,
        text: `Nueva compra registrada en Beland. Orden: ${order.id}. Total: ${order.total_amount}.`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `No se pudo enviar email de orden al superadmin: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
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

  async createOrderByCart(cart_id: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2) Traer carrito
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { id: cart_id },
        relations: { items: true, group: { members: true } },
      });
      if (!cart) throw new NotFoundException('Carrito no encontrado');
      if (!cart.items || cart.items.length === 0)
        throw new BadRequestException('El carrito esta vacio');

      console.log ('este es el cart a convertir en order: ', cart);
      // 3) Forma de pago
      let paymentType: PaymentType;
      if (!cart.group_id) {
        paymentType = await queryRunner.manager.findOne(PaymentType, {
          where: { code: PaymentTypeCode.FULL },
        });
      } else {
        if (!cart.group)
          throw new BadRequestException(
            'No se encontro el metodo de pago en el grupo ni en el carrito',
          );

        paymentType = await queryRunner.manager.findOne(PaymentType, {
          where: { id: cart.group.payment_type_id },
        });
      }

      if (!paymentType)
        throw new ConflictException('Forma de pago no disponible');

      // 5) Status de orden
      const statusOrder = await queryRunner.manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.PENDING },
      });
      if (!statusOrder)
        throw new ConflictException(
          'No se encuentra el estado de la orden',
          DeliveryStatusCode.PENDING,
        );

      // 5b) Crear orden
      const {
        id: _cartId,
        created_at: _c1,
        updated_at: _c2,
        items: _items,
        user_id,
        payment_type_id,
        payment_type,
        address,
        total_amount,
        ...createOrder
      } = cart as Cart;

      const order = queryRunner.manager.create(Order, {
        ...createOrder,
        user_id,
        subtotal_amount: +total_amount,
        total_amount: +total_amount + +createOrder.delivery_cost,
        payment_type_id: paymentType.id,
        status_id: statusOrder.id,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);
      if (!savedOrder)
        throw new ConflictException('No se pudo crear la orden');

      // 🔥 6) DESCONTAR STOCK + CREAR ORDER ITEMS
      const orderItemsPayload = [];

      for (const cartItem of cart.items as CartItem[]) {
        const orderedQuantity = cartItem.quantity;

        const product = await queryRunner.manager.findOne(Product, {
          where: { id: cartItem.product_id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product)
          throw new NotFoundException(
            `Producto no encontrado (id: ${cartItem.product_id})`,
          );

        // Se descuenta aunque no alcance el stock para permitir backorder.
        product.quantity = +product.quantity - orderedQuantity;
        await queryRunner.manager.save(Product, product);

        const { id, created_at, cart_id, ...rest } = cartItem;

        orderItemsPayload.push({
          ...rest,
          ordered_quantity: orderedQuantity,
          order_id: savedOrder.id,
        });
      }

      const orderItems = queryRunner.manager.create(
        OrderItem,
        orderItemsPayload,
      );
      const itemsCreated = await queryRunner.manager.save(OrderItem, orderItems);

      if (!itemsCreated || itemsCreated.length === 0)
        throw new ConflictException(
          'No se pudieron crear los ítems asociados a la orden',
        );

      // 11) Reset carrito
      cart.address_id = null;
      cart.delivery_at = null;
      cart.payment_type_id = null;
      cart.total_amount = 0;
      cart.total_items = 0;

      await queryRunner.manager.save(Cart, cart);
      await queryRunner.manager.delete(CartItem, { cart_id: cart.id });

      // 11b) Pagos en grupo
      const statusPayment = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });

      if (cart.group_id && cart.group?.members?.length) {
        let sumTotal = 0;

        for (const member of cart.group.members) {
          const amount = Number(member.pendingAmount);
          if (!amount || amount <= 0) continue;

          await queryRunner.manager.save(Payment, {
            amount_paid: amount,
            order_id: order.id,
            payment_type_id: order.payment_type_id,
            user_id: member.user_id,
            status_id: statusPayment.id,
          });

          sumTotal += amount;
        }

        if (sumTotal !== Number(order.total_amount))
          throw new ConflictException(
            `Diferencia entre compromisos y total. Orden: ${order.total_amount}, Cobros: ${sumTotal}`,
          );
      }

      if (!cart.group_id && cart.user_id) {
        // ===== PAGO INMEDIATO (COMPRA INDIVIDUAL) =====
        console.log('entoro a hacer el pago de la orden por ser compra individual')
        
        const singlePaymentCreated = await queryRunner.manager.save(Payment, {
          amount_paid: Number(savedOrder.total_amount),
          order_id: savedOrder.id,
          payment_type_id: savedOrder.payment_type_id,
          user_id: cart.user_id,
          status_id: statusPayment.id,
        });

        await this.purchaseOrderPaymentUseCase.execute(queryRunner.manager, {
            paymentId: singlePaymentCreated.id,
            paymentProvider: PaymentProviderEnum.WALLET,
            paymentReferenceId: singlePaymentCreated.id
        });
      }

      // 12) Commit
      await queryRunner.commitTransaction();

      // 12Bis) Notificación
      this.notificationsGateway.notifyOrders(
        this.superadminService.getSuperadminId(),
        {
          order_id: savedOrder.id,
          total_usd: savedOrder.total_amount,
          items: +savedOrder.items,
        },
      );

      await this.sendSuperadminOrderEmail(savedOrder, paymentType);

      return savedOrder;
    } catch (err: any) {
          await queryRunner.rollbackTransaction();

          console.error('\n==============================');
          console.error('ERROR ORIGINAL');
          console.error('Constructor:', err?.constructor?.name);
          console.error('Message:', err?.message);
      console.error('Stack:', err?.stack);
      console.error(err);
      console.error('==============================\n');

      throw err;
    } finally {
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
     // ACA TENGO QUE RESOLVER COMO ANOTAR LAS DEVOLUCIONR Y COMO DEJAR EL MONTO PARA QUE EL LEADER ELIJA QUE HACER.
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
      * 2️⃣ CALCULAR DEVOLUCIONES
      * ======================================================= */
      let total_amount_returned = 0;
      let total_Weight_returned = 0;
      for (const r of returns) {
        const item = await qr.manager.findOne(OrderItem, {
          where: { id: r.order_item_id, order_id: order.id },
        });
        if (!item) throw new NotFoundException('Item inválido');

        const returnedQuantity = Number(r.returned_quantity);
        const previousReturnedQuantity = Number(item.returned_quantity ?? 0);
        const orderedQuantity = Number(item.ordered_quantity ?? item.quantity ?? 0);

        if (returnedQuantity < 0) {
          throw new BadRequestException('La cantidad devuelta no puede ser negativa');
        }

        if (returnedQuantity > orderedQuantity) {
          throw new BadRequestException(
            `La devolución no puede superar la cantidad pedida del item ${item.id}`,
          );
        }

        const quantityToRestore = returnedQuantity - previousReturnedQuantity;

        if (quantityToRestore > 0) {
          await qr.manager.increment(
            Product,
            { id: item.product_id },
            'quantity',
            quantityToRestore,
          );
        }

        total_amount_returned += r.returned_quantity * Number(item.unit_price)
        total_Weight_returned += r.returned_quantity * Number(item.unit_weight)
        item.returned_quantity = returnedQuantity;
        await qr.manager.save(item); // recalcula por hooks
      }

      /* =======================================================
      * 3️⃣ RECALCULAR TOTALES DE ORDEN Y ASIGNA MONTO A DEVOLVER
      * ======================================================= */
      order.total_amount_returned = total_amount_returned;
      order.total_weight = Number(order.total_weight) - total_Weight_returned;

      await qr.manager.save(order);

      await qr.commitTransaction();
      return { success: true };

    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async returnDevolutionUsers(order_id: string, is_split: boolean): Promise<{ success: boolean }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* =======================================================
      * 1️⃣ ORDEN + VALIDACIONES
      * ======================================================= */
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: order_id },
        relations: {
          group: { members: true },
        },
      });

      if (!order) throw new NotFoundException('Orden no encontrada');

      const refundTotal = Number(order.total_amount_returned);
      if (!refundTotal || refundTotal <= 0) {
        throw new BadRequestException('La orden no tiene monto para devolver');
      }

      if (order.returned_paied) {
        throw new ConflictException('La devolución ya fue procesada');
      }

      /* =======================================================
      * 2️⃣ CONFIG TRANSACCIONES
      * ======================================================= */
      const txStatus = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      const txRefund = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.REFUND_ORDER },
      });

      if (!txStatus || !txRefund ) {
        throw new InternalServerErrorException('Configuración de transacciones incompleta');
      }

      /* =======================================================
      * 3️⃣ SUPERADMIN WALLET ID
      * ======================================================= */
      const superAdminWalletId = this.superadminService.getWalletId();

      /* =======================================================
      * 4️⃣ DEVOLUCIÓN A TRAVÉS DE FINANCIAL REVERSAL SERVICE
      * ======================================================= */
      if (!is_split) {
        /* ===== TODO AL CREADOR ===== */
        // Obtenemos solo el ID de la wallet del creador para el servicio unificado
        const leaderWallet = await queryRunner.manager.findOne(Wallet, {
          where: { user_id: order.user_id },
          select: ['id'],
        });

        if (!leaderWallet) throw new NotFoundException('Wallet del líder no encontrada');

        const payload: ReversalPayload = {
          sourceWalletId: superAdminWalletId,
          destinationWalletId: leaderWallet.id,
          amountUsd: refundTotal,
          transactionData: {
            type_id: txRefund.id,
            status_id: txStatus.id,
            reference: `REFUND-ORDER-${order.id}`,
          },
        };

        await this.financialReversalService.executeReversal(queryRunner.manager, payload);

      } else {
        /* ===== DEVOLUCIÓN SPLIT CON REDONDEO ===== */
        if (!order.group || !order.group.members || order.group.members.length === 0) {
          throw new ConflictException('No hay miembros para dividir la devolución');
        }

        const members = order.group.members;
        const totalMembers = members.length;

        // Se mantiene la matemática exacta del código original
        const amountPerMember = Math.floor(refundTotal / totalMembers);
        const distributedTotal = amountPerMember * totalMembers;
        const remainder = refundTotal - distributedTotal; // exceso

        let leaderId: string | null = null;

        for (const member of members) {
          // Obtenemos solo el ID para pasarlo al servicio
          const wallet = await queryRunner.manager.findOne(Wallet, {
            where: { user_id: member.user_id },
            select: ['id'],
          });

          if (!wallet) {
            throw new NotFoundException(`Wallet no encontrada para usuario ${member.user_id}`);
          }

          let amountToCredit = amountPerMember;

          if (member.role === 'LEADER') {
            leaderId = member.user_id;
            amountToCredit += remainder; // 👑 exceso al líder
          }

          const payload: ReversalPayload = {
            sourceWalletId: superAdminWalletId,
            destinationWalletId: wallet.id,
            amountUsd: amountToCredit,
            transactionData: {
              type_id: txRefund.id,
              status_id: txStatus.id,
              reference: `REFUND-ORDER-${order.id}`,
            },
          };

          await this.financialReversalService.executeReversal(queryRunner.manager, payload);
        }

        if (!leaderId) {
          throw new ConflictException('No se encontró un miembro LEADER para asignar el excedente');
        }
      }

      /* =======================================================
      * 6️⃣ MARCAR ORDEN
      * ======================================================= */
      order.returned_paied = true;
      order.returned_split = is_split;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return { success: true };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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

  async delivered (order_id: string, code: number, weight:number = 0): Promise<Order> {
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
      if (!order.paied) throw new ConflictException('La orden todavia no fue Cobrada en su totalidad')

      // 3️⃣ Validar código
      if (order.code !== code)
        throw new BadRequestException('Código de orden incorrecto');

      const statusOld = order.status_id;

      // 4️⃣ Actualizar orden
      order.status_id = statusOrder.id;
      order.delivered_at = new Date();

      const savedOrder = await queryRunner.manager.save(order);

      if (weight !== 0) {
        await queryRunner.manager.save (RecycledItem, {user_id:order.user_id, weight})
        const userWallet = await queryRunner.manager.findOne(Wallet, {
          where: { user_id: order.user_id },
        });

        if (!userWallet)
          throw new NotFoundException('Wallet del usuario no encontrada');

        const percentage = Number(this.superadminService.recicled_becoin);

        const becoinGreenToAdd = (Math.ceil(
          Number(order.subtotal_amount) * (percentage / 100)))/this.superadminService.getPriceOneBecoin();
        

        userWallet.becoin_green =
          Number(userWallet.becoin_green) + becoinGreenToAdd;

        await queryRunner.manager.save(userWallet);
      } 
        

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

  async collected (order_id: string): Promise<{ success: boolean; code: string }> {
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
        relations: {payment_type:true}
      });
      if (!order) throw new NotFoundException('Orden no encontrada');
      if (order.collected_at)
          throw new BadRequestException('La orden ya fue recolectada');
      const oldStatus = order.status_id;

      order.status_id = statusCollected.id;
      order.collected_at = new Date();
      order.recycled_code = await this.generateUniqueCode(qr.manager);
      await qr.manager.save(order);


      const userWallet = await qr.manager.findOne(Wallet, {
        where: { user_id: order.user_id },
      });

      if (!userWallet)
        throw new NotFoundException('Wallet del usuario no encontrada');

      const percentage = Number(this.superadminService.recicled_becoin);

      const becoinGreenToAdd = (Math.ceil(
          Number(order.subtotal_amount) * (percentage / 100)))/this.superadminService.getPriceOneBecoin();
      
      userWallet.becoin_green =
        Number(userWallet.becoin_green) + becoinGreenToAdd;

      await qr.manager.save(userWallet);

      // Register Green Reward Transaction
      const transactionType = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.GREEN_REWARD },
      });
      if (!transactionType) throw new NotFoundException('Tipo de transacción GREEN_REWARD no encontrado');

      const transactionState = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });
      if (!transactionState) throw new NotFoundException('Estado COMPLETED no encontrado');

      await qr.manager.save(Transaction, {
        wallet_id: userWallet.id,
        type: transactionType,
        status: transactionState,
        amount_green: becoinGreenToAdd,
        post_green_balance: userWallet.becoin_green,
        post_balance: userWallet.becoin_balance, // Mantener el saldo regular que es requerido
        reference: order.id,
        clientTransactionId: null,
      });

      /* =======================================================
      * 7️⃣ COMMIT + NOTIFICACIÓN
      * ======================================================= */
      await qr.commitTransaction();

        this.notificationsGateway.notifyStatusOrders(order.user_id, {
          status_old_id: oldStatus,
          status_new_id: statusCollected.id,
        });

      return { success: true, code: order.recycled_code ?? "NO RECYCLE-NO CODE " };

    } catch (error) {
      if (qr.isTransactionActive) {
        await qr.rollbackTransaction();
      }
      throw error;
    } finally {
      await qr.release();
    }
  }

  async recycled(code: string, recycled_weight: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {

      const statusOrder = await manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.RECYCLED },
      });

      if (!statusOrder) {
        throw new NotFoundException(
          'Estado de envío de orden no encontrada',
          DeliveryStatusCode.RECYCLED,
        );
      }

      const order = await manager.findOne(Order, {
        where: { recycled_code: code },
      });

      if (!order) {
        throw new NotFoundException('Orden no encontrada con código:', code);
      }

      const statusOld = order.status_id;

      order.status_id = statusOrder.id;
      order.recycled_at = new Date();

      const orderSaved = await manager.save(Order, order);

      const user = await manager.findOne(User, {
        where: { id: order.user_id },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      user.total_weight_recycled =
        Number(user.total_weight_recycled) + recycled_weight;

      await manager.save (RecycledItem, {user_id:order.user_id, weight: recycled_weight})

      await manager.save(User, user);

      this.notificationsGateway.notifyStatusOrders(order.user_id, {
        status_old_id: statusOld,
        status_new_id: statusOrder.id,
      });

      return orderSaved;
    });
  }

  async cancelled(order_id: string, observation: string): Promise<Order> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      /* =======================================================
      * 1️⃣ ESTADO CANCELLED
      * ======================================================= */
      const cancelledStatus = await qr.manager.findOne(DeliveryStatus, {
        where: { code: DeliveryStatusCode.CANCELLED },
      });
      if (!cancelledStatus) {
        throw new NotFoundException('Estado CANCELLED no encontrado');
      }

      /* =======================================================
      * 2️⃣ ORDEN + VALIDACIONES
      * ======================================================= */
      const order = await qr.manager.findOne(Order, {
        where: { id: order_id },
        relations: {status:true, items:true},
      });

      if (!order) throw new NotFoundException('Orden no encontrada');

      if (order.status.code !== DeliveryStatusCode.PENDING) {
        throw new ConflictException(
          'La orden solo puede cancelarse si está en estado PENDING',
        );
      }

      const oldStatusId = order.status_id;

      order.status = cancelledStatus;
      order.observation = observation;
      await qr.manager.save(order);

      /* =======================================================
      * 3️⃣ PAYMENTS DE LA ORDEN
      * ======================================================= */
      const payments = await qr.manager.find(Payment, {
        where: { order_id: order.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payments || payments.length === 0) {
        await qr.commitTransaction();
        return order;
      }

      const statusCancelled = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.CANCELLED },
      });

      const statusCompleted = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      if (!statusCancelled || !statusCompleted) {
        throw new InternalServerErrorException('Estados de transacción no configurados');
      }

      const txCancel = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.CANCELLED_ORDER },
      });

      if (!txCancel) {
        throw new InternalServerErrorException('Tipo de transacción no configurados');
      }

      /* =======================================================
      * 4️⃣ WALLET SUPERADMIN
      * ======================================================= */
      const superAdminWalletId = this.superadminService.getWalletId();

      /* =======================================================
      * 5️⃣ PROCESAR PAYMENTS
      * ======================================================= */
      for (const payment of payments) {
        if (payment.status_id === statusCancelled.id) continue;

        // 🔹 PAYMENT PENDING → solo cancelar
        if (payment.status_id !== statusCompleted.id) {
          payment.status = statusCancelled;
          await qr.manager.save(payment);
          continue;
        }

        /* ===== PAYMENT COMPLETED → DEVOLVER DINERO ===== */

        const amount = Number(payment.amount_paid);

        // 👤 Wallet usuario (Obtenemos ID sin lock pesimista)
        const userWallet = await qr.manager.findOne(Wallet, {
          where: { user_id: payment.user_id },
          select: ['id'],
        });

        if (!userWallet) {
          throw new NotFoundException(`Wallet no encontrada usuario ${payment.user_id}`);
        }

        const payload: ReversalPayload = {
          sourceWalletId: superAdminWalletId,
          destinationWalletId: userWallet.id,
          amountUsd: amount,
          transactionData: {
            type_id: txCancel.id,
            status_id: statusCompleted.id,
            reference: `CANCELLED-ORDER-${order.id}`,
          },
        };

        const { destinationTransaction } = await this.financialReversalService.executeReversal(
          qr.manager,
          payload,
        );

        // 🧾 Cancelar payment
        payment.status = statusCancelled;
        payment.transaction = destinationTransaction;
        await qr.manager.save(payment);
      }

      for (const item of order.items) {
        const quantityToRestore = Number(item.ordered_quantity ?? item.quantity ?? 0);
        if (quantityToRestore > 0) {
          await qr.manager.increment(
            Product,
            { id: item.product_id },
            'quantity',
            quantityToRestore,
          );
        }
      }


      await qr.commitTransaction();

      /* =======================================================
      * 6️⃣ NOTIFICACIÓN
      * ======================================================= */
      this.notificationsGateway.notifyStatusOrders(
        this.superadminService.getSuperadminId(),
        {
          status_old_id: oldStatusId,
          status_new_id: cancelledStatus.id,
        },
      );

      return order;

    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
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

      for (const payment of payments) {
        // 8 BIS) Libero los fondos de la billetera del usuario
         const wallet = payment.user.wallet;
        // wallet.locked_balance = +wallet.locked_balance - +payment.amount_paid
        // await queryRunner.manager.save(Wallet, wallet);

        // 9) Registrar transacción (post_balance debe reflejar el saldo luego del descuento)
        const txPurchase = queryRunner.manager.create(Transaction, {
          wallet_id: wallet.id,
          type_id: txType.id,
          status_id: status.id,
          amount_usd: +payment.amount_paid,
          post_balance: wallet.usd_balance,
          reference: `PURCHASEBELAND-${order.id}`,
        });
        const txPurchaseSaved = await queryRunner.manager.save(Transaction, txPurchase);

        payment.status = status;
        payment.transaction_id = txPurchase.id
        await queryRunner.manager.save(Payment, payment)
      }

      // 9 Bis) aca deberia incrementar el saldo del wallet SuperAdmin, registrar tambien la transaccion, y generar una nueva tabla para enviar los pedidos para generar el envio.
      const walletSuperadmin = await queryRunner.manager.findOne(Wallet, {
        where: { id: this.superadminService.getWalletId() },
      });
      if (!walletSuperadmin) throw new NotFoundException('Wallet del Super Admin no encontrada');
      
      walletSuperadmin.usd_balance = +walletSuperadmin.usd_balance + +order.total_amount;
      await queryRunner.manager.save(Wallet, walletSuperadmin);

      const txSale = queryRunner.manager.create(Transaction, {
        wallet_id: walletSuperadmin.id,
        type_id: txTypeSale.id,
        status_id: status.id,
        amount_usd: +order.total_amount,
        post_balance: +walletSuperadmin.usd_balance,
        reference: `SALEBELAND-${order.id}`,
      });
      await queryRunner.manager.save(Transaction, txSale);
  }
}

