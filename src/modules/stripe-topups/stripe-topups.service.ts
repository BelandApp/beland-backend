import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { StripeTopup } from './entities/stripe-topup.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { CreateStripeTopupDto } from './dto/create-stripe-topup.dto';
import { StripeTopupResponseDto } from './dto/stripe-topup-response.dto';
import { StripeTopupStatusDto } from './dto/stripe-topup-status.dto';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionCode } from 'src/modules/transaction-type/enum/transaction-code';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { StatusCode } from 'src/modules/transaction-state/enum/status.enum';
import { DataSource } from 'typeorm';
import { NotificationsGateway } from 'src/modules/notification-socket/notification-socket.gateway';
import { OwnerTopupEnum } from './enums/owner-topups.enum';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';
import { RechargeUseCase } from '../wallets/use-cases/recharge.use-case';
import { PurchaseGiftCardUseCase } from '../wallets/use-cases/purchase-giftcard.use-case';
import { PurchaseOrderPaymentUseCase } from '../wallets/use-cases/purchase-order-payment.use-case';
import { PurchaseEventPassUseCase } from '../wallets/use-cases/purchase-eventpass.use-case';
import { RechargeLimitPolicy } from '../wallets/policies/recharge-limit.policy';
import { GiftCardBalanceService } from '../gift-card/services/gift-card-balance.service';
import { UserGiftCard } from '../gift-card/entities/user-giftcard.entity';

@Injectable()
export class StripeTopupsService {
  private readonly logger = new Logger(StripeTopupsService.name);
  private readonly webhookToleranceSeconds = 300;
  private stripe: StripeType;

  constructor(
    @InjectRepository(StripeTopup)
    private readonly stripeTopupRepository: Repository<StripeTopup>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly rechargeUseCase: RechargeUseCase,
    private readonly purchaseGiftCardUseCase: PurchaseGiftCardUseCase,
    private readonly purchaseOrderPaymentUseCase: PurchaseOrderPaymentUseCase,
    private readonly purchaseEventPassUseCase: PurchaseEventPassUseCase,
    private readonly rechargeLimitPolicy: RechargeLimitPolicy,
    private readonly giftCardBalanceService: GiftCardBalanceService,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY no configurada');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createPaymentIntent(
    userId: string,
    userEmail: string | undefined,
    dto: CreateStripeTopupDto,
  ): Promise<StripeTopupResponseDto> {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      this.logger.error('STRIPE_SECRET_KEY no configurada');

      throw new InternalServerErrorException(
        'Stripe no se encuentra configurado correctamente',
      );
    }

