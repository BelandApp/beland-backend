import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Payment } from 'src/modules/payments/entities/payment.entity'; 
import { Order } from 'src/modules/orders/entities/order.entity'; 

import { Wallet } from 'src/modules/wallets/entities/wallet.entity';

import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';

import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';

import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';

import { PaymentProviderEnum } from 'src/modules/transactions/enums/transaction.enums';

export interface PurchaseOrderPaymentUseCaseInput {
  paymentId: string;

  paymentProvider: PaymentProviderEnum;

  paymentReferenceId: string;

  reference?: string;
}

export interface PurchaseOrderPaymentUseCaseResponse {
  paymentId: string;

  orderId: string;

  transactionId: string;

  totalOrderPaid: number;

  orderPaid: boolean;
}

@Injectable()
export class PurchaseOrderPaymentUseCase {
  constructor(
    private readonly superadminConfig: SuperadminConfigService,
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
    } = input;

    // ==========================================================
    // PAYMENT
    // ==========================================================

    const payment = await manager.findOne(Payment, {
      where: {
        id: paymentId,
      },
      relations: {
        order: true,
        status: true,
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

    // ==========================================================
    // CREDIT SUPERADMIN
    // ==========================================================

    superAdminWallet.usd_balance =
      Number(superAdminWallet.usd_balance) +
      Number(payment.amount_paid);

    await manager.save(
      Wallet,
      superAdminWallet,
    );

    // ==========================================================
    // TRANSACTION
    // ==========================================================

    const transaction = await manager.save(
      Transaction,
      {
        wallet_id: superAdminWallet.id,

        type_id: saleType.id,

        status_id: completedStatus.id,

        amount_usd: Number(payment.amount_paid),

        post_balance:
          superAdminWallet.usd_balance,

        reference:
          reference ??
          `PAYMENT-${payment.id}`,

        external_provider:
          paymentProvider,

        external_reference_id:
          paymentReferenceId,
      },
    );

    // ==========================================================
    // PAYMENT COMPLETED
    // ==========================================================

    payment.transaction_id =
      transaction.id;

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

    const totalOrderPaid =
      completedPayments.reduce(
        (sum, current) =>
          sum +
          Number(current.amount_paid),
        0,
      );

    order.total_amount_paied =
      totalOrderPaid;

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

      transactionId:
        transaction.id,

      totalOrderPaid,

      orderPaid:
        order.paied ?? false,
    };
  }
}