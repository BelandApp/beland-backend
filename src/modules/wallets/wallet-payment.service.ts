import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class WalletPaymentService {
  /**
   * Ejecuta el débito de una Wallet y registra la transacción.
   * IMPORTANTE: No abre transacciones propias. Utiliza el manager provisto.
   *
   * @param manager EntityManager (la transacción ya debe estar iniciada por el UseCase)
   * @param walletId ID de la wallet a debitar
   * @param amount Monto a debitar (en USD, debe ser mayor a 0)
   * @param transactionData Datos adicionales para la Transaction (type_id, status_id, reference, etc.)
   * @returns La Transaction creada
   */
  async processPayment(
    manager: EntityManager,
    walletId: string,
    amount: number,
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount to debit must be greater than zero');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.usd_balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Descontar saldo
    wallet.usd_balance = Number(wallet.usd_balance) - amount;
    await manager.save(Wallet, wallet);

    // Generar la Transaction
    const transactionPayload: Partial<Transaction> = {
      ...transactionData,
      wallet_id: wallet.id,
      amount_usd: -amount,
      post_balance: wallet.usd_balance,
    };

    const transaction = manager.create(Transaction, transactionPayload);
    return manager.save(Transaction, transaction);
  }

  /**
   * Bloquea fondos transfiriéndolos del saldo disponible al retenido.
   */
  async lockFunds(
    manager: EntityManager,
    walletId: string,
    amount: number,
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount to lock must be greater than zero');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.usd_balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.usd_balance = Number(wallet.usd_balance) - amount;
    wallet.locked_balance = Number(wallet.locked_balance ?? 0) + amount;
    await manager.save(Wallet, wallet);

    const transactionPayload: Partial<Transaction> = {
      ...transactionData,
      wallet_id: wallet.id,
      amount_usd: -amount,
      post_balance: wallet.usd_balance,
    };

    const transaction = manager.create(Transaction, transactionPayload);
    return manager.save(Transaction, transaction);
  }

  /**
   * Descuenta definitivamente los fondos retenidos y actualiza la transacción.
   */
  async consumeLockedFunds(
    manager: EntityManager,
    walletId: string,
    amount: number,
    transactionId: string,
    transactionUpdates: Partial<Transaction>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.locked_balance) < amount) {
      throw new BadRequestException('Insufficient locked balance');
    }

    wallet.locked_balance = Number(wallet.locked_balance) - amount;
    await manager.save(Wallet, wallet);

    const transaction = await manager.findOne(Transaction, {
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    Object.assign(transaction, transactionUpdates);
    return manager.save(Transaction, transaction);
  }

  /**
   * Libera los fondos retenidos devolviéndolos al saldo disponible y actualiza la transacción.
   */
  async unlockFunds(
    manager: EntityManager,
    walletId: string,
    amount: number,
    transactionId: string,
    transactionUpdates: Partial<Transaction>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.locked_balance) < amount) {
      throw new BadRequestException('Insufficient locked balance');
    }

    wallet.locked_balance = Number(wallet.locked_balance) - amount;
    wallet.usd_balance = Number(wallet.usd_balance) + amount;
    await manager.save(Wallet, wallet);

    const transaction = await manager.findOne(Transaction, {
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    Object.assign(transaction, transactionUpdates);
    return manager.save(Transaction, transaction);
  }
}
