import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError } from 'axios';
import * as crypto from 'crypto';
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

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: Record<string, any>;
  };
};

@Injectable()
export class StripeTopupsService {
  private readonly logger = new Logger(StripeTopupsService.name);
  private readonly stripeApiUrl = 'https://api.stripe.com/v1/payment_intents';
  private readonly webhookToleranceSeconds = 300;

  constructor(
    @InjectRepository(StripeTopup)
    private readonly stripeTopupRepository: Repository<StripeTopup>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

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
      where: { user_id: userId },
    });
    if (!wallet) {
      throw new NotFoundException('No se encontro la billetera del usuario');
    }

    const amountUsd = this.normalizeAmount(dto.amountUsd);
    const amountInCents = this.convertUsdToCents(amountUsd);
    const clientTransactionId = randomUUID();

    const localTopup = this.stripeTopupRepository.create({
      wallet_id: wallet.id,
      user_id: userId,
      client_transaction_id: clientTransactionId,
      amount_usd: amountUsd,
      currency: 'usd',
      status: 'PENDING',
    });
    await this.stripeTopupRepository.save(localTopup);

    const body = new URLSearchParams();
    body.append('amount', amountInCents.toString());
    body.append('currency', 'usd');
    body.append('automatic_payment_methods[enabled]', 'true');
    body.append('metadata[topup_id]', localTopup.id);
    body.append('metadata[wallet_id]', wallet.id);
    body.append('metadata[user_id]', userId);
    body.append('metadata[client_transaction_id]', clientTransactionId);
    body.append('description', `Recarga de wallet Beland ${wallet.id}`);
    if (userEmail) {
      body.append('receipt_email', userEmail);
    }

    try {
      const response = await axios.post(this.stripeApiUrl, body, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': clientTransactionId,
        },
        timeout: 15000,
      });

      const paymentIntent = response.data;
      localTopup.payment_intent_id = paymentIntent.id;
      localTopup.status = 'PENDING';
      await this.stripeTopupRepository.save(localTopup);

      this.logger.log(
        `Stripe PaymentIntent creado: topupId=${localTopup.id} paymentIntentId=${paymentIntent.id} walletId=${wallet.id}`,
      );

      return {
        topupId: localTopup.id,
        clientTransactionId,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amountUsd,
        currency: paymentIntent.currency,
        status: localTopup.status,
      };
    } catch (error) {
      localTopup.status = 'FAILED';
      localTopup.failure_code = 'payment_intent_creation_failed';
      localTopup.failure_message = this.extractStripeErrorMessage(error);
      localTopup.failed_at = new Date();
      await this.stripeTopupRepository.save(localTopup);

      this.logger.error(
        `Error creando PaymentIntent para stripeTopup=${localTopup.id}: ${localTopup.failure_message}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new BadRequestException(
        localTopup.failure_message || 'No se pudo iniciar el pago con Stripe',
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

  async handleWebhook(signature: string | undefined, rawBody: Buffer): Promise<void> {
    if (!signature) {
      this.logger.warn('Webhook Stripe recibido sin cabecera stripe-signature');
      throw new BadRequestException('Firma de Stripe ausente');
    }
    if (!rawBody || rawBody.length === 0) {
      this.logger.warn('Webhook Stripe recibido sin raw body');
      throw new BadRequestException('Payload vacio');
    }

    const rawPayload = rawBody.toString('utf8');
    const event = this.verifyWebhookSignature(signature, rawPayload);
    const paymentIntent = event.data?.object;

    if (!paymentIntent?.id) {
      this.logger.warn(`Evento Stripe sin payment_intent valido: eventId=${event.id}`);
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.markTopupCompleted(paymentIntent, event.id, signature, rawPayload);
        break;
      case 'payment_intent.payment_failed':
        await this.markTopupFailed(paymentIntent, event.id, signature, rawPayload);
        break;
      case 'payment_intent.canceled':
        await this.markTopupCancelled(paymentIntent, event.id, signature, rawPayload);
        break;
      default:
        this.logger.debug(
          `Evento Stripe ignorado: type=${event.type} paymentIntentId=${paymentIntent.id}`,
        );
    }
  }

  private verifyWebhookSignature(signatureHeader: string, rawPayload: string): StripeEvent {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET no configurada');
      throw new InternalServerErrorException(
        'Stripe webhook no se encuentra configurado correctamente',
      );
    }

    const parsedSignature = this.parseStripeSignature(signatureHeader);
    if (!parsedSignature.timestamp || parsedSignature.signatures.length === 0) {
      throw new BadRequestException('Cabecera stripe-signature invalida');
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (
      Math.abs(nowSeconds - parsedSignature.timestamp) >
      this.webhookToleranceSeconds
    ) {
      throw new BadRequestException('Webhook Stripe expirado');
    }

    const signedPayload = `${parsedSignature.timestamp}.${rawPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const valid = parsedSignature.signatures.some((candidate) =>
      this.safeCompareHex(candidate, expectedSignature),
    );

    if (!valid) {
      this.logger.warn('Firma Stripe invalida');
      throw new BadRequestException('Firma Stripe invalida');
    }

    try {
      return JSON.parse(rawPayload) as StripeEvent;
    } catch (error) {
      this.logger.error(
        'No se pudo parsear el payload del webhook Stripe',
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadRequestException('Payload Stripe invalido');
    }
  }

  private parseStripeSignature(signatureHeader: string): {
    timestamp: number | null;
    signatures: string[];
  } {
    const parts = signatureHeader.split(',');
    let timestamp: number | null = null;
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (!key || !value) continue;
      if (key === 't') timestamp = Number(value);
      if (key === 'v1') signatures.push(value);
    }

    return { timestamp, signatures };
  }

  private safeCompareHex(a: string, b: string): boolean {
    try {
      const left = Buffer.from(a, 'hex');
      const right = Buffer.from(b, 'hex');
      if (left.length !== right.length) return false;
      return crypto.timingSafeEqual(left, right);
    } catch {
      return false;
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
      const walletRepository = manager.getRepository(Wallet);
      const transactionRepository = manager.getRepository(Transaction);

      const topup = await topupRepository.findOne({
        where: { payment_intent_id: paymentIntentId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!topup) {
        this.logger.warn(
          `Webhook Stripe sin topup local asociado: paymentIntentId=${paymentIntentId}`,
        );
        return;
      }

      if (topup.stripe_event_id === eventId || topup.status === 'COMPLETED') {
        this.logger.warn(
          `Webhook Stripe duplicado ignorado: topupId=${topup.id} eventId=${eventId}`,
        );
        return;
      }

      const paymentIntentAmountUsd = this.convertCentsToUsd(paymentIntent.amount);
      if (paymentIntentAmountUsd !== Number(topup.amount_usd)) {
        throw new BadRequestException(
          'El monto informado por Stripe no coincide con la recarga local',
        );
      }

      if (String(paymentIntent.currency || '').toLowerCase() !== topup.currency) {
        throw new BadRequestException(
          'La moneda informada por Stripe no coincide con la recarga local',
        );
      }

      const metadataTopupId = paymentIntent.metadata?.topup_id;
      if (metadataTopupId && metadataTopupId !== topup.id) {
        throw new BadRequestException(
          'El metadata del PaymentIntent no coincide con la recarga local',
        );
      }

      const wallet = await walletRepository.findOne({
        where: { id: topup.wallet_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) {
        throw new NotFoundException('No se encontro la billetera para acreditar la recarga');
      }

      const rechargeType = await this.findTransactionTypeOrFail(
        manager,
        TransactionCode.RECHARGE,
      );
      const orangeType = await this.findTransactionTypeOrFail(
        manager,
        TransactionCode.ORANGE_CREDIT,
      );
      const completedState = await this.findTransactionStateOrFail(
        manager,
        StatusCode.COMPLETED,
      );

      const becoinPrice = Number(this.superadminConfig.getPriceOneBecoin());
      if (!Number.isFinite(becoinPrice) || becoinPrice <= 0) {
        throw new InternalServerErrorException('El precio de BeCoin configurado no es valido');
      }

      const amountUsd = Number(topup.amount_usd);
      const totalBecoins = Math.floor(amountUsd / becoinPrice);
      if (totalBecoins <= 0) {
        throw new BadRequestException('El monto pagado no genera saldo acreditable');
      }

      const orangeFee = Math.floor(totalBecoins * 0.06);
      const userBecoins = totalBecoins - orangeFee;

      wallet.becoin_balance = Number(wallet.becoin_balance) + userBecoins;
      wallet.becoin_orange = Number(wallet.becoin_orange || 0) + orangeFee;
      await walletRepository.save(wallet);

      await transactionRepository.save({
        wallet_id: wallet.id,
        type_id: rechargeType.id,
        status_id: completedState.id,
        amount_becoin: userBecoins,
        post_balance: wallet.becoin_balance,
        reference: paymentIntentId,
        clientTransactionId: topup.client_transaction_id,
      });

      await transactionRepository.save({
        wallet_id: wallet.id,
        type_id: orangeType.id,
        status_id: completedState.id,
        amount_becoin: orangeFee,
        post_balance: wallet.becoin_orange,
        reference: paymentIntentId,
      });

      topup.status = 'COMPLETED';
      topup.becoins_granted = userBecoins;
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
        walletId: wallet.id,
        amountUsd,
      };

      this.logger.log(
        `Recarga Stripe completada: topupId=${topup.id} paymentIntentId=${paymentIntentId} walletId=${wallet.id} becoins=${userBecoins}`,
      );
    });

    if (notificationPayload) {
      this.notificationsGateway.notifyUser(notificationPayload.userId, {
        wallet_id: notificationPayload.walletId,
        message: 'Recarga acreditada con exito',
        amount: notificationPayload.amountUsd,
        success: true,
        amount_payment_id_deleted: null,
        noHidden: true,
      });
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

    const topup = await this.stripeTopupRepository.findOne({
      where: { payment_intent_id: paymentIntentId },
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
    await this.stripeTopupRepository.save(topup);

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
    await this.stripeTopupRepository.save(topup);

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
      becoinsGranted:
        topup.becoins_granted !== null ? Number(topup.becoins_granted) : null,
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

  private extractStripeErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const stripeMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.response?.data?.message;
      return stripeMessage || axiosError.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Error desconocido al crear el pago con Stripe';
  }
}
