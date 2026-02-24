import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { Payment } from './entities/payment.entity';
import { DataSource } from 'typeorm';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../transaction-type/enum/transaction-code';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Injectable()
export class PaymentsService {
  private readonly completeMessage = 'el pago';

  constructor(private readonly repository: PaymentsRepository,
    private readonly dataSource: DataSource,
    private readonly superadminService: SuperadminConfigService
  ) {}

  async findAll(
    order_id: string, 
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Payment[], number]> {
    try {
      const response = await this.repository.findAll(
        order_id,
        user_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findPaymentsByOrder(
    order_id: string, 
    user_id: string,
    uncompleted: boolean,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Payment[], number]> {
    try {
      const response = await this.repository.findPaymentsByOrder(
        order_id,
        user_id,
        uncompleted,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Payment> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async payNow(payment_id: string): Promise<{payment: Payment, message:string, becoinOrangeUsed:number}> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Buscar payment
      const payment = await queryRunner.manager.findOne(Payment, {
        where: { id: payment_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        throw new NotFoundException('Pago no encontrado');
      }

      if (payment.status.code === StatusCode.COMPLETED) {
        throw new BadRequestException('Este pago ya fue completado');
      }

      const order = await queryRunner.manager.findOne(Order, {
        where: {id: payment.order_id}
      })
      if (!order) {throw new NotFoundException('Orden no encontrado');}
      if (order.paied) {throw new ConflictException('La orden ya fue pagada');}

      order.total_becoin_paied = Number(order.total_becoin_paied) + Number(payment.amount_paid);
      if (Number(order.total_becoin_paied) >= Number(order.total_becoin)) 
          order.paied = true;
      await queryRunner.manager.save(order);

      // 2️⃣ Wallet del usuario
      const userWallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: payment.user_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!userWallet) {
        throw new BadRequestException('Billetera no encontrada');
      }

      let becoinOrangeUsed:number = 0
      let message:string = "¡Exclente, pagaste tu orden!"

      if (Number(userWallet.becoin_orange) > 0) {
        const items = await queryRunner.manager.find(OrderItem, {
          where: [
            { order_id: payment.order_id, user_id: payment.user_id },
          ],
          relations: { product: true },
        });

        let profit = 0;
        for (const item of items) {
          profit += Number(item.product.price) - Number(item.product.cost);
        }

        if (profit > 0) {
          const priceOneBecoin = this.superadminService.getPriceOneBecoin();
          const profitBecoin = profit / priceOneBecoin;

          // 80% del profit en BeCoin, redondeado
          const maxRecoverable = Math.floor(profitBecoin * 0.8);

          if (maxRecoverable > 0) {
            // Cuánto realmente se puede usar
            becoinOrangeUsed = Math.min(
              Math.floor(Number(userWallet.becoin_orange)),
              maxRecoverable,
            );

            if (becoinOrangeUsed > 0) {
              // Transferencia interna
              userWallet.becoin_orange =
                Number(userWallet.becoin_orange) - becoinOrangeUsed;

              userWallet.becoin_balance =
                Number(userWallet.becoin_balance) + becoinOrangeUsed;

              // Mensajes
              if (becoinOrangeUsed === maxRecoverable) {
                message =
                  '💙 En Beland cuidamos tu dinero: Aplicamos ${becoinOrangeUsed} BeCoin Naranjas. Seguis recuperando las comiciones que te cobraron las plataformas de recargas.';
              } else {
                message = '💙 En Beland cuidamos tu dinero: aplicamos tus BeCoin Naranjas recuperaste todo lo que te cobraron las plataformas de recarga.';

              }

              // Transaction ORANGE_CREDIT_USED
              const orangeTxType = await queryRunner.manager.findOne(TransactionType, {
                where: { code: TransactionCode.ORANGE_CREDIT_USED },
              });

              const txStatus = await queryRunner.manager.findOne(TransactionState, {
                where: { code: StatusCode.COMPLETED },
              });

              await queryRunner.manager.save(Transaction, {
                wallet_id: userWallet.id,
                amount_becoin: becoinOrangeUsed,
                post_balance: Number(userWallet.becoin_balance),
                type_id: orangeTxType.id,
                status_id: txStatus.id,
                reference: `ORDER-${payment.order_id}`,
              });
            }
          }
        }
      }


      if (Number(userWallet.becoin_balance) < Number(payment.amount_paid)) {
        throw new BadRequestException('Saldo Insuficiente');
      }

      // 3️⃣ Debitar wallet usuario
      userWallet.becoin_balance =
        Number(userWallet.becoin_balance) - Number(payment.amount_paid);

      await queryRunner.manager.save(userWallet);

      const txType = await queryRunner.manager.findOne(TransactionType, {
        where:{code: TransactionCode.PURCHASE_BELAND}
      })
      const txStatus = await queryRunner.manager.findOne(TransactionState, {
        where:{code: StatusCode.COMPLETED}
      })

      // 4️⃣ Transaction usuario (PURCHASE)
      const userTransaction = await queryRunner.manager.save(Transaction, {
        wallet_id: userWallet.id,
        amount_becoin: Number(payment.amount_paid),
        post_balance: Number(userWallet.becoin_balance),
        type_id: txType.id,
        status_id: txStatus.id,
        reference: `ORDER-${payment.order_id}`
      });

      // 5️⃣ Actualizar payment
      payment.status_id = txStatus.id;
      payment.transaction_id = userTransaction.id
      await queryRunner.manager.save(payment);

      // 6️⃣ Buscar super admin
      const superAdminWallet = await queryRunner.manager.findOne(Wallet, {
        where: { id:  this.superadminService.getWalletId()},
      });

      if (!superAdminWallet) {
        throw new InternalServerErrorException('Billetera del superAdmin no encontrada');
      }

      // 8️⃣ Acreditar wallet super admin
      superAdminWallet.becoin_balance =
        Number(superAdminWallet.becoin_balance) + Number(payment.amount_paid);

      await queryRunner.manager.save(superAdminWallet);

      const txTypeSale = await queryRunner.manager.findOne(TransactionType, {
        where:{code: TransactionCode.SALE_BELAND}
      })

      // 9️⃣ Transaction super admin (SALE)
      await queryRunner.manager.save(Transaction, {
        wallet_id: superAdminWallet.id,
        amount_becoin: Number(payment.amount_paid),
        post_balance: Number(superAdminWallet.becoin_balance),
        type_id: txTypeSale.id,
        status_id: txStatus.id,
        reference: `PAYMENT-${payment.id}`
      });

      

      // 🔒 Commit
      await queryRunner.commitTransaction();

      return {payment, message, becoinOrangeUsed};

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(body: Partial<Payment>): Promise<Payment> {
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

  async update(id: string, body: Partial<Payment>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
