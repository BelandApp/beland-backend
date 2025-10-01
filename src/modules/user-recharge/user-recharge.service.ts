import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRechargeRepository } from './user-recharge.repository';
import { RechargeTransfer } from './entities/user-recharge.entity';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { DataSource } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionCode } from '../transactions/enum/transaction-code';
import { Wallet } from '../wallets/entities/wallet.entity';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';

@Injectable()
export class UserRechargeService {
  private readonly completeMessage = 'la recarga por transferencia';

  constructor(
    private readonly repository: UserRechargeRepository,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
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

      const transaction = await queryRunner.manager.save (Transaction, {
        wallet_id: wallet.id,
        type_id: type.id,
        status_id: status.id,
        amount_becoin: +dto.amount_usd / +this.superadminConfig.getPriceOneBecoin(),
        post_balance: +wallet.becoin_balance,
        reference: dto.transfer_id,
      });

      const rechargeTransferCreated = queryRunner.manager.create(RechargeTransfer, {
        user_id,
        status_id:status.id,
        amount_usd: dto.amount_usd,
        payment_account_id: dto.payment_account_id,
        transfer_id: dto.transfer_id,
        transaction_id: transaction.id,
      })
      const rechargeTransfer = await queryRunner.manager.save(rechargeTransferCreated);
    
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
        where: {id: rechargeTransferId}
      })
      if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');

      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: {user_id : rechargeTransfer.user_id}
      });
      if (!wallet) throw new NotFoundException('No se encontro la Billetera del usuario');

      rechargeTransfer.status_id = status.id;
      await queryRunner.manager.save(rechargeTransfer);

      wallet.becoin_balance= +wallet.becoin_balance + rechargeTransfer.amount_usd/ +this.superadminConfig.getPriceOneBecoin()
      await queryRunner.manager.save(wallet);

      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: {id: rechargeTransfer.transaction_id}
      })
      if (!transaction) throw new NotFoundException('No se encontro la transaccion de la recarga');
      transaction.status_id= status.id;
      transaction.post_balance= +wallet.becoin_balance;
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
        where: {id: rechargeTransferId}
      })
      if (!rechargeTransfer) throw new NotFoundException('No se encontro la recarga por transferencia');

      rechargeTransfer.status_id = status.id;
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
