// src/group-services/group-services.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GroupServicesRepository } from './group-services.repository';
import { CreateGroupServiceDto } from './dto/create-group-service.dto';
import { UpdateGroupServiceDto } from './dto/update-group-service.dto';
import { GroupService } from './entities/group-service.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { PaymentTypeCode } from '../payment-types/enum/payment-type.enum';
import { TransactionCode } from '../transaction-type/enum/transaction-code';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { Group } from '../groups/entities/group.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class GroupServicesService {
  private readonly logger = new Logger(GroupServicesService.name);

  constructor(
    private readonly repository: GroupServicesRepository,
    private readonly dataSource: DataSource,
    private readonly superadminService: SuperadminConfigService,
  ) {}

  /* ======================================================
   * CREATE
   * ====================================================== */
  async create(
    dto: CreateGroupServiceDto,
    user_id: string,
  ): Promise<GroupService> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 1️⃣ Validar membresía (solo creador o leader debería crear)
      const group = await qr.manager.findOne(Group, {
        where: { id: dto.group_id, user_id },
      });

      if (!group) {
        throw new NotFoundException('El grupo no existe o usted no esta autorizado');
      }

      // 2️⃣ Wallet del creador
      const wallet = await qr.manager.findOne(Wallet, {
        where: { user_id },
      });
      if (!wallet) throw new NotFoundException('Wallet no encontrada');

      const service = await qr.manager.findOne(Service, {where: {id: dto.service_id}})
      if (!service) throw new NotFoundException('Servicio no encontrado');

      // 3️⃣ Crear contratacion de servicio
      const groupServiceSaved = await qr.manager.save(GroupService, {
        ...dto,
        total_becoin: service.price_becoin,
      });

      // 4️⃣ Preparar estados y tipos
      const txStatePending = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.PENDING },
      });

      const txType = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.SERVICE_BELAND },
      });

      const cost = Number(service.price_becoin);

      // const groupService = await qr.manager.findOne(GroupService, {
      //   where: {id:groupServiceSaved.id},
      //   relations: {payment_type:true}
      // })

      /* ======================================================
       * 5️⃣ RETENCIÓN SEGÚN PAYMENT TYPE
       * ====================================================== */
      // por el momento solo FULL
      const full = "FULL"
      switch (full) {
        case PaymentTypeCode.FULL: {
          if (Number(wallet.becoin_balance) < cost) {
            throw new BadRequestException('Saldo insuficiente');
          }

          wallet.becoin_balance = +wallet.becoin_balance - cost;
          wallet.locked_balance = +wallet.locked_balance + cost;

          await qr.manager.save(Wallet, wallet);

          await qr.manager.save(
            qr.manager.create(Transaction, {
              wallet_id: wallet.id,
              type: txType,
              status: txStatePending,
              amount_becoin: cost,
              post_balance: wallet.becoin_balance,
              reference: `GROUP_SERVICE-${groupServiceSaved.id}`,
            }),
          );

          break;
        }

        /*case PaymentTypeCode.EQUAL_SPLIT: {
          const [wallets, totalMembers] =
            await qr.manager.findAndCount(Wallet, {
              where: {
                user: {
                  group_memberships: {
                    group_id: groupService.group_id,
                  },
                },
              },
              relations: { user: true },
            });

          const split = Number((cost / totalMembers).toFixed(2));

          for (const w of wallets) {
            if (Number(w.becoin_balance) < split) {
              throw new BadRequestException(
                `Saldo insuficiente en ${w.user.email}`,
              );
            }

            w.becoin_balance = +w.becoin_balance - split;
            w.locked_balance = +w.locked_balance + split;

            await qr.manager.save(Wallet, w);

            await qr.manager.save(
              qr.manager.create(Transaction, {
                wallet_id: w.id,
                type_id: txType.id,
                status_id: txStatePending.id,
                amount_becoin: split,
                post_balance: w.becoin_balance,
                reference: `GROUP_SERVICE-${service.id}`,
              }),
            );
          }

          break;
        }*/

        default:
          throw new BadRequestException('Forma de pago inválida');
      }

      await qr.commitTransaction();
      return groupServiceSaved;
    } catch (error) {
      await qr.rollbackTransaction();
      this.logger.error('create(): error', error);
      throw error;
    } finally {
      await qr.release();
    }
  }

  /* ======================================================
   * FIND
   * ====================================================== */
  async findAll() {
    return this.repository.findAll();
  }

  async findAllGroup(group_id:string) {
    return this.repository.findByGroup(group_id);
  }

  async findOne(id: string): Promise<GroupService> {
    const service = await this.repository.findOneById(id);
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  /* ======================================================
   * UPDATE
   * ====================================================== */
  async update(
    id: string,
    dto: UpdateGroupServiceDto,
  ): Promise<GroupService> {
    const updated = await this.repository.updateOne(id, dto);
    if (!updated) throw new NotFoundException('Servicio no encontrado');
    return updated;
  }

  /* ======================================================
   * DELETE
   * ====================================================== */
  async remove(id: string): Promise<{ success: boolean }> {
    const res = await this.repository.deleteOne(id);
    if (res.affected === 0) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return { success: true };
  }

  /* ======================================================
   * COMPLETE SERVICE → LIBERAR SALDOS + SUPERADMIN
   * ====================================================== */
  async completeService(id: string): Promise<GroupService> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const groupService = await this.repository.findOneById(id);
      if (!groupService) throw new NotFoundException('Servicio no encontrado');
      if (groupService.is_completed)
        throw new BadRequestException('El servicio ya fue completado');

      const txCompleted = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      const txType = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.SERVICE_BELAND },
      });

      const txs = await qr.manager.find(Transaction, {
        where: { reference: `GROUP_SERVICE-${groupService.id}` },
      });

      let totalCollected = 0;

      for (const tx of txs) {
        const wallet = await qr.manager.findOne(Wallet, {
          where: { id: tx.wallet_id },
        });

        wallet.locked_balance = +wallet.locked_balance - Number(tx.amount_becoin);
        tx.status_id = txCompleted.id;

        totalCollected += Number(tx.amount_becoin);

        await qr.manager.save([wallet, tx]);
      }

      // Superadmin
      const superWallet = await qr.manager.findOne(Wallet, {
        where: { user_id: this.superadminService.getSuperadminId() },
      });

      superWallet.becoin_balance = +superWallet.becoin_balance + totalCollected;
      await qr.manager.save(superWallet);

      const superadminTransaction = qr.manager.create(Transaction, {
        wallet_id: superWallet.id,
        amount_becoin: totalCollected,
        status_id: txCompleted.id,
        type_id: txType.id,
        reference: `GROUP_SERVICE-${groupService.id}`,
        description: `Cobro servicio de grupo ${groupService.group_id}`,
      });

      await qr.manager.save(superadminTransaction);

      groupService.is_completed = true;
      await qr.manager.save(groupService);

      await qr.commitTransaction();
      return groupService;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  /* ======================================================
   * CANCELLED SERVICE → devuleve saldos. si tiene penalidad la acredita al superadmin
   * ====================================================== */

  async cancelledService(id: string): Promise<{message: string, success: true}> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const groupService = await qr.manager.findOne(GroupService, {
        where: { id },
        relations: { group: true, service: true },
      });

      if (!groupService)
        throw new NotFoundException('Servicio no encontrado');

      if (groupService.is_completed)
        throw new BadRequestException('No se puede cancelar un servicio completado');

      if (!groupService.group.event_at)
        throw new BadRequestException('El grupo no tiene fecha de evento');

      const eventDate = new Date(groupService.group.event_at);
      const now = new Date();

      if (now >= eventDate)
        throw new BadRequestException(
          'No se puede cancelar un servicio cuyo evento ya ocurrió',
        );

      const txCancelled = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.CANCELLED },
      });

      const txCompleted = await qr.manager.findOne(TransactionState, {
        where: { code: StatusCode.COMPLETED },
      });

      const txTypePenalty = await qr.manager.findOne(TransactionType, {
        where: { code: TransactionCode.SERVICE_PENALITY },
      });

      const txs = await qr.manager.find(Transaction, {
        where: { reference: `GROUP_SERVICE-${groupService.id}` },
      });

      if (!txs.length)
        throw new BadRequestException('No hay transacciones asociadas');

      /* ==============================
        1️⃣ Determinar si aplica penalidad
      ============================== */

      const diffTime = eventDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const limit = groupService.service.day_limit_cancelled ?? 0;
      const percent = groupService.service.porcent_cancelled ?? 0;

      const applyPenalty = percent > 0 && daysRemaining < limit;

      let totalPenalty = 0;

      /* ==============================
        2️⃣ Procesar cada transaction
      ============================== */

      for (const tx of txs) {
        const wallet = await qr.manager.findOne(Wallet, {
          where: { id: tx.wallet_id },
        });

        const originalAmount = Number(tx.amount_becoin);

        let penalty = 0;
        let refund = originalAmount;

        if (applyPenalty) {
          penalty = Number(((originalAmount * percent) / 100).toFixed(2));
          refund = Number((originalAmount - penalty).toFixed(2));
        }

        wallet.locked_balance -= originalAmount;
        wallet.becoin_balance += refund;

        tx.status = txCancelled;

        totalPenalty += penalty;

        await qr.manager.save([wallet, tx]);
      }

      /* ==============================
        3️⃣ Penalidad al superadmin
      ============================== */

      if (totalPenalty > 0) {
        const superWallet = await qr.manager.findOne(Wallet, {
          where: { user_id: this.superadminService.getSuperadminId() },
        });

        superWallet.becoin_balance += totalPenalty;

        await qr.manager.save(superWallet);

        const penaltyTx = qr.manager.create(Transaction, {
          wallet_id: superWallet.id,
          amount_becoin: totalPenalty,
          status: txCompleted,
          type: txTypePenalty,
          reference: `GROUP_SERVICE-${groupService.id}`,
          description: `Penalidad cancelación grupo ${groupService.group_id}`,
        });

        await qr.manager.save(penaltyTx);
      }

      /* ==============================
        4️⃣ Eliminar GroupService
      ============================== */

      await qr.manager.remove(groupService);

      await qr.commitTransaction();

      return { 
        message: 'Servicio cancelado con éxito', 
        success: true 
      };

    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
