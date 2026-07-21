import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { WalletsRepository } from './wallets.repository';
import { Wallet } from './entities/wallet.entity';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { RechargeDto } from './dto/recharge.dto';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransferDto } from './dto/transfer.dto';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { User } from 'src/modules/users/entities/users.entity';
import { AmountToPayment } from 'src/modules/amount-to-payment/entities/amount-to-payment.entity';
import { RespCobroDto } from './dto/resp-cobro.dto';
import { NotificationsGateway } from 'src/modules/notification-socket/notification-socket.gateway';
import { PaymentWithRechargeDto } from './dto/payment-with-recharge.dto';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum';
import { RoleEnum } from 'src/modules/roles/enum/role-validate.enum';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
import { PurchaseMerchantUseCase } from './use-cases/purchase-merchant.use-case';
import { DonationUseCase } from './use-cases/donation.use-case';
import { SendGiftCardUseCase } from './use-cases/send-giftcard.use-case';
import { PurchaseGiftCardUseCase } from './use-cases/purchase-giftcard.use-case';
import { PurchaseGiftCardDto } from './dto/purchase-giftcard.dto';
import { TransferGiftCardDto } from './dto/transfer-giftcard.dto';
import { UserGiftCard } from 'src/modules/gift-card/entities/user-giftcard.entity';
import { RechargeUseCase } from './use-cases/recharge.use-case';
import { PurchaseBelandUseCase } from './use-cases/purchase-beland.use-case';

@Injectable()
export class WalletsService {
  private readonly completeMessage = 'la billetera virtual';
  private readonly clientTransactionDuplicateConstraint =
    'IDX_transactions_client_transaction_id_unique';

  constructor(
    private readonly repository: WalletsRepository,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly dataSource: DataSource, // 👈 acá lo inyectás
    private readonly notificationsGateway: NotificationsGateway,
    private readonly purchaseMerchantUseCase: PurchaseMerchantUseCase,
    private readonly donationUseCase: DonationUseCase,
    private readonly sendGiftCardUseCase: SendGiftCardUseCase,
    private readonly purchaseGiftCardUseCase: PurchaseGiftCardUseCase,
    private readonly rechargeUseCase: RechargeUseCase,
    private readonly purchaseBelandUseCase: PurchaseBelandUseCase,
  ) {}