    const wallet = await this.walletRepository.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!wallet) {
      throw new NotFoundException(
        'No se encontro la billetera del usuario',
      );
    }

    const amountUsd = this.normalizeAmount(
      dto.amountUsd,
    );

    let finalAmountUsd = amountUsd;

    // ==========================================================
    // VALIDACIONES POR TIPO DE COMPRA
    // ==========================================================

    switch (dto.owner) {
      case OwnerTopupEnum.RECHARGE:
        this.rechargeLimitPolicy.assertHasRechargeQuota(wallet);
        const quota = this.rechargeLimitPolicy.getAvailableRechargeQuota(wallet);
        if (finalAmountUsd > quota) {
          finalAmountUsd = quota;
        }
        break;

      case OwnerTopupEnum.GIFTCARD:
        if (!dto.owner_id) {
          throw new BadRequestException(
            'giftCardId requerido',
          );
        }

        if (!dto.recipient_wallet_id) {
          throw new BadRequestException(
            'recipient_wallet_id requerido',
          );
        }

        break;

      case OwnerTopupEnum.EVENTPASS:
        if (!dto.owner_id) {
          throw new BadRequestException(
            'eventPassId requerido',
          );
        }

        if (!dto.holder_name) {
          throw new BadRequestException(
            'holder_name requerido',
          );
        }

        if (!dto.holder_instagram_tiktok) {
          throw new BadRequestException(
            'holder_instagram_tiktok requerido',
          );
        }

        break;

      case OwnerTopupEnum.ORDER_PAYMENT:
        if (!dto.owner_id) {
          throw new BadRequestException(
            'paymentId requerido',
          );
        }

        break;

      case OwnerTopupEnum.EXPERIENCE:
        if (!dto.owner_id) {
          throw new BadRequestException(
            'experienceId requerido',
          );
        }

        break;

      default:
        throw new BadRequestException(
          'Tipo de compra no soportado',
        );
    }

    // ==========================================================
    // PREPARACIÓN
    // ==========================================================

    const amountInCents =
      this.convertUsdToCents(finalAmountUsd);

    const clientTransactionId =
      randomUUID();

    const localTopup =
      this.stripeTopupRepository.create({
        wallet_id: wallet.id,

        recipient_wallet_id:
          dto.recipient_wallet_id,

        user_id: userId,

        client_transaction_id:
          clientTransactionId,

        amount_usd: finalAmountUsd,

        currency: 'usd',

        status: 'PENDING',

        owner: dto.owner,

        owner_id: dto.owner_id,

        holder_name:
          dto.holder_name,

        holder_instagram_tiktok:
          dto.holder_instagram_tiktok,

        holder_phone:
          dto.holder_phone,

        holder_email:
          dto.holder_email,
      });

    let gcReservedAmount = 0;

    await this.dataSource.transaction(async (manager) => {
      if (dto.user_gift_card_id) {
        const gc = await manager.findOne(UserGiftCard, { where: { id: dto.user_gift_card_id } });
        if (!gc) throw new NotFoundException('GiftCard no encontrada');
        
        let applicableTotal = finalAmountUsd;

        if (dto.owner === OwnerTopupEnum.ORDER_PAYMENT && dto.owner_id) {
          const payment = await manager.query('SELECT amount_paid FROM payments WHERE id = $1', [dto.owner_id]);
          if (payment && payment.length > 0) applicableTotal = Number(payment[0].amount_paid);
        }

        gcReservedAmount = Math.min(Number(gc.current_balance), applicableTotal);
        
        if (gcReservedAmount > 0) {
          await this.giftCardBalanceService.reserve(manager, dto.user_gift_card_id, gcReservedAmount);
          // Stripe solo cobrará el excedente (esto asume que finalAmountUsd era el total, pero la app podría enviar ya el resto en dto.amountUsd)
          // Para evitar problemas de doble descuento si el front ya lo restó, la lógica segura es:
          // finalAmountUsd en el DTO *debería* ser el monto a pagar por Stripe.
          // Pero si finalAmountUsd + gcReservedAmount == applicableTotal, entonces el front mandó el neto.
        }
      }

      localTopup.user_gift_card_id = dto.user_gift_card_id;
      localTopup.gift_card_reserved_amount = gcReservedAmount;

      await manager.save(StripeTopup, localTopup);
    });

    try {
      const paymentIntent =
        await this.stripe.paymentIntents.create(
          {
            amount: amountInCents,

            currency: 'usd',

            automatic_payment_methods: {
              enabled: true,
            },

            metadata: {
              topup_id: localTopup.id,

              owner: dto.owner,

              owner_id:
                dto.owner_id ?? '',

              wallet_id: wallet.id,

              user_id: userId,

              client_transaction_id:
                clientTransactionId,
            },

            description: `BELAND-${dto.owner}-${wallet.id}`,

            receipt_email: userEmail,
          },
          {
            idempotencyKey:
              clientTransactionId,
          },
        );

      localTopup.payment_intent_id =
        paymentIntent.id;

      localTopup.status = 'PENDING';

      await this.stripeTopupRepository.save(
        localTopup,
      );

      this.logger.log(
        `Stripe PaymentIntent creado: topupId=${localTopup.id} paymentIntentId=${paymentIntent.id} owner=${dto.owner} walletId=${wallet.id}`,
      );

      return {
        topupId: localTopup.id,

        clientTransactionId,

        paymentIntentId:
          paymentIntent.id,

        clientSecret:
          paymentIntent.client_secret,

        amountUsd: finalAmountUsd,

        currency:
          paymentIntent.currency,

        status:
          localTopup.status,
      };
    } catch (error) {
      localTopup.status = 'FAILED';

      localTopup.failure_code =
        'payment_intent_creation_failed';

      localTopup.failure_message =
        error instanceof Error
          ? error.message
          : 'Error con Stripe';

      localTopup.failed_at = new Date();

      if (localTopup.user_gift_card_id && Number(localTopup.gift_card_reserved_amount) > 0) {
        await this.dataSource.transaction(async (manager) => {
          await this.giftCardBalanceService.release(
            manager,
            localTopup.user_gift_card_id!,
            Number(localTopup.gift_card_reserved_amount)
          );
        });
      }

      await this.stripeTopupRepository.save(
        localTopup,
      );

      this.logger.error(
        `Error creando PaymentIntent para stripeTopup=${localTopup.id}: ${localTopup.failure_message}`,
        error instanceof Error
          ? error.stack
          : undefined,
      );

      throw new BadRequestException(
        localTopup.failure_message ||
          'No se pudo iniciar el pago con Stripe',
      );
    }
  }

  async getStatus(id: string, userId: string): Promise<StripeTopupStatusDto> {
    const topup = await this.stripeTopupRepository.findOne({
      where: { id },
    });
    if (!topup) {
      throw new NotFoundException('No se encontro la recarga de Stripe');
    }
    if (topup.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta recarga');
    }

    return this.mapStatusDto(topup);
  }

  async handleWebhook(
    signature: string | undefined,
    rawBody: Buffer,
  ): Promise<void> {
    if (!signature) {
      this.logger.warn('Webhook Stripe recibido sin cabecera stripe-signature');
      throw new BadRequestException('Firma de Stripe ausente');
    }

    if (!rawBody || rawBody.length === 0) {
      this.logger.warn('Webhook Stripe recibido sin raw body');
      throw new BadRequestException('Payload vacio');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET no configurada');
      throw new InternalServerErrorException(
        'Stripe webhook no se encuentra configurado correctamente',
      );
    }


    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,     // ⚠️ IMPORTANTE: buffer, no string
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error('Firma de webhook invalida', err);
      throw new BadRequestException('Firma de Stripe invalida');
    }

    const paymentIntent = event.data?.object as Record<string, any>;

    if (!paymentIntent?.id) {
      this.logger.warn(
        `Evento Stripe sin payment_intent valido: eventId=${event.id}`,
      );
      return;
    }

    // ⚠️ Esto lo dejamos porque lo usás para guardar en DB
    const rawPayload = rawBody.toString('utf8');

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.markTopupCompleted(
          paymentIntent,
          event.id,
          signature,
          rawPayload,
        );
        break;

      case 'payment_intent.payment_failed':
        await this.markTopupFailed(
          paymentIntent,
          event.id,
          signature,
          rawPayload,
        );
        break;

      case 'payment_intent.canceled':
        await this.markTopupCancelled(
          paymentIntent,
          event.id,
          signature,
          rawPayload,
        );
        break;

      default:
        this.logger.debug(
          `Evento Stripe ignorado: type=${event.type} paymentIntentId=${paymentIntent.id}`,
        );
    }
  }

  private async markTopupCompleted(
    paymentIntent: Record<string, any>,
    eventId: string,
    signature: string,
    rawPayload: string,
  ): Promise<void> {
    const paymentIntentId = String(paymentIntent.id);

    let notificationPayload:
      | {
          userId: string;
          walletId: string;
          amountUsd: number;
        }
      | undefined;

    await this.dataSource.transaction(async (manager) => {
      const topupRepository = manager.getRepository(StripeTopup);

      const topup = await topupRepository.findOne({
        where: {
          payment_intent_id: paymentIntentId,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!topup) {
        this.logger.warn(
          `Webhook Stripe sin topup local asociado: paymentIntentId=${paymentIntentId}`,
        );
        return;
      }

      if (
        topup.stripe_event_id === eventId ||
        topup.status === 'COMPLETED'
      ) {
        this.logger.warn(
          `Webhook Stripe duplicado ignorado: topupId=${topup.id} eventId=${eventId}`,
        );
        return;
      }

      const paymentIntentAmountUsd =
        this.convertCentsToUsd(paymentIntent.amount);

      if (
        paymentIntentAmountUsd !==
        Number(topup.amount_usd)
      ) {
        throw new BadRequestException(
          'El monto informado por Stripe no coincide con el registro local',
        );
      }

      if (
        String(paymentIntent.currency || '').toLowerCase() !==
        topup.currency
      ) {
        throw new BadRequestException(
          'La moneda informada por Stripe no coincide con el registro local',
        );
      }

      const metadataTopupId =
        paymentIntent.metadata?.topup_id;

      if (
        metadataTopupId &&
        metadataTopupId !== topup.id
      ) {
        throw new BadRequestException(
          'El metadata del PaymentIntent no coincide con el registro local',
        );
      }

      const gcReservedAmount = Number(topup.gift_card_reserved_amount || 0);

      if (topup.user_gift_card_id && gcReservedAmount > 0) {
        await this.giftCardBalanceService.consumeReserved(manager, topup.user_gift_card_id, gcReservedAmount);
      }

      switch (topup.owner) {
        case OwnerTopupEnum.RECHARGE:
          await this.rechargeUseCase.execute(manager,{

            walletId: topup.wallet_id,

            amountUsd: Number(topup.amount_usd),

            paymentProvider:
              PaymentProviderEnum.STRIPE,

            paymentReferenceId:
              paymentIntentId,

            referenceCode: paymentIntentId,
          });

          break;

        case OwnerTopupEnum.GIFTCARD:
          await this.purchaseGiftCardUseCase.execute({
            manager,
            giftCardId: topup.owner_id,
            buyerWalletId: topup.wallet_id,
            recipientWalletId: topup.recipient_wallet_id,
            paymentProvider: PaymentProviderEnum.STRIPE,
            paymentReferenceId: paymentIntentId,
            reference: paymentIntentId,
          });

          break;

        case OwnerTopupEnum.ORDER_PAYMENT:
            await this.purchaseOrderPaymentUseCase.execute(
              manager,
              {
                paymentId: topup.owner_id,

                paymentProvider:
                  PaymentProviderEnum.STRIPE,

                paymentReferenceId:
                  paymentIntentId,

                reference: paymentIntentId,

                userGiftCardId: topup.user_gift_card_id,
                
                resolvedGiftCardAmount: gcReservedAmount > 0 ? gcReservedAmount : undefined,
              },
            );

            break;

        case OwnerTopupEnum.EVENTPASS:
          await this.purchaseEventPassUseCase.execute(
            manager,
            {
              eventPassId: topup.owner_id,

              userId: topup.user_id,

              paymentProvider:
                PaymentProviderEnum.STRIPE,

              paymentReferenceId:
                paymentIntentId,

              holderName:
                topup.holder_name,

              holderInstagramTiktok:
                topup.holder_instagram_tiktok,

              holderPhone:
                topup.holder_phone,

              holderEmail:
                topup.holder_email,

              reference:
                paymentIntentId,
            },
          );

          break;

        case OwnerTopupEnum.EXPERIENCE:
          // TODO:
          // await this.purchaseExperienceUseCase.execute({
          //   manager,
          //   experienceId: topup.owner_id,
          //   walletId: topup.wallet_id,
          //   paymentProvider: PaymentProviderEnum.STRIPE,
          //   paymentReferenceId: paymentIntentId,
          // });

          break;

        default:
          throw new BadRequestException(
            `Owner ${topup.owner} no soportado`,
          );
      }

      topup.status = 'COMPLETED';
      topup.failure_code = null;
      topup.failure_message = null;
      topup.stripe_event_id = eventId;
      topup.stripe_signature = signature;
      topup.raw_webhook_payload = rawPayload;
      topup.completed_at = new Date();
      topup.failed_at = null;

      await topupRepository.save(topup);

      notificationPayload = {
        userId: topup.user_id,
        walletId: topup.wallet_id,
        amountUsd: Number(topup.amount_usd),
      };

      this.logger.log(
        `Pago Stripe completado: topupId=${topup.id} paymentIntentId=${paymentIntentId} owner=${topup.owner}`,
      );
    });

    if (notificationPayload) {
      this.notificationsGateway.notifyUser(
        notificationPayload.userId,
        {
          wallet_id: notificationPayload.walletId,
          message: 'Pago acreditado con éxito',
          amount: notificationPayload.amountUsd,
          success: true,
          amount_payment_id_deleted: null,
          noHidden: true,
        },
      );
    }
  }

  private async markTopupFailed(
    paymentIntent: Record<string, any>,
    eventId: string,
    signature: string,
    rawPayload: string,
  ): Promise<void> {
    const paymentIntentId = String(paymentIntent.id);
    const lastError = paymentIntent.last_payment_error || {};

    await this.stripeTopupRepository.manager.transaction(async (manager) => {
      const topup = await manager.findOne(StripeTopup, {
        where: { payment_intent_id: paymentIntentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!topup) {
        this.logger.warn(
          `Webhook Stripe payment_failed sin topup local: paymentIntentId=${paymentIntentId}`,
        );
        return;
      }

      if (topup.stripe_event_id === eventId) {
        this.logger.warn(
          `Webhook payment_failed duplicado ignorado: topupId=${topup.id} eventId=${eventId}`,
        );
        return;
      }

      if (topup.status === 'COMPLETED') {
        this.logger.warn(
          `Webhook failed ignorado porque el topup ya esta completado: topupId=${topup.id}`,
        );
        return;
      }

      topup.status = 'FAILED';
      topup.failure_code = lastError.code || paymentIntent.status || 'payment_failed';
      topup.failure_message =
        lastError.message || 'Stripe informo que el pago fallo';
      topup.stripe_event_id = eventId;
      topup.stripe_signature = signature;
      topup.raw_webhook_payload = rawPayload;
      topup.failed_at = new Date();
      await manager.save(StripeTopup, topup);

      if (topup.user_gift_card_id && Number(topup.gift_card_reserved_amount) > 0) {
        await this.giftCardBalanceService.release(manager, topup.user_gift_card_id, Number(topup.gift_card_reserved_amount));
      }

      this.notificationsGateway.notifyUser(topup.user_id, {
        wallet_id: topup.wallet_id,
        message: topup.failure_message,
        amount: Number(topup.amount_usd),
        success: false,
        amount_payment_id_deleted: null,
        noHidden: true,
      });

      this.logger.warn(
        `Recarga Stripe fallida: topupId=${topup.id} paymentIntentId=${paymentIntentId} code=${topup.failure_code}`,
      );
    });
  }

  private async markTopupCancelled(
    paymentIntent: Record<string, any>,
    eventId: string,
    signature: string,
    rawPayload: string,
  ): Promise<void> {
    const paymentIntentId = String(paymentIntent.id);

    const topup = await this.stripeTopupRepository.findOne({
      where: { payment_intent_id: paymentIntentId },
    });
    if (!topup) {
      this.logger.warn(
        `Webhook Stripe canceled sin topup local: paymentIntentId=${paymentIntentId}`,
      );
      return;
    }

    if (topup.stripe_event_id === eventId) {
      this.logger.warn(
        `Webhook canceled duplicado ignorado: topupId=${topup.id} eventId=${eventId}`,
      );
      return;
    }

    if (topup.status === 'COMPLETED') {
      this.logger.warn(
        `Webhook canceled ignorado porque el topup ya esta completado: topupId=${topup.id}`,
      );
      return;
    }

    topup.status = 'CANCELLED';
    topup.failure_code = paymentIntent.cancellation_reason || 'cancelled';
    topup.failure_message = 'El pago fue cancelado en Stripe';
    topup.stripe_event_id = eventId;
    topup.stripe_signature = signature;
    topup.raw_webhook_payload = rawPayload;
    topup.failed_at = new Date();
    
    await this.stripeTopupRepository.manager.transaction(async (manager) => {
      await manager.save(StripeTopup, topup);
      if (topup.user_gift_card_id && Number(topup.gift_card_reserved_amount) > 0) {
        await this.giftCardBalanceService.release(manager, topup.user_gift_card_id, Number(topup.gift_card_reserved_amount));
      }
    });

    this.notificationsGateway.notifyUser(topup.user_id, {
      wallet_id: topup.wallet_id,
      message: topup.failure_message,
      amount: Number(topup.amount_usd),
      success: false,
      amount_payment_id_deleted: null,
      noHidden: true,
    });

    this.logger.warn(
      `Recarga Stripe cancelada: topupId=${topup.id} paymentIntentId=${paymentIntentId}`,
    );
  }

  private async findTransactionTypeOrFail(
    manager: EntityManager,
    code: TransactionCode,
  ): Promise<TransactionType> {
    const type = await manager.getRepository(TransactionType).findOne({
      where: { code },
    });
    if (!type) {
      throw new InternalServerErrorException(
        `No se encontro el tipo de transaccion ${code}`,
      );
    }
    return type;
  }

  private async findTransactionStateOrFail(
    manager: EntityManager,
    code: StatusCode,
  ): Promise<TransactionState> {
    const state = await manager.getRepository(TransactionState).findOne({
      where: { code },
    });
    if (!state) {
      throw new InternalServerErrorException(
        `No se encontro el estado de transaccion ${code}`,
      );
    }
    return state;
  }

  private mapStatusDto(topup: StripeTopup): StripeTopupStatusDto {
    return {
      id: topup.id,
      clientTransactionId: topup.client_transaction_id,
      paymentIntentId: topup.payment_intent_id,
      amountUsd: Number(topup.amount_usd),
      currency: topup.currency,
      status: topup.status,
      createdAt: topup.created_at,
      completedAt: topup.completed_at,
      failureCode: topup.failure_code,
      failureMessage: topup.failure_message,
    };
  }

  private normalizeAmount(amountUsd: number): number {
    const normalized = Number(amountUsd.toFixed(2));
    if (!Number.isFinite(normalized) || normalized <= 0) {
      throw new BadRequestException('El monto de recarga no es valido');
    }
    return normalized;
  }

  private convertUsdToCents(amountUsd: number): number {
    const cents = Math.round(amountUsd * 100);
    if (!Number.isInteger(cents) || cents <= 0) {
      throw new BadRequestException('El monto a cobrar en Stripe no es valido');
    }
    return cents;
  }

  private convertCentsToUsd(amountInCents: number): number {
    const normalized = Number((Number(amountInCents) / 100).toFixed(2));
    if (!Number.isFinite(normalized) || normalized <= 0) {
      throw new BadRequestException('El monto recibido desde Stripe no es valido');
    }
    return normalized;
  }

}
