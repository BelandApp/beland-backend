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
import { DataSource, QueryRunner } from 'typeorm';
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

@Injectable()
export class WalletsService {
  private readonly completeMessage = 'la billetera virtual';

  constructor(
    private readonly repository: WalletsRepository,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly dataSource: DataSource, // 👈 acá lo inyectás
   private readonly notificationsGateway: NotificationsGateway,)
  {}

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

  // FUNCIONES PARA RECARGAS DE SALDO
  async recharge(
    user_id: string,
    dto: RechargeDto,
  ): Promise<{ wallet: Wallet }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payphoneTransactionId = String(dto.payphone_transactionId);

      const existingRecharge = await queryRunner.manager.findOne(Transaction, {
        where: { payphone_transactionId: payphoneTransactionId },
      });
      if (existingRecharge) {
        throw new ConflictException(
          'La transacción de Payphone ya fue procesada anteriormente.',
        );
      }

      // 1) Certificar que exista la wallet
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user_id },
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');

      // 2) Certificar que exista el tipo de transacción 'RECHARGE'
      const type = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.RECHARGE },
      });
      if (!type)
        throw new ConflictException(
          'No se encuentra el tipo ',
          TransactionCode.RECHARGE,
        );

      const typeOrange = await queryRunner.manager.findOne(TransactionType, {
        where: { code: TransactionCode.ORANGE_CREDIT },
      });
      if (!type)
        throw new ConflictException(
          'No se encuentra el tipo ',
          TransactionCode.ORANGE_CREDIT,
        );

      // 3) Certificar que exista el estado 'COMPLETED'
      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: 'COMPLETED' },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado 'COMPLETED'");

      // 4) Convertir USD a Becoin con validación
      const amountUsd = Number(dto.amountUsd);

      const priceOneBecoin = Number(this.superadminConfig.getPriceOneBecoin());
      if (isNaN(amountUsd) || amountUsd <= 0) {
        throw new BadRequestException('El monto de recarga no es válido');
      }
      if (isNaN(priceOneBecoin) || priceOneBecoin < 0) {
        throw new InternalServerErrorException(
          'El precio de BeCoin no es válido',
        );
      }

      // 1) Calcular BeCoins totales (sin redondear todavía)
      const rawBecoinAmount = amountUsd / priceOneBecoin;

      // 2) Redondear BeCoins totales
      const totalBeCoins = Math.floor(rawBecoinAmount);

      // 3) Calcular 5% para orange
      const orangeFee = Math.floor(totalBeCoins * 0.06);

      // 4) BeCoins finales para el usuario
      const userBeCoins = totalBeCoins - orangeFee;

      // 5) Actualizar wallet
      wallet.becoin_balance =
        Number(wallet.becoin_balance) + userBeCoins;

      wallet.becoin_orange =
        Number(wallet.becoin_orange) + orangeFee;

      // 6) Fallback de seguridad
      if (isNaN(wallet.becoin_balance)) wallet.becoin_balance = 0;
      if (isNaN(wallet.becoin_orange)) wallet.becoin_orange = 0;

      // 7) Guardar
      const walletUpdated = await queryRunner.manager.save(wallet);


      // 6) Registrar la transacción del balance general
      await queryRunner.manager.save(Transaction, {
        wallet_id: wallet.id,
        type_id: type.id,
        status_id: status.id,
        amount_becoin: +userBeCoins,
        post_balance: wallet.becoin_balance,
        reference: dto.referenceCode,
        payphone_transactionId: payphoneTransactionId,
        clientTransactionId: dto.clientTransactionId,
      });

      // 6) Registrar la transacción de las becoin_orange
      await queryRunner.manager.save(Transaction, {
        wallet_id: wallet.id,
        type_id: typeOrange.id,
        status,
        amount_becoin: +orangeFee,
        post_balance: wallet.becoin_orange,
        reference: dto.referenceCode,
        payphone_transactionId: dto.payphone_transactionId?.toString(),
        clientTransactionId: dto.clientTransactionId,
      });

      // ✅ Confirmar la transacción
      await queryRunner.commitTransaction();

      // 7) Retornar la wallet actualizada
      return { wallet: walletUpdated };
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  //FIN DE FUNCIONES PARA RECARGAS DE SALDO

  // FUNCION GENERICA PARA TRANSFERENCIAS
  async transfer(
    user_id: string,
    dto: TransferDto,
    code_transaction_send?: string,
    code_transaction_received?: string,
    queryRun?: QueryRunner,
  ): Promise<{ wallet: Wallet }> {
    
    let queryRunner: QueryRunner;
    if (queryRun) {queryRunner=queryRun}
    else {
      const queryRun2 = this.dataSource.createQueryRunner();
      await queryRun2.connect();
      await queryRun2.startTransaction();
      queryRunner=queryRun2
    }

    try {

      // 1) certifico que exista la wallet origen y que tenga los fondos
      const from = await queryRunner.manager.findOne(Wallet, {
        where: { user_id },
      });
      if (!from) throw new NotFoundException('No se encuentra la Billetera');
      if (Number(from.becoin_balance) < +dto.amountBecoin)
        throw new BadRequestException('Saldo insuficiente');

      // 2) certifico que exista la wallet de destino
      const to = await queryRunner.manager.findOne(Wallet, {
        where: { id: dto.toWalletId },
      });
      if (!to) throw new NotFoundException('Billetera destino no existe');

      // 2 Bis) Si no se especifica el tipo de transaccion lo agrego segun el tipo de usuario 
      // de la wallet destino.
      if (!code_transaction_send) {
        const user: User = await queryRunner.manager.findOne(User, {
          where: { wallet: {id: to.id} },
          relations: { profiles: { profile: true } },
        });
        if (!user) throw new NotFoundException('Usuario destino no existe');
        const profiles = user.profiles?.map((p) => p.profile?.name) ?? [];

        if (profiles.includes(ProfileEnum.MERCHANT)) {
          code_transaction_send = TransactionCode.PURCHASE;
          code_transaction_received = TransactionCode.SALE;
        } else if (profiles.includes(ProfileEnum.FOUNDATION)) {
          code_transaction_send = TransactionCode.DONATION_SEND;
          code_transaction_received = TransactionCode.DONATION_RECEIVED;
        } else if (user.role_name === RoleEnum.SUPERADMIN) {
          code_transaction_send = TransactionCode.PURCHASE_BELAND;
          code_transaction_received = TransactionCode.SALE_BELAND;
        } else {
          code_transaction_send = TransactionCode.GIFTCARD_SEND;
          code_transaction_received = TransactionCode.GIFTCARD_RECEIVED;
        }
      }

      // 3) chequeo que exista el estado y el tipo de transaccion necesarios
      let type = await queryRunner.manager.findOne(TransactionType, {
        where: { code: code_transaction_send },
      });
      if (!type)
        throw new ConflictException(
          `No se encuentra el tipo ${code_transaction_send}`,
        );

      const status = await queryRunner.manager.findOne(TransactionState, {
        where: { code: 'COMPLETED' },
      });
      if (!status)
        throw new ConflictException("No se encuentra el estado 'COMPLETED'");

      // 4) Debitar origen
      from.becoin_balance = +from.becoin_balance - +dto.amountBecoin;
      const walletUpdate = await queryRunner.manager.save(from);

      // 5) registro egreso del origen
      const transactionSend = await queryRunner.manager.save(Transaction, {
        wallet_id: from.id,
        type,
        status,
        amount_becoin: -dto.amountBecoin,
        post_balance: from.becoin_balance,
        related_wallet_id: to.id,
        reference: `${code_transaction_send}-${dto.toWalletId}`,
      });

      // 6) Chequeo que exista el tipo de transaccion necesario
      type = await queryRunner.manager.findOne(TransactionType, {
        where: { code: code_transaction_received },
      });
      if (!type)
        throw new ConflictException(
          `No se encuentra el tipo ${code_transaction_received}`,
        );

      // 7) Acreditar destino
      to.becoin_balance = +to.becoin_balance + +dto.amountBecoin;
      await queryRunner.manager.save(to);

      // 8) registro ingreso del destino
      await queryRunner.manager.save(Transaction, {
        wallet_id: to.id,
        type,
        status,
        amount_becoin: dto.amountBecoin,
        post_balance: to.becoin_balance,
        related_wallet_id: from.id,
        reference: `${code_transaction_received}-${from.id}`,
      });

      // 9) Si vino amountID entonces elimino el monto creado.
      if (dto.amount_payment_id) {
        await queryRunner.manager.delete(AmountToPayment, {
          id: dto.amount_payment_id,
        }); 
      }

      // COMMIT
      if (!queryRun) await queryRunner.commitTransaction();

      this.notificationsGateway.notifyUser(to.user_id, {
        wallet_id: to.id,
        message: "Cobro Realizado con Éxito",
        amount: +dto.amountBecoin* +this.superadminConfig.getPriceOneBecoin(),
        success: true,
        amount_payment_id_deleted: dto.amount_payment_id || null,
        noHidden: true,
      });   

      // se debe eliminar del front el amount to payment eliminado
      return await this.dataSource.manager.findOne (Transaction, {
        where : {id:transactionSend.id},
        relations: {related_wallet:{user:true}, type:true, status:true}
      });
    } catch (error) {
      // ❌ Deshago todo si algo falla
      if (!queryRun) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cierro el queryRunner
      if (!queryRun) await queryRunner.release();
    }
  }

  async purchaseRecarge (user_id:string, to_wallet_id: string, dto: PaymentWithRechargeDto): Promise<{wallet: Wallet}> {
    
    const priceOneBecoin = Number(this.superadminConfig.getPriceOneBecoin());

    const walletRecharge = await this.recharge(
      user_id,
      {
        amountUsd: +dto.amountUsd,
        referenceCode: dto.referenceCode,
        payphone_transactionId: dto.payphone_transactionId,
        clientTransactionId: dto.clientTransactionId,
      }
    ) 

    if (!walletRecharge) throw new ConflictException("Fallo la recarga");

    const amount_payment_id = dto.amount_payment_id;

    const amountBecoin = +dto.amountUsd / +priceOneBecoin;

    return await this.transfer(
        user_id,
        {
          toWalletId: to_wallet_id,
          amountBecoin,
          amount_payment_id,
        },
      );
  }

  async purchaseBeland(
    wallet_id: string,
    becoinAmount: number,
    referenceCode: string,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1) Chequear que exista la billetera con FOR UPDATE (para evitar race conditions)
      const wallet: Wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: wallet_id }
      });
      if (!wallet) throw new NotFoundException('No se encuentra la billetera');

      // 2) Buscar tipo y estado
      const type: TransactionType = await queryRunner.manager.findOne(
        TransactionType,
        {
          where: { code: 'PURCHASE_BELAND' },
        },
      );
      if (!type)
        throw new ConflictException(
          "No se encuentra el tipo 'PURCHASE_BELAND'",
        );

      const status: TransactionState = await queryRunner.manager.findOne(
        TransactionState,
        {
          where: { code: 'COMPLETED' },
        },
      );
      if (!status)
        throw new ConflictException("No se encuentra el estado 'COMPLETED'");

      // 3) Validar saldo
      if (+wallet.becoin_balance < becoinAmount)
        throw new ConflictException('Saldo insuficiente');

      wallet.becoin_balance = +wallet.becoin_balance - +becoinAmount;

      // 4) Actualizar billetera
      await queryRunner.manager.save(wallet);

      // 5) Registrar transacción
      const tx: Transaction = queryRunner.manager.create(Transaction, {
        wallet_id: wallet.id,
        type_id: type.id,
        status_id: status.id,
        amount_becoin: becoinAmount,
        post_balance: wallet.becoin_balance,
        reference: referenceCode,
      });
      const txSaved = await queryRunner.manager.save(tx);

      // 6) Confirmar transacción
      await queryRunner.commitTransaction();
      return txSaved;
    } catch (error) {
      // Si algo falla, revertimos todo
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
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
}