  async findAll(
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Wallet[], number]> {
    try {
      const response = await this.repository.findAll(pageNumber, limitNumber);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Wallet> {
    try {
      const res = await this.dataSource.getRepository(Wallet).findOne({
        where: { id },
        relations: ['user'],
      });
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(user_id: string): Promise<Wallet> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByAlias(alias: string): Promise<Wallet> {
    try {
      const res = await this.repository.findByAlias(alias);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async dataPayment(wallet_id: string, user_id: string): Promise<RespCobroDto> {
    const respPayment: RespCobroDto = {};

    // 1) Buscar la wallet del que esta por recibir el cobro
    const wallet = await this.dataSource
      .getRepository(Wallet)
      .findOne({ 
        where: { id: wallet_id },
        relations: {user: true}, 
      });
    if (!wallet) throw new NotFoundException('No se encuentra la billetera');

    respPayment.wallet_id = wallet.id;
    respPayment.img_url = wallet.user.profile_picture_url || "https://thumbs.dreamstime.com/b/icono-de-tienda-o-con-sombra-logotipo-vectorial-simple-190411124.jpg";
    respPayment.full_name = wallet.user.full_name || wallet.alias;

    // 2) Montos creados a cobrar
    const amountPayment = await this.dataSource
      .getRepository(AmountToPayment)
      .findOne({
        where: { user_commerce_id: wallet.user_id },
        order: { created_at: 'DESC' },
      });

    if (!amountPayment) {
      respPayment.amount = 0;
    } else {
      respPayment.amount = amountPayment.amount;
      respPayment.amount_to_payment_id = amountPayment.id;
      respPayment.message = amountPayment.message;
    }

    return respPayment;
  }

  async create(body: Partial<Wallet>): Promise<Wallet> {
    try {
      // Transformar userId a user_id si viene del DTO de forma segura
      if (body && Object.prototype.hasOwnProperty.call(body, 'userId')) {
        const { userId, ...rest } = body as any;
        body = { ...rest, user_id: userId };
      }
      // Buscar si ya existe una wallet para ese usuario
      if (body.user_id) {
        const existing = await this.repository.findByUser(body.user_id);
        if (existing) {
          return existing; // Retorna la primera wallet encontrada
        }
      }
      // Si no existe, crearla
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateAlias(id: string, alias: string) {
    try {
      const wallet = await this.repository.findByAlias(alias);
      if (wallet) throw new BadRequestException('El alias ya existe. Debe elegir otro');
      const res = await this.repository.update(id, {alias});
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Wallet>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new ConflictException(
        `No se puede eliminar ${this.completeMessage}`,
      );
    }
  }

  // FUNCIONES PARA RECARGAS DE SALDO POR PAYPHONE
  async recharge(
    user_id: string,
    dto: RechargeDto,
    externalManager?: EntityManager,
  ): Promise<{ wallet: Wallet }> {
    const runRecharge = async (activeManager: EntityManager) => {
      const wallet = await activeManager.findOne(Wallet, {
        where: { user_id },
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');
      
      const result = await this.rechargeUseCase.execute(activeManager, {
        walletId: wallet.id,
        amountUsd: Number(dto.amountUsd),
        referenceCode: dto.referenceCode,
        paymentReferenceId: String(dto.paymentReferenceId),
        paymentProvider: dto.paymentProvider || PaymentProviderEnum.PAYPHONE,
      });

      const walletUpdated = await activeManager.findOne(Wallet, { where: { id: result.walletId } });
      return { wallet: walletUpdated };
    };

    try {
      if (externalManager) {
        return await runRecharge(externalManager);
      } else {
        return await this.dataSource.transaction(async (manager) => {
          return await runRecharge(manager);
        });
      }
    } catch (error) {
      if (this.isClientTransactionDuplicateError(error)) {
        throw new ConflictException('La transacción de Payphone ya fue procesada anteriormente.');
      }
      throw error;
    }
  }

  //FIN DE FUNCIONES PARA RECARGAS DE SALDO

  async purchaseBecoin(user_id: string, dto: TransferDto): Promise<{ wallet: Wallet }> {
    const resultData = await this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Wallet, { where: { user_id }, lock: { mode: 'pessimistic_write' } });
      const to = await manager.findOne(Wallet, { where: { id: dto.toWalletId }, lock: { mode: 'pessimistic_write' } });
      const result = await this.purchaseMerchantUseCase.execute(manager, {
        buyerWalletId: from.id,
        merchantWalletId: to.id,
        amountUsd: +dto.amountUsd,
        amountPaymentId: dto.amount_payment_id
      });
      const tx = await manager.findOne(Transaction, { where: { id: result.transaction.id }, relations: { related_wallet: { user: true }, type: true, status: true } });
      return { toId: to.id, merchantUserId: result.merchantUserId, transaction: tx };
    });

    this.notificationsGateway.notifyUser(resultData.merchantUserId, {
      wallet_id: resultData.toId, message: "Cobro Realizado con Éxito", amount: +dto.amountUsd, success: true, amount_payment_id_deleted: dto.amount_payment_id || null, noHidden: true,
    });
    return resultData.transaction as any;
  }

  async purchaseGiftCard(userId: string, dto: PurchaseGiftCardDto): Promise<UserGiftCard> {
    return await this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Wallet, { where: { user_id: userId } });
      const result = await this.purchaseGiftCardUseCase.execute({
        manager,
        buyerWalletId: from.id,
        recipientWalletId: dto.recipientWalletId,
        giftCardId: dto.giftCardId,
        paymentProvider: PaymentProviderEnum.PAYPHONE,
        paymentReferenceId: dto.paymentReferenceId,
      });
      return result;
    });
  }

  async purchaseGiftCardTransfer(userId: string, dto: TransferGiftCardDto): Promise<UserGiftCard> {
    return await this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Wallet, { where: { user_id: userId } });
      const result = await this.purchaseGiftCardUseCase.execute({
        manager,
        buyerWalletId: from.id,
        recipientWalletId: dto.recipientWalletId,
        giftCardId: dto.giftCardId,
        paymentProvider: PaymentProviderEnum.TRANSFER,
        paymentReferenceId: dto.paymentReferenceId,
      });
      return result;
    });
  }

  // FUNCION GENERICA PARA TRANSFERENCIAS P2P
  async sendGiftCardTransfer(
    user_id: string,
    dto: TransferDto,
  ): Promise<{ wallet: Wallet }> {
    const resultData = await this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Wallet, { 
        where: { user_id }, 
        lock: { mode: 'pessimistic_write' } 
      });
      if (!from) throw new NotFoundException('No se encuentra la Billetera origen');
      
      const to = await manager.findOne(Wallet, { 
        where: { id: dto.toWalletId }, 
        lock: { mode: 'pessimistic_write' } 
      });
      if (!to) throw new NotFoundException('Billetera destino no existe');

      const giftCardResult = await this.sendGiftCardUseCase.execute(manager, {
        senderWalletId: from.id,
        recipientWalletId: to.id,
        amountUsd: +dto.amountUsd,
      });

      const tx = await manager.findOne(Transaction, {
        where: { id: giftCardResult.transaction.id },
        relations: { related_wallet: { user: true }, type: true, status: true }
      });
      return { recipientUserId: giftCardResult.recipientUserId, toId: to.id, transaction: tx };
    });

    this.notificationsGateway.notifyUser(resultData.recipientUserId, {
      wallet_id: resultData.toId,
      message: "Cobro Realizado con Éxito",
      amount: +dto.amountUsd,
      success: true,
      amount_payment_id_deleted: null,
      noHidden: true,
    });

    return resultData.transaction as any;
  }

  async purchaseRecarge (user_id:string, to_wallet_id: string, dto: PaymentWithRechargeDto): Promise<{wallet: Wallet}> {
    const resultData = await this.dataSource.transaction(async (manager) => {
      // 1. Efectuar la recarga usando la transacción actual
      const walletRecharge = await this.recharge(
        user_id,
        {
          amountUsd: +dto.amountUsd,
          referenceCode: dto.referenceCode,
          paymentReferenceId: dto.paymentReferenceId,
          paymentProvider: PaymentProviderEnum.PAYPHONE,
        },
        manager
      );

      if (!walletRecharge) throw new ConflictException("Falló la recarga");

      const to = await manager.findOne(Wallet, {
        where: { id: to_wallet_id },
        relations: { user: { profiles: { profile: true } } },
        lock: { mode: 'pessimistic_write' },
      });
      if (!to) throw new NotFoundException('Billetera destino no existe');
      
      const user = to.user;
      const profiles = user.profiles?.map(p => p.profile?.name) ?? [];
      const from = await manager.findOne(Wallet, { 
        where: { user_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!from) throw new NotFoundException('Billetera origen no existe');

      let transactionResult: Transaction;
      let targetUserId = to.user_id;

      if (profiles.includes(ProfileEnum.MERCHANT)) {
        const result = await this.purchaseMerchantUseCase.execute(manager, {
          buyerWalletId: from.id,
          merchantWalletId: to.id,
          amountUsd: +dto.amountUsd,
          amountPaymentId: dto.amount_payment_id
        });
        transactionResult = result.transaction;
      } else if (profiles.includes(ProfileEnum.FOUNDATION)) {
        const result = await this.donationUseCase.execute(manager, {
          buyerWalletId: from.id,
          foundationWalletId: to.id,
          amountUsd: +dto.amountUsd,
          amountPaymentId: dto.amount_payment_id
        });
        transactionResult = result.transaction;
        targetUserId = result.foundationUserId;
      } else if (user.role_name === RoleEnum.SUPERADMIN) {
        transactionResult = await this.purchaseBeland(from.id, to.id, +dto.amountUsd, dto.referenceCode || `PAYMENT-${to.id}`, dto.amount_payment_id || null, manager);
      } else {
        const result = await this.sendGiftCardUseCase.execute(manager, {
          senderWalletId: from.id,
          recipientWalletId: to.id,
          amountUsd: +dto.amountUsd
        });
        transactionResult = result.transaction;
      }

      const tx = await manager.findOne(Transaction, {
        where: { id: transactionResult.id },
        relations: { related_wallet: { user: true }, type: true, status: true }
      });
      
      return { targetUserId, toId: to.id, transaction: tx };
    });

    this.notificationsGateway.notifyUser(resultData.targetUserId, {
      wallet_id: resultData.toId,
      message: "Cobro Realizado con Éxito",
      amount: +dto.amountUsd,
      success: true,
      amount_payment_id_deleted: dto.amount_payment_id || null,
      noHidden: true,
    });

    return resultData.transaction as any;
  }

  async purchaseBeland(
    from_wallet_id: string,
    to_wallet_id: string,
    amountUsd: number,
    referenceCode: string,
    amountPaymentId: string | null,
    manager: EntityManager
  ): Promise<Transaction> {
    const result = await this.purchaseBelandUseCase.execute(manager, {
      buyerWalletId: from_wallet_id,
      destinationWalletId: to_wallet_id,
      amountUsd,
      referenceCode,
      amountPaymentId,
    });
    return result.transaction;
  }
  //FIN DE DIFERENTES TIPOS DE COMPRAS
  async generateAliasAndQr (user_id: string): Promise<Wallet> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1) Chequear que exista la billetera 
      const wallet: Wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id },
        relations: {user:true},
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');

      // genero qr
      const qr = await QRCode.toDataURL(wallet.id);
      // genero alias
      const nombre = wallet.user.email.split('@')[0];
      const random = Math.floor(100 + Math.random() * 900); 
      const alias = `${nombre}${random}`;

      if (!wallet.qr) wallet.qr = qr;
      if (!wallet.alias) wallet.alias = alias;

      const walletUpdate = await queryRunner.manager.save(wallet);

      await queryRunner.commitTransaction();

      return walletUpdate;
    } catch (error) {
      // Si algo falla, revertimos todo
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  private isClientTransactionDuplicateError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const queryError = error as {
      code?: string;
      constraint?: string;
      driverError?: { code?: string; constraint?: string };
    };

    return (
      queryError.code === '23505' &&
      (queryError.constraint === this.clientTransactionDuplicateConstraint ||
        queryError.driverError?.constraint ===
          this.clientTransactionDuplicateConstraint)
    );
  }

  async fixMissingQr(): Promise<{ updated: number }> {
    const wallets = await this.dataSource
      .createQueryBuilder()
      .select('wallet')
      .from(Wallet, 'wallet')
      .where("wallet.qr IS NULL OR wallet.qr = ''")
      .getMany();

    let updated = 0;

    for (const wallet of wallets) {
      const qr = await QRCode.toDataURL(String(wallet.id));

      await this.dataSource
        .createQueryBuilder()
        .update(Wallet)
        .set({ qr })
        .where('id = :id', { id: wallet.id })
        .execute();

      updated++;
    }

    return { updated };
  }
}
