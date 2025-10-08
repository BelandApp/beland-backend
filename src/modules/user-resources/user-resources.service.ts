import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserResource } from './entities/user-resource.entity';
import { UserResourcesRepository } from './user-resources.repository';
import { DataSource } from 'typeorm';
import { TransferResource } from './entities/transfer-resource.entity';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { CreateTransferResourceDto } from './dto/create-transfer-resource.dto';

@Injectable()
export class UserResourcesService {
  private readonly completeMessage = 'el recurso del usuario';

  constructor(
    private readonly repository: UserResourcesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    user_id: string,
    resource_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[UserResource[], number]> {
    try {
      const response = await this.repository.findAll(
        user_id,
        resource_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<UserResource> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<UserResource>): Promise<UserResource> {
    try {
      const res = await this.repository.create({
        ...body
      });
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<UserResource>) {
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

  async purchase () {} // TRAERLO DE WALLET

  async purchaseByTransfer (user_id:string, dto: CreateTransferResourceDto): Promise <TransferResource> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.PENDING}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.PENDING)

      const transferResourceCreated = queryRunner.manager.create(TransferResource, {
        user_id,
        status_id:status.id,
        amount_usd: +dto.amount_resource_usd * +dto.quantity,
        payment_account_id: dto.payment_account_id,
        transfer_id: dto.transfer_id,
        holder: dto.holder,
        quantity: dto.quantity,
        resource_id: dto.resource_id,
      })
      const transferResource = await queryRunner.manager.save(transferResourceCreated);
    
      await queryRunner.commitTransaction();

      return transferResource;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async transferCompleted (transferResourceId: string): Promise<TransferResource> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.COMPLETED}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.COMPLETED)

      const trasferResource = await queryRunner.manager.findOne(TransferResource, {
        where: {id: transferResourceId}
      })
      if (!trasferResource) throw new NotFoundException('No se encontro la transferencia del recurso');

      trasferResource.status_id = status.id;
      await queryRunner.manager.save(trasferResource);

      await queryRunner.manager.save(UserResource, {
        user_id: trasferResource.user_id,
        resource_id: trasferResource.resource_id,
        quantity: trasferResource.quantity,
      });
    
      await queryRunner.commitTransaction();

      return trasferResource;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async transferFailed (transferResourceId: string): Promise<TransferResource> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: {code: StatusCode.FAILED}
      });
      if (!status) throw new NotFoundException('No se encontro el estado de transaccion ', StatusCode.FAILED)
    
      const transferResource = await queryRunner.manager.findOne(TransferResource, {
        where: {id: transferResourceId}
      })
      if (!transferResource) throw new NotFoundException('No se encontro la transferencia del recurso');

      transferResource.status_id = status.id;
      await queryRunner.manager.save(transferResource);
    
      await queryRunner.commitTransaction();

      return transferResource;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async findAllCommerceTransfer (
    user_id: string,
    pageNumber: number,
    limitNumber: number,
    status_id?: string,
  ): Promise<[TransferResource[], number]> {
    try {
      const response = await this.repository.findAllCommerceTransfer(
        user_id,
        pageNumber,
        limitNumber,
        status_id,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllUserTransfer (
    user_id: string,
    pageNumber: number,
    limitNumber: number,
    status_id?: string,
  ): Promise<[TransferResource[], number]> {
    try {
      const response = await this.repository.findAllCommerceTransfer(
        user_id,
        pageNumber,
        limitNumber,
        status_id,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
