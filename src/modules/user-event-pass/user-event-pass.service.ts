import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEventPassRepository } from './user-event-pass.repository';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassFiltersDto } from './dto/user-eventpass-filters.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { PurchaseWhitRechargeDto } from './dto/purchaseWhitRecarge.dto';
import { TransferEventPassDto } from './dto/transfer-eventpass.dto';
import { PurchaseEventPassUseCase } from '../wallets/use-cases/purchase-eventpass.use-case';
import { RefundEventPassUseCase } from '../wallets/use-cases/refund-eventpass.use-case';
import { ConsumeEventPassUseCase } from './use-cases/consume-eventpass.use-case';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
import { EventPass } from '../event-pass/entities/event-pass.entity';
import { GroupMember } from '../group-members/entities/group-member.entity';
import { RoleGroupEnum } from '../group-members/enums/role-group.enum';

@Injectable()
export class UserEventPassService {
  constructor(
    private readonly repository: UserEventPassRepository,
    private readonly dataSource: DataSource,
    private readonly purchaseEventPassUseCase: PurchaseEventPassUseCase,
    private readonly refundEventPassUseCase: RefundEventPassUseCase,
    private readonly consumeEventPassUseCase: ConsumeEventPassUseCase,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(page: number, limit: number, filters?: UserEventPassFiltersDto): Promise<RespGetArrayDto<UserEventPass>> {
    return this.repository.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<UserEventPass> {
    const userPass = await this.repository.findOne(id);
    if (!userPass) throw new NotFoundException('Entrada no encontrada.');
    return userPass;
  }

  private async assignGroupMember(manager: import('typeorm').EntityManager, eventPassId: string, userId: string) {
    const event = await manager.findOne(EventPass, { where: { id: eventPassId }, relations: ['group'] });
    if (event && event.group) {
      const groupMembersRepo = manager.getRepository(GroupMember);
      const newMember = groupMembersRepo.create({
        group_id: event.group.id,
        user_id: userId,
        role: RoleGroupEnum.MEMBER
      });
      await groupMembersRepo.save(newMember);
    }
  }

  async purchaseEventPass(
    userId: string,
    eventPassId: string,
    holderName: string,
    holderInstagramTiktok: string,
    holderPhone?: string,
    holderEmail?: string,
  ): Promise<UserEventPass> {
    return await this.dataSource.transaction(async (manager) => {
      const savedPass = await this.purchaseEventPassUseCase.execute(manager, {
        eventPassId,
        userId,
        paymentProvider: PaymentProviderEnum.WALLET,
        paymentReferenceId: eventPassId,
        holderName,
        holderInstagramTiktok,
        holderPhone,
        holderEmail,
        reference: 'EVENTPASS -' + eventPassId,
      });

      await this.assignGroupMember(manager, eventPassId, userId);

      return savedPass;
    });
  }

  async purchaseEventPassWhitRecharge(
    userId: string,
    dto: PurchaseWhitRechargeDto,
  ): Promise<UserEventPass> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const savedPass = await this.purchaseEventPassUseCase.execute(manager, {
          eventPassId: dto.event_pass_id,
          userId,
          paymentProvider: PaymentProviderEnum.PAYPHONE,
          paymentReferenceId: String(dto.payphone_transactionId),
          holderName: dto.holder_name,
          holderInstagramTiktok: dto.holder_instagram_tiktok,
          holderPhone: dto.holder_phone,
          holderEmail: dto.holder_email,
          reference: dto.referenceCode,
        });

        await this.assignGroupMember(manager, dto.event_pass_id, userId);

        return savedPass;
      });
    } catch (error) {
      if (this.isClientTransactionDuplicateError(error)) {
        throw new ConflictException('La transacción de Payphone ya fue procesada anteriormente.');
      }
      throw error;
    }
  }

  async purchaseEventPassTransfer(
    userId: string,
    dto: TransferEventPassDto,
  ): Promise<UserEventPass> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const savedPass = await this.purchaseEventPassUseCase.execute(manager, {
          eventPassId: dto.event_pass_id,
          userId,
          paymentProvider: PaymentProviderEnum.TRANSFER,
          paymentReferenceId: String(dto.transferReferenceId),
          holderName: dto.holder_name,
          holderInstagramTiktok: dto.holder_instagram_tiktok,
          holderPhone: dto.holder_phone,
          holderEmail: dto.holder_email,
          reference: dto.referenceCode,
        });

        await this.assignGroupMember(manager, dto.event_pass_id, userId);

        return savedPass;
      });
    } catch (error) {
      if (this.isClientTransactionDuplicateError(error)) {
        throw new ConflictException('La transacción de Transferencia Bancaria ya fue procesada anteriormente.');
      }
      throw error;
    }
  }

  async refundEventPass(
    userId: string,
    userEventPassId: string,
  ): Promise<UserEventPass> {
    return await this.dataSource.transaction(async (manager) => {
      return await this.refundEventPassUseCase.execute(manager, {
        userId,
        userEventPassId,
      });
    });
  }

  async consumeEventPass(
    userEventPassId: string,
    eventPassId: string,
  ): Promise<{ success: boolean; message: string; userEventPass?: UserEventPass }> {
    const result = await this.dataSource.transaction(async (manager) => {
      const userPass = await this.consumeEventPassUseCase.execute(manager, {
        userEventPassId,
        eventPassId,
      });

      return {
        success: true,
        message: 'Entrada validada y consumida correctamente.',
        userEventPass: userPass,
      };
    });

    if (result.success && result.userEventPass && result.userEventPass.event_pass) {
      const eventPass = result.userEventPass.event_pass;
      const userPass = result.userEventPass;
      this.notificationsGateway.notifyUserEventPass(eventPass.created_by_id, {
        code: eventPass.code,
        name: eventPass.name,
        limit_tickets: eventPass.limit_tickets,
        sold_tickets: eventPass.sold_tickets,
        attended_count: eventPass.attended_count,
        user_name: userPass.holder_name,
        user_instagram_tiktok: userPass.holder_instagram_tiktok,
        user_phone: userPass.holder_phone,
        user_email: userPass.holder_email,
      });
    }

    return result;
  }

  private isClientTransactionDuplicateError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const queryError = error as { code?: string; constraint?: string; driverError?: { code?: string; constraint?: string } };
    const constraintName = 'IDX_transactions_client_transaction_id_unique';
    return (
      queryError.code === '23505' &&
      (queryError.constraint === constraintName || queryError.driverError?.constraint === constraintName)
    );
  }
}
