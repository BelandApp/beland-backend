import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserWithdraw } from './entities/user-withdraw.entity';
import { UserWithdrawsRepository } from './user-withdraw.repository';
import { WithdrawDto, WithdrawResponseDto } from './dto/withdraw.dto';
import { Wallet } from '../wallets/entities/wallet.entity';
import { DataSource } from 'typeorm';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../transactions/enum/transaction-code';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { StatusCode } from '../transaction-state/enum/status.enum';

@Injectable()
export class UserWithdrawsService {
  private readonly completeMessage = 'el retiro del usuario';

  constructor(
    private readonly repository: UserWithdrawsRepository,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
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

  async create(
    body: Partial<UserWithdraw>,
  ): Promise<UserWithdraw> {
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

  async update(id: string, body: Partial<UserWithdraw>) {
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

  // LOGICA PARA RECARGAS
  async withdraw(
    user_id: string,
    dto: WithdrawDto,
  ): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1) Buscar la wallet del usuario
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id },
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');

      // 2) Verificar saldo suficiente
      if (+wallet.becoin_balance < +dto.amountBecoin)
        throw new BadRequestException('Saldo insuficiente');

      // 3) Obtener tipo de transacción 'WITHDRAW'
      const type = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.WITHDRAW },
      });
      if (!type)
        throw new ConflictException(
          'No se encuentra el tipo ',
          TransactionCode.WITHDRAW,
        );

      // 4) Obtener estado 'PENDING'
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.PENDING);

      // 5) Reservar fondos: debitar del saldo disponible y aumentar el saldo bloqueado
      wallet.becoin_balance = +wallet.becoin_balance - +dto.amountBecoin;
      wallet.locked_balance = (wallet.locked_balance ?? 0) + +dto.amountBecoin;
      const walletUpdated = await queryRunner.manager.save(wallet);

      // 6) Registrar la transacción
      const tx = await queryRunner.manager.save(Transaction, {
        wallet_id: wallet.id,
        type,
        status,
        amount_becoin: -dto.amountBecoin,
        post_balance: wallet.becoin_balance,
      });

      // 7) Registrar la solicitud de retiro del usuario
      await queryRunner.manager.save(UserWithdraw, {
        user_id,
        wallet_id: wallet.id,
        withdraw_account_id: dto.withdraw_account_id,
        amount_becoin: +dto.amountBecoin,
        amount_usd: +dto.amountBecoin * +this.superadminConfig.getPriceOneBecoin(),
        status_id: status.id,
        transaction_id: tx.id,
      });

      // ✅ Confirmo la transacción
      await queryRunner.commitTransaction();

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
      // 0) Buscar el retiro del usuario
      const userWithdraw = await queryRunner.manager.findOne(UserWithdraw, {
        where: { id: user_withdraw_id },
      });
      if (!userWithdraw)
        throw new NotFoundException('No se encuentra el retiro del usuario');

      // 1) Buscar la wallet del usuario
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: userWithdraw.user_id },
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');

      // 2) Busco el registro de la transacción
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: userWithdraw.transaction_id },
      });
      if (!transaction)
        throw new ConflictException(
          'No se encuentra la transaccion del retiro',
        );

      // 3) Obtener estado 'FAILED'
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.FAILED },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.FAILED);

      // 4) Regresar fondos: acreditar el saldo y descontar del saldo bloqueado
      wallet.becoin_balance =
        +wallet.becoin_balance + +userWithdraw.amount_becoin;
      wallet.locked_balance =
        +wallet.locked_balance - +userWithdraw.amount_becoin;
      const walletUpdated = await queryRunner.manager.save(wallet);

      // 5) actualizo la transacción a estado FAILED
      transaction.status_id = status.id;
      transaction.reference = reference;
      await queryRunner.manager.save(transaction);

      // 6) actualizo el retiro de usuario a estado FAILED
      userWithdraw.status_id = status.id;
      userWithdraw.observation = observation ?? '';
      userWithdraw.transaction_banck_id = reference ?? '';;
      await queryRunner.manager.save(userWithdraw);

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
      // 0) Buscar el retiro del usuario
      const userWithdraw = await queryRunner.manager.findOne(UserWithdraw, {
        where: { id: user_withdraw_id },
      });
      if (!userWithdraw)
        throw new NotFoundException('No se encuentra el retiro del usuario');

      // 1) Buscar la wallet del usuario
      const userWallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id: userWithdraw.user_id },
      });
      if (!userWallet)
        throw new NotFoundException('No se encuentra la billetera del usuario');

      // 2) Busco el registro de la transacción
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: userWithdraw.transaction_id },
      });
      if (!transaction)
        throw new ConflictException(
          'No se encuentra la transaccion del retiro',
        );

      // 3) Obtener estado 'COMPLETED'
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado ", StatusCode.COMPLETED );

      // 4) Descuento Definitivo: Descontar del saldo bloqueado
      userWallet.locked_balance =
        +userWallet.locked_balance - +userWithdraw.amount_becoin;
      await queryRunner.manager.save(userWallet);

      // 5) actualizo la transacción a estado COMPLETED
      transaction.status_id = status.id;
      transaction.reference= reference ?? '';
      await queryRunner.manager.save(transaction);

      // 6) actualizo el retiro de usuario a estado COMPLETED
      userWithdraw.status_id = status.id;
      userWithdraw.observation = observation ?? '';
      userWithdraw.transaction_banck_id = reference ?? '';
      await queryRunner.manager.save(userWithdraw);

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
