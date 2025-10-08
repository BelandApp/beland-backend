import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { TransactionCode } from './enum/transaction-code';
import { Wallet } from '../wallets/entities/wallet.entity';
import { User } from '../users/entities/users.entity';
import { RecentRecipientDto } from './dto/recentRecipient.resp.dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
    @InjectRepository(TransactionState)
    private stateRepository: Repository<TransactionState>,
  ) {}

  async findAll(
    user_id: string,
    status_id: string,
    type_id: string,
    page: number,
    limit: number,
  ): Promise<[Transaction[], number]> {
    const where: any = {};

    if (user_id) {
      where.wallet = { user_id }; // 👈 filtro a través de wallet → user
    }

    if (status_id) {
        where.status_id = status_id;
    }

    if (type_id) {
        where.type_id = type_id;
    }

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['status', 'type'],
    });
  }

  async findUserRecentRecipients(
    user_id: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<RecentRecipientDto[]> { 
    const qb = this.repository 
    .createQueryBuilder('t') 
    .distinctOn(['t.related_wallet_id']) 
    .leftJoinAndSelect('t.type', 'type') 
    .innerJoinAndSelect('t.wallet', 'w') // wallet origen 
    .innerJoinAndSelect('t.related_wallet', 'rw') // wallet destino 
    .innerJoinAndSelect('rw.user', 'u') // user dueño del wallet destino 
    .where('type.code = :code', { code: TransactionCode.TRANSFER_SEND }) 
    .andWhere('w.user_id = :user_id', { user_id }) 
    .orderBy('t.related_wallet_id') 
    .addOrderBy('t.created_at', 'DESC') 
    .skip((page - 1) * limit)
    .take(limit);
    
    const rows = await qb.getMany(); 
    
    // Mapeamos para enviar solo {wallet, user} 
    return rows.map(tx => ({ 
      wallet_id: tx.related_wallet.id, 
      email: tx.related_wallet.user.email, 
      full_name: tx.related_wallet.user.full_name, 
      username: tx.related_wallet.user.username, 
      picture: tx.related_wallet.user.profile_picture_url,
    })); 
  }

  async findOne(id: string): Promise<Transaction> {
    return this.repository.findOne({
      where: { id },
      relations: ['status', 'type'],
    });
  }

  async create(body: Partial<Transaction>): Promise<Transaction> {
    return await this.repository.save({...body});
  }

  async update(id: string, body: Partial<Transaction>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
