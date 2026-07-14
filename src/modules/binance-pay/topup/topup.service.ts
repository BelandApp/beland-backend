import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Topup } from './entities/topup.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { BinancePayService } from '../binance-pay.service';
import { SuperadminConfigService } from '../../superadmin-config/superadmin-config.service';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transaction-type/entities/transaction-type.entity';
import { TransactionState } from '../../transaction-state/entities/transaction-state.entity';
import { TransactionCode } from '../../transaction-type/enum/transaction-code';
import { StatusCode } from '../../transaction-state/enum/status.enum';
@Injectable()
export class TopupService {
  private readonly logger = new Logger(TopupService.name);

  constructor(
    @InjectRepository(Topup) private topupRepo: Repository<Topup>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(TransactionType) private typeRepo: Repository<TransactionType>,
    @InjectRepository(TransactionState) private stateRepo: Repository<TransactionState>,
    private dataSource: DataSource,
    private binancePay: BinancePayService,
    private superadminConfig: SuperadminConfigService,
  ) { }

  // Crea la orden local y llama a Binance createOrder
  async createTopup(walletId: string, amountUsd: number) {
    if (!Number.isInteger(amountUsd) || amountUsd < 1) {
      throw new BadRequestException('amountUsd must be an integer >= 1');
    }

    const wallet = await this.walletRepo.findOne({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const merchantTradeNo = `BEC-${walletId}-${Date.now()}`;

    // create local topup record
    const topup = this.topupRepo.create({
      wallet_id: walletId,
      merchantTradeNo,
      amount_usd: amountUsd,
      currency: 'USDT',
      status: 'PENDING',
    });
    await this.topupRepo.save(topup);

    // prepare body for Binance Pay
    const body = {
      merchantTradeNo,
      totalFee: amountUsd.toFixed(2),
      currency: 'USDT',
      goods: [{ goodsType: 'VIRTUAL', goodsCategory: 'TOPUP', goodsName: 'Becoin topup', goodsDesc: `Recarga ${amountUsd} USD -> BECOIN` }],
      merchantUrl: process.env.APP_PUBLIC_URL || 'https://miapp.com',
    };

    const binanceRes = await this.binancePay.createOrder(body);
    const data = binanceRes?.data || binanceRes;
    topup.prepayId = data?.prepayId || data?.prepay_id || null;
    topup.checkoutUrl = data?.checkoutUrl || data?.checkoutUrl || null;
    await this.topupRepo.save(topup);

    return { topup, binance: data };
  }

  // Procesa webhook de forma idempotente
  async processWebhook(body: any) {
    const merchantTradeNo = body.merchantTradeNo || body.merchantTradeNoStr || body.merchantTradeNo;
    if (!merchantTradeNo) {
      this.logger.warn('Webhook without merchantTradeNo');
      return;
    }

    const topup = await this.topupRepo.findOne({ where: { merchantTradeNo } });
    if (!topup) {
      this.logger.warn(`Topup not found for merchantTradeNo ${merchantTradeNo}`);
      return;
    }

    // detect success: varios campos posibles según versión
    const bizStatus = (body.bizStatus || body.orderStatus || body.status || '').toString().toUpperCase();
    const isSuccess = bizStatus.includes('PAY_SUCCESS') || bizStatus.includes('PAID') || bizStatus.includes('COMPLETED') || bizStatus.includes('SUCCESS');

    // save raw payload always
    topup.raw_webhook_payload = JSON.stringify(body);
    await this.topupRepo.save(topup);

    if (!isSuccess) {
      this.logger.log(`Topup ${merchantTradeNo} not in success state: ${bizStatus}`);
      return;
    }

    if (topup.status === 'COMPLETED') {
      this.logger.log(`Topup ${merchantTradeNo} already completed`);
      return;
    }

    // Ejecutar en transacción
    await this.dataSource.transaction(async (manager) => {
      const walletRepo = manager.getRepository(Wallet);
      const topupRepo = manager.getRepository(Topup);
      const txRepo = manager.getRepository(Transaction);

      // Pessimistic lock wallet row to prevent race conditions
      const wallet = await walletRepo.findOne({ where: { id: topup.wallet_id }, lock: { mode: 'pessimistic_write' } });
      if (!wallet) throw new Error('Wallet not found during webhook processing');

      // Determinar monto pagado: prefer campo del webhook (totalFee), sino el topup.amount_usd
      const paidAmountUsd = parseFloat((body.totalFee || body.total_fee || topup.amount_usd).toString()) || Number(topup.amount_usd);

      // actualizar wallet
      wallet.usd_balance = Number((Number(wallet.usd_balance) + paidAmountUsd).toFixed(2));
      await walletRepo.save(wallet);

      // buscar type/state por code
      const rechargeType = await manager.getRepository(TransactionType).findOne({ where: { code: TransactionCode.RECHARGE } });
      const completedState = await manager.getRepository(TransactionState).findOne({ where: { code: StatusCode.COMPLETED } });

      // fallback safe: si no existen, lanzamos excepción para que visible el error (mejor que silently fail)
      if (!rechargeType) throw new Error('TransactionType RECHARGE not found in DB');
      if (!completedState) throw new Error('TransactionState COMPLETED not found in DB');

      // crear transaction
      const tx = txRepo.create({
        wallet_id: wallet.id,
        type_id: rechargeType.id,
        status_id: completedState.id,
        amount_usd: paidAmountUsd,
        post_balance: wallet.becoin_balance,
        reference: topup.merchantTradeNo,
      });
      await txRepo.save(tx);

      // actualizar topup
      topup.status = 'COMPLETED';
      topup.usd_granted = paidAmountUsd;
      topup.raw_webhook_payload = JSON.stringify(body);
      await topupRepo.save(topup);
    });

    this.logger.log(`Topup ${merchantTradeNo} processed, credited ${topup.usd_granted} becoins`);
  }
}
