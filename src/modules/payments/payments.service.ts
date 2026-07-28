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
import { PurchaseOrderPaymentUseCase } from '../wallets/use-cases/purchase-order-payment.use-case';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
import { PayphoneOrderDto } from './dto/payphone-order.dto';
import { TransferOrderDto } from './dto/transfer-order.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentsService {
  private readonly completeMessage = 'el pago';

  constructor(private readonly repository: PaymentsRepository,
    private readonly dataSource: DataSource,
    private readonly superadminService: SuperadminConfigService,
    private readonly purchaseOrderPaymentUseCase: PurchaseOrderPaymentUseCase
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

  async payNow(payment_id: string, userGiftCardId?: string): Promise<{payment: Payment, message:string, becoinOrangeUsed:number}> {
    return await this.dataSource.transaction(async (manager) => {
      // === INVOCAR CASO DE USO PARA LA LÓGICA FINANCIERA CORE ===
      const useCaseResponse = await this.purchaseOrderPaymentUseCase.execute(manager, {
        paymentId: payment_id,
        paymentProvider: PaymentProviderEnum.WALLET,
        paymentReferenceId: payment_id,
        userGiftCardId,
      });

      // Recargar el pago para devolverlo actualizado en la respuesta
      const updatedPayment = await manager.findOne(Payment, {
        where: { id: payment_id },
        relations: { status: true }
      });

      return { 
        payment: updatedPayment, 
        message: useCaseResponse.message || "¡Exclente, pagaste tu orden!", 
        becoinOrangeUsed: useCaseResponse.becoinOrangeUsed || 0 
      };
    });
  }

  async payWithPayphone(payment_id: string, dto: PayphoneOrderDto) {
    const execute = async (m: EntityManager) => {
      const response = await this.purchaseOrderPaymentUseCase.execute(m, {
        paymentId: payment_id,
        paymentProvider: PaymentProviderEnum.PAYPHONE,
        paymentReferenceId: String(dto.paymentReferenceId),
        reference: dto.referenceCode,
        userGiftCardId: dto.userGiftCardId,
      });
      return response;
    };

    try {
      return await this.dataSource.transaction(async (m) => {
        return await execute(m);
      });
    } catch (error) {
      if (this.isClientTransactionDuplicateError(error)) {
        throw new ConflictException(
          'La transacción de Payphone ya fue procesada anteriormente.',
        );
      }
      throw error;
    }
  }

  async payWithTransfer(payment_id: string, dto: TransferOrderDto) {
    const execute = async (m: EntityManager) => {
      const response = await this.purchaseOrderPaymentUseCase.execute(m, {
        paymentId: payment_id,
        paymentProvider: PaymentProviderEnum.TRANSFER,
        paymentReferenceId: String(dto.paymentReferenceId),
        reference: dto.referenceCode,
      });
      return response;
    };

    try {
      return await this.dataSource.transaction(async (m) => {
        return await execute(m);
      });
    } catch (error) {
      if (this.isClientTransactionDuplicateError(error)) {
        throw new ConflictException(
          'La transacción de Transferencia Bancaria ya fue procesada anteriormente.',
        );
      }
      throw error;
    }
  }

  private isClientTransactionDuplicateError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const queryError = error as {
      code?: string;
      constraint?: string;
      driverError?: { code?: string; constraint?: string };
    };

    const constraintName = 'IDX_transactions_client_transaction_id_unique';

    return (
      queryError.code === '23505' &&
      (queryError.constraint === constraintName ||
        queryError.driverError?.constraint === constraintName)
    );
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
