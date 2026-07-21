import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

export interface TransactionMetadata {
  type_id: string;
  status_id: string;
  reference?: string;
  clientTransactionId?: string;
}

export interface ReversalPayload {
  sourceWalletId: string;
  destinationWalletId: string;
  amountUsd?: number;
  amountOrange?: number;
  amountGreen?: number;
  transactionData: TransactionMetadata;
}

@Injectable()
export class FinancialReversalService {
  /**
   * Ejecuta una reversión financiera completa garantizando integridad transaccional y previniendo deadlocks.
   *
   * @param manager EntityManager (la transacción ya debe estar iniciada por el UseCase invocador)
   * @param payload Datos de la reversión (wallets, montos y metadata de transacción)
   * @returns Un objeto conteniendo las dos transacciones generadas (débito y crédito)
   */
  async executeReversal(
    manager: EntityManager,
    payload: ReversalPayload,
  ): Promise<{ sourceTransaction: Transaction; destinationTransaction: Transaction }> {
    const { sourceWalletId, destinationWalletId, amountUsd = 0, amountOrange = 0, amountGreen = 0, transactionData } = payload;

    // Validación 1: Ningún monto puede ser negativo.
    if (amountUsd < 0 || amountOrange < 0 || amountGreen < 0) {
      throw new BadRequestException('Negative amounts are not allowed for reversal');
    }

    // Validación 2: Debe existir al menos un monto mayor a cero.
    if (amountUsd === 0 && amountOrange === 0 && amountGreen === 0) {
      throw new BadRequestException('At least one amount (USD, Orange or Green) must be greater than zero for reversal');
    }

    if (sourceWalletId === destinationWalletId) {
      throw new BadRequestException('Source and destination wallets cannot be the same');
    }

    // Prevención de Deadlocks: Ordenamos los IDs para adquirirlos siempre en el mismo orden
    // y evitar que dos reversiones simultáneas cruzadas se bloqueen mutuamente.
    const sortedWalletIds = [sourceWalletId, destinationWalletId].sort();

    // Adquisición SECUENCIAL estricta de bloqueos pesimistas.
    // Reemplazamos Promise.all por un for...of para garantizar que la DB adquiera
    // el lock_1 primero, y luego el lock_2, respetando el orden.
    const wallets = [];
    for (const id of sortedWalletIds) {
      const w = await manager.findOne(Wallet, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      wallets.push(w);
    }

    const walletMap = new Map(wallets.map((w) => [w?.id, w]));

    const sourceWallet = walletMap.get(sourceWalletId);
    const destinationWallet = walletMap.get(destinationWalletId);

    if (!sourceWallet) {
      throw new NotFoundException('Source wallet not found');
    }

    if (!destinationWallet) {
      throw new NotFoundException('Destination wallet not found');
    }

    // Validamos fondos suficientes en la cuenta de origen (contrapartida)
    if (amountUsd > 0 && Number(sourceWallet.usd_balance) < amountUsd) {
      throw new BadRequestException('Insufficient USD balance in source wallet for reversal');
    }
    if (amountOrange > 0 && Number(sourceWallet.becoin_orange) < amountOrange) {
      throw new BadRequestException('Insufficient Orange balance in source wallet for reversal');
    }
    if (amountGreen > 0 && Number(sourceWallet.becoin_green) < amountGreen) {
      throw new BadRequestException('Insufficient Green balance in source wallet for reversal');
    }

    // Debitar de la wallet de origen
    if (amountUsd > 0) {
      sourceWallet.usd_balance = Number(sourceWallet.usd_balance) - amountUsd;
      // Sincronización explícita del balance derivado (1 Becoin = 0.05 USD)
      sourceWallet.becoin_balance = Number((sourceWallet.usd_balance / 0.05).toFixed(2));
    }
    if (amountOrange > 0) sourceWallet.becoin_orange = Number(sourceWallet.becoin_orange) - amountOrange;
    if (amountGreen > 0) sourceWallet.becoin_green = Number(sourceWallet.becoin_green) - amountGreen;

    // Acreditar en la wallet destino
    if (amountUsd > 0) {
      destinationWallet.usd_balance = Number(destinationWallet.usd_balance) + amountUsd;
      // Sincronización explícita del balance derivado
      destinationWallet.becoin_balance = Number((destinationWallet.usd_balance / 0.05).toFixed(2));
    }
    if (amountOrange > 0) destinationWallet.becoin_orange = Number(destinationWallet.becoin_orange) + amountOrange;
    if (amountGreen > 0) destinationWallet.becoin_green = Number(destinationWallet.becoin_green) + amountGreen;

    // Guardar cambios en las wallets
    await manager.save(Wallet, [sourceWallet, destinationWallet]);

    // Generar la Transaction de egreso (Débito a la contrapartida)
    const sourceTransactionPayload: Partial<Transaction> = {
      ...transactionData,
      wallet_id: sourceWallet.id,
      amount_usd: amountUsd > 0 ? -amountUsd : null,
      amount_orange: amountOrange > 0 ? -amountOrange : null,
      amount_green: amountGreen > 0 ? -amountGreen : null,
      post_balance: sourceWallet.usd_balance,
      post_orange_balance: sourceWallet.becoin_orange,
      post_green_balance: sourceWallet.becoin_green,
      related_wallet_id: destinationWallet.id,
    };

    // Generar la Transaction de ingreso (Crédito al usuario)
    const destinationTransactionPayload: Partial<Transaction> = {
      ...transactionData,
      wallet_id: destinationWallet.id,
      amount_usd: amountUsd > 0 ? amountUsd : null,
      amount_orange: amountOrange > 0 ? amountOrange : null,
      amount_green: amountGreen > 0 ? amountGreen : null,
      post_balance: destinationWallet.usd_balance,
      post_orange_balance: destinationWallet.becoin_orange,
      post_green_balance: destinationWallet.becoin_green,
      related_wallet_id: sourceWallet.id,
    };

    const sourceTransaction = manager.create(Transaction, sourceTransactionPayload);
    const destinationTransaction = manager.create(Transaction, destinationTransactionPayload);

    await manager.save(Transaction, [sourceTransaction, destinationTransaction]);

    return { sourceTransaction, destinationTransaction };
  }
}
