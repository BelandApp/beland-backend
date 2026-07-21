import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRechargeRepository } from './user-recharge.repository';
import { RechargeTransfer } from './entities/user-recharge.entity';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { RechargeUseCase } from '../wallets/use-cases/recharge.use-case';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { DataSource } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../transaction-type/enum/transaction-code';
import { Wallet } from '../wallets/entities/wallet.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { EmailService } from '../email/email.service';
import {
  superadminNotificationEmailSubject,
  superadminNotificationEmailTemplate,
} from '../email/plantilla/htmlNotificacionSuperadmin';
import { User } from '../users/entities/users.entity';
import { PaymentAccount } from '../payout-account/entities/payment-account.entity';

import { RequestTransferRechargeUseCase } from './use-cases/request-transfer-recharge.use-case';
import { RejectTransferRechargeUseCase } from './use-cases/reject-transfer-recharge.use-case';
import { CompleteTransferRechargeUseCase } from './use-cases/complete-transfer-recharge.use-case';

@Injectable()
export class UserRechargeService {
  private readonly completeMessage = 'la recarga por transferencia';
  private readonly logger = new Logger(UserRechargeService.name);

  constructor(
    private readonly repository: UserRechargeRepository,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly emailService: EmailService,
    private readonly requestTransferRechargeUseCase: RequestTransferRechargeUseCase,
    private readonly rejectTransferRechargeUseCase: RejectTransferRechargeUseCase,
    private readonly completeTransferRechargeUseCase: CompleteTransferRechargeUseCase,
  ) {}

  async findAll(
    pageNumber: number,
    limitNumber: number,
    status_id?: string,
  ): Promise<[RechargeTransfer[], number]> {
    try {
      const response = await this.repository.findAll(
        pageNumber,
        limitNumber,
        status_id,

      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<RechargeTransfer> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendSuperadminRechargeTransferEmail(
    rechargeTransfer: RechargeTransfer,
  ): Promise<void> {
    try {
      const superadminEmail = this.superadminConfig.getEmail();

      if (!superadminEmail) {
        this.logger.warn(
          `No se envio email de recarga ${rechargeTransfer.id}: email de superadmin no configurado`,
        );
        return;
      }

      const [user, paymentAccount] = await Promise.all([
        this.dataSource.manager.findOne(User, {
          where: { id: rechargeTransfer.user_id },
        }),
        this.dataSource.manager.findOne(PaymentAccount, {
          where: { id: rechargeTransfer.payment_account_id },
        }),
      ]);

      const accountReference =
        paymentAccount?.alias ||
        paymentAccount?.cbu ||
        paymentAccount?.nro_account ||
        paymentAccount?.email ||
        paymentAccount?.id;

      const becoinAmount =
        Number(rechargeTransfer.amount_usd) /
        Number(this.superadminConfig.getPriceOneBecoin());

      const subject = superadminNotificationEmailSubject('TRANSFER_RECHARGE');
      const html = superadminNotificationEmailTemplate({
        type: 'TRANSFER_RECHARGE',
        amount: Number(rechargeTransfer.amount_usd),
        currency: 'USD',
        userName: user?.full_name,
        userEmail: user?.email,
        operationId: rechargeTransfer.id,
        reference: rechargeTransfer.transfer_id,
        status: 'PENDIENTE',
        paymentMethod: paymentAccount?.bank || paymentAccount?.name,
        createdAt: rechargeTransfer.created_at,
        description:
          'Un usuario reporto una transferencia bancaria. Revisar comprobante y acreditar saldo si corresponde.',
        details: {
          'BeCoin a acreditar': becoinAmount,
          'Cuenta receptora': paymentAccount?.name,
          'Banco': paymentAccount?.bank,
          'Titular': paymentAccount?.accountHolder,
          'Cuenta/Alias/CBU': accountReference,
          'Comprobante': rechargeTransfer.ticket_image_url,
          'Transaccion': rechargeTransfer.transaction_id,
        },
      });

      await this.emailService.sendMail({
        to: superadminEmail,
        subject,
        text: `Nueva recarga por transferencia en Beland. Recarga: ${rechargeTransfer.id}. Monto: ${rechargeTransfer.amount_usd}. Debe acreditarse saldo si la transferencia es valida.`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `No se pudo enviar email de recarga al superadmin: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async rechargeTransfer (user_id: string, dto: Partial<RechargeTransfer>): Promise<RechargeTransfer> {
    const rechargeTransfer = await this.dataSource.transaction(async (manager) => {
      return await this.requestTransferRechargeUseCase.execute(manager, {
        user_id,
        amount_usd: Number(dto.amount_usd),
        payment_account_id: dto.payment_account_id,
        transfer_id: dto.transfer_id,
        ticket_image_url: dto.ticket_image_url,
      });
    });

    await this.sendSuperadminRechargeTransferEmail(rechargeTransfer);

    return rechargeTransfer;
  }

  async rechargeCompleted (rechargeTransferId: string): Promise<RechargeTransfer> {
    return await this.dataSource.transaction(async (manager) => {
      return await this.completeTransferRechargeUseCase.execute(manager, rechargeTransferId);
    });
  }

  async rechargeFailed (rechargeTransferId: string): Promise<RechargeTransfer> {
    return await this.dataSource.transaction(async (manager) => {
      return await this.rejectTransferRechargeUseCase.execute(manager, rechargeTransferId);
    });
  }

  async update(id: string, body: Partial<RechargeTransfer>) {
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
