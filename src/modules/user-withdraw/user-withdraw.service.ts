import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserWithdraw } from './entities/user-withdraw.entity';
import { UserWithdrawsRepository } from './user-withdraw.repository';
import { WithdrawDto, WithdrawResponseDto } from './dto/withdraw.dto';
import { Wallet } from '../wallets/entities/wallet.entity';
import { DataSource } from 'typeorm';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../transaction-type/enum/transaction-code';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { EmailService } from '../email/email.service';
import {
  superadminNotificationEmailSubject,
  superadminNotificationEmailTemplate,
} from '../email/plantilla/htmlNotificacionSuperadmin';
import { User } from '../users/entities/users.entity';
import { WithdrawAccount } from '../withdraw-account/entities/withdraw-account.entity';
import { CreateWithdrawRequestUseCase } from './use-cases/create-withdraw-request.use-case';
import { CompleteWithdrawUseCase } from './use-cases/complete-withdraw.use-case';
import { FailWithdrawUseCase } from './use-cases/fail-withdraw.use-case';

@Injectable()
export class UserWithdrawsService {
  private readonly completeMessage = 'el retiro del usuario';
  private readonly logger = new Logger(UserWithdrawsService.name);

  constructor(
    private readonly repository: UserWithdrawsRepository,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly emailService: EmailService,
    private readonly createWithdrawRequestUseCase: CreateWithdrawRequestUseCase,
    private readonly completeWithdrawUseCase: CompleteWithdrawUseCase,
    private readonly failWithdrawUseCase: FailWithdrawUseCase,
  ) {}

  async findAll(
    status_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[UserWithdraw[], number]> {
    try {
      const response = await this.repository.findAll(
        status_id,
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
    status_id: string,
    account_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[UserWithdraw[], number]> {
    try {
      const response = await this.repository.findAllUser(
        user_id,
        status_id,
        account_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<UserWithdraw> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendSuperadminWithdrawEmail(
    userWithdraw: UserWithdraw,
  ): Promise<void> {
    try {
      const superadminEmail = this.superadminConfig.getEmail();

      if (!superadminEmail) {
        this.logger.warn(
          `No se envio email de retiro ${userWithdraw.id}: email de superadmin no configurado`,
        );
        return;
      }

      const [user, withdrawAccount] = await Promise.all([
        this.dataSource.manager.findOne(User, {
          where: { id: userWithdraw.user_id },
        }),
        this.dataSource.manager.findOne(WithdrawAccount, {
          where: { id: userWithdraw.withdraw_account_id },
          relations: { withdraw_account_type: true },
        }),
      ]);

      const accountReference =
        withdrawAccount?.alias ||
        withdrawAccount?.cbu ||
        withdrawAccount?.accountNumber ||
        withdrawAccount?.id;

      const subject = superadminNotificationEmailSubject('WITHDRAWAL_REQUEST');
      const html = superadminNotificationEmailTemplate({
        type: 'WITHDRAWAL_REQUEST',
        amount: Number(userWithdraw.amount_usd),
        currency: withdrawAccount?.currency || 'USD',
        userName: user?.full_name,
        userEmail: user?.email,
        operationId: userWithdraw.id,
        reference: `WITHDRAW-${userWithdraw.id}`,
        status: 'PENDIENTE',
        paymentMethod: withdrawAccount?.bankName,
        createdAt: userWithdraw.created_at,
        details: {
          'Monto BeCoin': Number(userWithdraw.amount_usd)/this.superadminConfig.getPriceOneBecoin(),
          'Cuenta destino': accountReference,
          'Banco': withdrawAccount?.bankName,
          'Tipo de cuenta': withdrawAccount?.withdraw_account_type?.name,
          'Titular': withdrawAccount?.holderName,
          'Documento': withdrawAccount?.holderDocument,
          'Transaccion': userWithdraw.transaction_id,
        },
      });

      await this.emailService.sendMail({
        to: superadminEmail,
        subject,
        text: `Nueva solicitud de retiro en Beland. Retiro: ${userWithdraw.id}. Monto: ${userWithdraw.amount_usd}.`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `No se pudo enviar email de retiro al superadmin: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  // LOGICA PARA RECARGAS
  async withdraw(
    user_id: string,
    dto: WithdrawDto,
  ): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { walletUpdated, userWithdraw } =
        await this.createWithdrawRequestUseCase.execute(
          user_id,
          dto,
          queryRunner.manager,
        );

      // ✅ Confirmo la transacción
      await queryRunner.commitTransaction();

      await this.sendSuperadminWithdrawEmail(userWithdraw);

      // 8) Retornar la wallet actualizada
      return walletUpdated;
    } catch (error) {
      // ❌ Deshago todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cierro el queryRunner
      await queryRunner.release();
    }
  }

  async withdrawFailed(dto: WithdrawResponseDto): Promise<UserWithdraw> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { user_withdraw_id, observation, reference } = dto;
    try {
      const userWithdraw = await this.failWithdrawUseCase.execute(
        dto,
        queryRunner.manager,
      );

      // ✅ Confirmo la transacción
      await queryRunner.commitTransaction();

      // 7) Retornar la wallet actualizada
      return userWithdraw;
    } catch (error) {
      // ❌ Deshago todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cierro el queryRunner
      await queryRunner.release();
    }
  }

  async withdrawCompleted(dto: WithdrawResponseDto): Promise <UserWithdraw> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { user_withdraw_id, observation, reference } = dto;
    try {
      const userWithdraw = await this.completeWithdrawUseCase.execute(
        dto,
        queryRunner.manager,
      );

      // ✅ Confirmo la transacción
      await queryRunner.commitTransaction();

      // 9) Retornar la wallet actualizada del usuario
      return userWithdraw;
    } catch (error) {
      // ❌ Deshago todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cierro el queryRunner
      await queryRunner.release();
    }
  }
  // FIN DE LOGICA PARA RECARGAS
}
