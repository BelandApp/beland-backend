import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Payment } from 'src/modules/payments/entities/payment.entity'; 
import { Order } from 'src/modules/orders/entities/order.entity'; 
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';

import { Wallet } from 'src/modules/wallets/entities/wallet.entity';

import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';

import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { WalletPaymentService } from 'src/modules/wallets/wallet-payment.service';
import { GiftCardBalanceService } from 'src/modules/gift-card/services/gift-card-balance.service';

import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';

import { PaymentProviderEnum } from 'src/modules/transactions/enums/transaction.enums';

export interface PurchaseOrderPaymentUseCaseInput {
  paymentId: string;

  paymentProvider: PaymentProviderEnum;

  paymentReferenceId: string;

  reference?: string;

  userGiftCardId?: string;

  resolvedGiftCardAmount?: number;
}

export interface PurchaseOrderPaymentUseCaseResponse {
  paymentId: string;

  orderId: string;

  transactionId?: string;

  totalOrderPaid: number;

  orderPaid: boolean;

  message?: string;

  becoinOrangeUsed?: number;
}

import { SpendOrangeUseCase } from '../../rewards/becoin-orange/use-cases/spend-orange.use-case';

@Injectable()
export class PurchaseOrderPaymentUseCase {
  constructor(
    private readonly superadminConfig: SuperadminConfigService,
    private readonly walletPaymentService: WalletPaymentService,
    private readonly spendOrangeUseCase: SpendOrangeUseCase,
    private readonly giftCardBalanceService: GiftCardBalanceService,
  ) {}

