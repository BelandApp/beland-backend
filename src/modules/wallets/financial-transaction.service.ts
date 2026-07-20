import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class FinancialTransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async debitUsd(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<Wallet> {
    if (amount <= 0) throw new InternalServerErrorException('Amount must be positive');
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new InternalServerErrorException('Wallet not found');

    wallet.usd_balance = Number(wallet.usd_balance) - amount;
    return manager.save(Wallet, wallet);
  }

  async creditUsd(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<Wallet> {
    if (amount <= 0) throw new InternalServerErrorException('Amount must be positive');
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new InternalServerErrorException('Wallet not found');

    wallet.usd_balance = Number(wallet.usd_balance) + amount;
    return manager.save(Wallet, wallet);
  }

  async creditOrange(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<Wallet> {
    if (amount <= 0) throw new InternalServerErrorException('Amount must be positive');
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new InternalServerErrorException('Wallet not found');

    wallet.becoin_orange = Number(wallet.becoin_orange) + amount;
    return manager.save(Wallet, wallet);
  }

  async debitOrange(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<Wallet> {
    if (amount <= 0) throw new InternalServerErrorException('Amount must be positive');
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new InternalServerErrorException('Wallet not found');

    wallet.becoin_orange = Number(wallet.becoin_orange) - amount;
    return manager.save(Wallet, wallet);
  }

  async creditGreen(
    manager: EntityManager,
    walletId: string,
    amount: number,
  ): Promise<Wallet> {
    if (amount <= 0) throw new InternalServerErrorException('Amount must be positive');
    const wallet = await manager.findOne(Wallet, {
      where: { id: walletId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new InternalServerErrorException('Wallet not found');

    wallet.becoin_green = Number(wallet.becoin_green) + amount;
    return manager.save(Wallet, wallet);
  }

  async createTransaction(
    manager: EntityManager,
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    const tx = manager.create(Transaction, payload);
    return manager.save(Transaction, tx);
  }
}
