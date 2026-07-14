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

@Injectable()
export class UserRechargeService {
  private readonly completeMessage = 'la recarga por transferencia';
  private readonly logger = new Logger(UserRechargeService.name);

  constructor(
    private readonly repository: UserRechargeRepository,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly emailService: EmailService,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.PENDING}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.PENDING)

      const type = await queryRunner.manager.findOne(TransactionType, {
        where: {code: TransactionCode.RECHARGE}
      });
      if (!type) throw new NotFoundException('No se encontro el Tipo de transaccion ', TransactionCode.RECHARGE)
      
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: {user_id}
      });
      if (!wallet) throw new NotFoundException('No se encontro la Billetera del usuario');

      if (Number(wallet.usd_balance)+Number(dto.amount_usd) > this.superadminConfig.recharge_limit) {
        throw new ConflictException("Solo puede tener para consumos futuros hasta 100 USD.");
      }

      const transaction = await queryRunner.manager.save (Transaction, {
        wallet_id: wallet.id,
        type: type,
        status: status,
        amount_usd: +dto.amount_usd,
        post_balance: +wallet.usd_balance,
        reference: dto.transfer_id,
      });

      const rechargeTransferCreated = queryRunner.manager.create(RechargeTransfer, {
        user_id,
        status:status,
        amount_usd: Number(dto.amount_usd),
        payment_account_id: dto.payment_account_id,
        transfer_id: dto.transfer_id,
        transaction: transaction,
        ticket_image_url: dto.ticket_image_url,
      })
      const rechargeTransfer = await queryRunner.manager.save(rechargeTransferCreated);
    
      await queryRunner.commitTransaction();

      await this.sendSuperadminRechargeTransferEmail(rechargeTransfer);

      return rechargeTransfer;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async rechargeCompleted (rechargeTransferId: string): Promise<RechargeTransfer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.COMPLETED}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.COMPLETED)

      const rechargeTransfer = await queryRunner.manager.findOne(RechargeTransfer, {
        where: {id: rechargeTransferId},
        relations: {status: true},
      })
      if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');
      if (rechargeTransfer.status.name === StatusCode.COMPLETED) throw new BadRequestException('La recarga ya esta en estado COMPLETADA.');
      if (rechargeTransfer.status.name === StatusCode.FAILED) throw new BadRequestException('La recarga ya fue registrada como FALLIDA.');

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: {user_id : rechargeTransfer.user_id},
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) throw new NotFoundException('No se encontro la Billetera del usuario');

      rechargeTransfer.status = status;
      await queryRunner.manager.save(rechargeTransfer);

      wallet.usd_balance= +wallet.usd_balance + Number(rechargeTransfer.amount_usd)
      await queryRunner.manager.save(wallet);

      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: rechargeTransfer.transaction_id}
      })
      if (!transaction) throw new NotFoundException('No se encontro la transaccion de la recarga');
      transaction.status_id= status.id;
      transaction.post_balance= +wallet.usd_balance;
      await queryRunner.manager.save(transaction);
    
      await queryRunner.commitTransaction();

      const check = await this.dataSource.getRepository(RechargeTransfer).findOne({
  where: { id: rechargeTransferId }
});

console.log('estado real DB:', check.status_id);

      return rechargeTransfer;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async rechargeFailed (rechargeTransferId: string): Promise<RechargeTransfer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.FAILED}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.FAILED)
    
      const rechargeTransfer = await queryRunner.manager.findOne(RechargeTransfer, {
        where: {id: rechargeTransferId},
        relations: {status: true}
      })
      if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');
      if (rechargeTransfer.status.name === StatusCode.COMPLETED) throw new BadRequestException('La recarga ya esta en estado COMPLETADA.');
      if (rechargeTransfer.status.name === StatusCode.FAILED) throw new BadRequestException('La recarga ya fue registrada como FALLIDA.');

      rechargeTransfer.status = status;
      await queryRunner.manager.save(rechargeTransfer);

      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: rechargeTransfer.transaction_id}
      })
      if (!transaction) throw new NotFoundException('No se encontro la transaccion de la recarga');
      transaction.status_id= status.id;
      await queryRunner.manager.save(transaction);
    
      await queryRunner.commitTransaction();

      return rechargeTransfer;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
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