  async execute(
    manager: EntityManager,
    input: PurchaseOrderPaymentUseCaseInput,
  ): Promise<PurchaseOrderPaymentUseCaseResponse> {
    const {
      paymentId,
      paymentProvider,
      paymentReferenceId,
      reference,
      userGiftCardId,
      resolvedGiftCardAmount,
    } = input;

    // ==========================================================
    // PAYMENT
    // ==========================================================

    const payment = await manager.findOne(Payment, {
      where: {
        id: paymentId,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    if (payment.transaction_id) {
      throw new ConflictException(
        'Payment already processed',
      );
    }

    // ==========================================================
    // STATUS COMPLETED
    // ==========================================================

    const completedStatus =
      await manager.findOne(TransactionState, {
        where: {
          code: StatusCode.COMPLETED,
        },
      });

    if (!completedStatus) {
      throw new ConflictException(
        'Completed status not found',
      );
    }

    // ==========================================================
    // SUPERADMIN WALLET
    // ==========================================================

    const superAdminWallet =
      await manager.findOne(Wallet, {
        where: {
          id: this.superadminConfig.getWalletId(),
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

    if (!superAdminWallet) {
      throw new InternalServerErrorException(
        'Superadmin wallet not found',
      );
    }

    // ==========================================================
    // TRANSACTION TYPE
    // ==========================================================

    const saleType = await manager.findOne(
      TransactionType,
      {
        where: {
          code: TransactionCode.SALE_BELAND,
        },
      },
    );

    if (!saleType) {
      throw new ConflictException(
        'SALE_BELAND type not found',
      );
    }

    const purchaseType = await manager.findOne(
      TransactionType,
      {
        where: {
          code: TransactionCode.PURCHASE_BELAND,
        },
      },
    );

    if (!purchaseType) {
      throw new ConflictException(
        'PURCHASE_BELAND type not found',
      );
    }

    let becoinOrangeUsed = 0;
    let message = "¡Exclente, pagaste tu orden!";
    let amountToDebit = Number(payment.amount_paid);
    let transaction: Transaction | undefined;

    // ==========================================================
    // GIFTCARD CONSUME
    // ==========================================================

    if (userGiftCardId) {
      let consumed_amount = 0;

      if (resolvedGiftCardAmount !== undefined) {
        consumed_amount = resolvedGiftCardAmount;
      } else {
        const result = await this.giftCardBalanceService.consumeDirect(
          manager,
          userGiftCardId,
          amountToDebit
        );
        consumed_amount = result.consumed_amount;
      }
      
      amountToDebit -= consumed_amount;
      
      if (consumed_amount > 0) {
        payment.gift_card_amount_used = consumed_amount;
        payment.user_gift_card_id = userGiftCardId;
      }
    }

    // ==========================================================
    // INTERNAL WALLET DEBIT
    // ==========================================================

    if (paymentProvider === PaymentProviderEnum.WALLET && amountToDebit > 0) {
      const userWallet = await manager.findOne(Wallet, {
        where: {
          user_id: payment.user_id,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!userWallet) {
        throw new NotFoundException('User wallet not found');
      }

      // === LÓGICA DE ORANGE ===
      if (Number(userWallet.becoin_orange) > 0) {
        const items = await manager.find(OrderItem, {
          where: [
            { order_id: payment.order_id, user_id: payment.user_id },
          ],
          relations: { product: true },
        });

        let profit = 0;
        for (const item of items) {
          if (item.product) {
            profit += Number(item.product.price) - Number(item.product.cost);
          }
        }

        if (profit > 0) {
          const priceOneBecoin = Number(this.superadminConfig.getPriceOneBecoin());
          const profitBecoin = profit / priceOneBecoin;

          // Porcentaje máximo de la ganancia que puede ser cubierto con Orange (configurable)
          const maxDiscountPercent = Number(this.superadminConfig.getMaxOrangeDiscountPercent());
          const maxRecoverable = Math.floor(profitBecoin * maxDiscountPercent);

          if (maxRecoverable > 0) {
            becoinOrangeUsed = Math.min(
              Math.floor(Number(userWallet.becoin_orange)),
              maxRecoverable,
            );

            if (becoinOrangeUsed > 0) {
              // Llamada al dominio Orange para consumir el saldo (sin generar USD)
              // La atomicidad se mantiene al compartir el manager
              await this.spendOrangeUseCase.execute(manager, userWallet.id, becoinOrangeUsed, message, paymentReferenceId);

              // Reducimos el monto a debitar de la wallet y del superadmin.
              // NO modificamos payment.amount_paid para que la orden registre el valor completo.
              const discountUsd = Number(becoinOrangeUsed) * priceOneBecoin;
              amountToDebit -= discountUsd;

              // Mensajes
              if (becoinOrangeUsed === maxRecoverable) {
                message =
                  `💙 En Beland cuidamos tu dinero: Aplicamos ${becoinOrangeUsed} BeCoin Naranjas. Seguis recuperando las comiciones que te cobraron las plataformas de recargas.`;
              } else {
                message = '💙 En Beland cuidamos tu dinero: aplicamos tus BeCoin Naranjas recuperaste todo lo que te cobraron las plataformas de recarga.';
              }
            }
          }
        }
      }

      // === FIN LÓGICA DE ORANGE ===

      await this.walletPaymentService.processPayment(
        manager,
        userWallet.id,
        amountToDebit,
        {
          type_id: purchaseType.id,
          status_id: completedStatus.id,
          reference: reference ?? `ORDER-${payment.order_id}`,
          external_provider: paymentProvider,
          external_reference_id: paymentReferenceId,
        }
      );
    }

    // ==========================================================
    // CREDIT SUPERADMIN & TRANSACTION
    // ==========================================================

    if (amountToDebit > 0) {
      superAdminWallet.usd_balance =
        Number(superAdminWallet.usd_balance) + amountToDebit;

      await manager.save(
        Wallet,
        superAdminWallet,
      );

      transaction = await manager.save(
        Transaction,
        {
          wallet_id: superAdminWallet.id,
          type_id: saleType.id,
          status_id: completedStatus.id,
          amount_usd: amountToDebit,
          post_balance: Number(superAdminWallet.usd_balance),
          reference: reference ?? `ORDER-${payment.order_id}`,
          external_provider: paymentProvider,
          external_reference_id: paymentReferenceId,
        },
      );
    }

    // ==========================================================
    // PAYMENT COMPLETED
    // ==========================================================

    if (transaction) {
      payment.transaction_id = transaction.id;
    }

    payment.status_id =
      completedStatus.id;

    await manager.save(
      Payment,
      payment,
    );

    // ==========================================================
    // ORDER
    // ==========================================================

    const order = await manager.findOne(
      Order,
      {
        where: {
          id: payment.order_id,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      },
    );

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    const completedPayments =
      await manager.find(Payment, {
        where: {
          order_id: order.id,
          status_id:
            completedStatus.id,
        },
      });

      // Sumamos los montos autorizados originalmente en los pagos, encapsulando el descuento.
      const totalOrderPaid =
        completedPayments.reduce(
          (sum, current) =>
            sum +
            Number(current.amount_paid),
          0,
        );

    order.total_amount_paied =
      Number(totalOrderPaid);

    if (
      totalOrderPaid >=
      Number(order.total_amount)
    ) {
      order.paied = true;
    }

    await manager.save(Order, order);

    return {
      paymentId: payment.id,

      orderId: order.id,

      transactionId: transaction?.id,

      totalOrderPaid,

      orderPaid:
        order.paied ?? false,

      message,
      
      becoinOrangeUsed,
    };
  }
}
