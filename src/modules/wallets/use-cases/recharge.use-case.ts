import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Wallet } from '../../wallets/entities/wallet.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { SuperadminConfigService } from '../../superadmin-config/superadmin-config.service';
import { TransactionCode } from '../../transaction-type/enum/transaction-code';
import { RechargeDto, RechargeResponseDto } from '../dto/recharge.dto';


@Injectable()
export class RechargeUseCase {
  constructor(
    private readonly superadminConfig: SuperadminConfigService,
  ) {}

  async execute(
    manager: EntityManager, input: RechargeDto,
  ): Promise<RechargeResponseDto> {
    const {
      walletId,
      amountUsd,
      paymentProvider,
      paymentReferenceId,
      referenceCode,
    } = input;

    if (amountUsd <= 0) {
      throw new BadRequestException(
        'El monto de recarga debe ser mayor a cero',
      );
    }

    // Wallet
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException(
        'No se encuentra la billetera',
      );
    }

    const previousBalance = Number(wallet.usd_balance);

    // Tipo RECHARGE
    const rechargeType = await manager.findOne(
      TransactionType,
      {
        where: {
          code: TransactionCode.RECHARGE,
        },
      },
    );

    if (!rechargeType) {
      throw new ConflictException(
        `No existe ${TransactionCode.RECHARGE}`,
      );
    }

    // Tipo ORANGE
    const orangeType = await manager.findOne(
      TransactionType,
      {
        where: {
          code: TransactionCode.ORANGE_CREDIT,
        },
      },
    );

    if (!orangeType) {
      throw new ConflictException(
        `No existe ${TransactionCode.ORANGE_CREDIT}`,
      );
    }

    // Estado
    const completedStatus = await manager.findOne(
      TransactionState,
      {
        where: {
          code: 'COMPLETED',
        },
      },
    );

    if (!completedStatus) {
      throw new ConflictException(
        'No existe el estado COMPLETED',
      );
    }

    // Acredito USD
    wallet.usd_balance =
      previousBalance + Number(amountUsd);

    await manager.save(wallet);

    // Transacción principal
    const rechargeTransaction =
      await manager.save(Transaction, {
        wallet_id: wallet.id,
        type_id: rechargeType.id,
        status_id: completedStatus.id,
        amount_usd: amountUsd,
        post_balance: wallet.usd_balance,
        referenceCode,
        external_provider: paymentProvider,
        external_reference_id: paymentReferenceId,
      });

    let orangeTransactionId: string | undefined;

    // Comisión Orange
    const commissionPercent =
      this.superadminConfig.getRechargeCommission(
        paymentProvider,
      );

    if (commissionPercent > 0) {
      const priceOneBecoin =
        Number(
          this.superadminConfig.getPriceOneBecoin(),
        );

      const totalBeCoins = Math.floor(
        amountUsd / priceOneBecoin,
      );

      const orangeFee = Math.floor(
        totalBeCoins * commissionPercent,
      );

      if (orangeFee > 0) {
        wallet.becoin_orange =
          Number(wallet.becoin_orange) +
          orangeFee;

        await manager.save(wallet);

        const orangeTransaction =
          await manager.save(Transaction, {
            wallet_id: wallet.id,
            type_id: orangeType.id,
            status_id: completedStatus.id,
            amount_usd: orangeFee * priceOneBecoin,
            post_balance: wallet.becoin_orange,
            referenceCode,
            external_provider: paymentProvider,
            external_reference_id: paymentReferenceId,
          });
        orangeTransactionId =
          orangeTransaction.id;
      }
    }

    return {
        walletId: wallet.id,
        amountUsd,
        usdBalance: Number(wallet.usd_balance),
        becoinOrangeBalance: Number(wallet.becoin_orange),
        rechargeTransactionId: rechargeTransaction.id,
        orangeTransactionId,
        };
  }
}