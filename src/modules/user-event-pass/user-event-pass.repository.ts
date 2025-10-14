import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { UserEventPass } from './entities/user-event-pass.entity';
import { EventPass } from '../event-pass/entities/event-pass.entity';
import { User } from '../users/entities/users.entity';
import { Transaction } from '../transactions/entities/transaction.entity'; 
import { UserEventPassFiltersDto } from './dto/user-eventpass-filters.dto';
import { Wallet } from '../wallets/entities/wallet.entity';
import { TransactionState } from '../transaction-state/entities/transaction-state.entity';
import { TransactionType } from '../transaction-type/entities/transaction-type.entity';
import { StatusCode } from '../transaction-state/enum/status.enum';
import { TransactionCode } from '../transactions/enum/transaction-code';

@Injectable()
export class UserEventPassRepository {
  constructor(
    @InjectRepository(UserEventPass)
    private readonly repository: Repository<UserEventPass>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

// 🔍 FIND ALL (paginated + filters)
async findAll(
  page: number,
  limit: number,
  filters?: UserEventPassFiltersDto,
): Promise<[UserEventPass[], number]> {
  const where: FindOptionsWhere<UserEventPass> = {};

  if (filters?.is_consumed !== undefined)
    where.is_consumed = filters.is_consumed;
  if (filters?.is_active !== undefined)
    where.is_active = filters.is_active;
  if (filters?.is_refunded !== undefined)
    where.is_refunded = filters.is_refunded;
  if (filters?.event_pass_id)
    where.event_pass_id = filters.event_pass_id;
  if (filters?.user_id)
    where.user_id = filters.user_id;

  return this.repository.findAndCount({
    where,
    relations: ['event_pass', 'user'],
    order: { purchase_date: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });
}


  // 🔎 FIND ONE (with relations)
  async findOne(id: string): Promise<UserEventPass | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['event_pass', 'user'],
    });
  }

  //PURCHASE EVENT PASS — Atomic transactional
  async purchaseEventPass(
    user_id: string,
    event_pass_id: string,
    holder_name: string,
    holder_phone?: string,
    holder_document?: string,
  ): Promise<UserEventPass> {
    return await this.dataSource.transaction(async (manager) => {
      const walletRepo = manager.getRepository(Wallet);
      const eventRepo = manager.getRepository(EventPass);
      const transRepo = manager.getRepository(Transaction);
      const statusRepo = manager.getRepository(TransactionState);
      const typeRepo = manager.getRepository(TransactionType);
      const passRepo = manager.getRepository(UserEventPass);

      // 1️⃣ Buscar usuario y evento
      const [event, walletUser, status, typePurchase, typeSale] = await Promise.all([
        eventRepo.findOne({ where: { id: event_pass_id, is_active: true } }),
        walletRepo.findOne({where: {user_id}}),
        statusRepo.findOne({where: {code: StatusCode.COMPLETED}}),
        typeRepo.findOne({where: {code: TransactionCode.PURCHASE_EVENTPASS}}),
        typeRepo.findOne({where: {code: TransactionCode.SALE_EVENTPASS}}),
      ]);

      if (!event)
        throw new NotFoundException('Evento no encontrado o inactivo.');
      if (!walletUser)
        throw new NotFoundException('Billetera de usuario no encontrada.');
      if (!status)
        throw new NotFoundException('Estado de transaccion no encontrado. ', StatusCode.COMPLETED);
      if (!typePurchase)
        throw new NotFoundException('Tipo de transaccion no encontrado. ', TransactionCode.PURCHASE_EVENTPASS);
      if (!typeSale)
        throw new NotFoundException('Tipo de transaccion no encontrado. ', TransactionCode.SALE_EVENTPASS);

      // 2️⃣ Validar saldo y disponibilidad
      if (+walletUser.becoin_balance < +event.price_becoin)
        throw new BadRequestException('Saldo insuficiente.');
      if (!event.available) {
        throw new BadRequestException('Entradas agotadas.');
      }

      // 2️⃣ Bis - sumar una entrada vendida y deshabilitar si alcanza el limite.
      event.sold_tickets = +event.sold_tickets + 1;
      if (+event.sold_tickets >= +event.limit_tickets)
          event.available = false;
      await eventRepo.save(event);

      // 3️⃣ Descontar saldo del usuario
      walletUser.becoin_balance = +walletUser.becoin_balance - +event.price_becoin;
      await walletRepo.save(walletUser);

      // 4️⃣ Acreditar saldo al organizador (si existe)
      const walletEvent = await walletRepo.findOne({
        where: { user_id: event.created_by_id },
      });
      if (!walletEvent) throw new NotFoundException('Billetera del Organizador del evento No encontrada.');

      walletEvent.becoin_balance = +walletEvent.becoin_balance + +event.price_becoin;
      await walletRepo.save(walletEvent);

      // 5️⃣ Crear transacción PURCHASE_EVENTPASS en la wallet del usuario
      const purchaseTx = transRepo.create({
        wallet_id: walletUser.id,
        type_id: typePurchase.id,
        status_id: status.id,
        related_wallet_id: walletEvent.id,
        post_balance: +walletUser.becoin_balance,
        amount_becoin: event.price_becoin,
        reference: 'EVENTPASS -' + event_pass_id,
      });
      await transRepo.save(purchaseTx);

      // 5️⃣BIS Crear transacción SALE_EVENTPASS en la wallet del creador del evento
      const saleTx = transRepo.create({
        wallet_id: walletEvent.id,
        type_id: typeSale.id,
        status_id: status.id,
        related_wallet_id: walletUser.id,
        post_balance: +walletEvent.becoin_balance,
        amount_becoin: event.price_becoin,
        reference: 'EVENTPASS -' + event_pass_id,
      });
      await transRepo.save(saleTx);

      // 6️⃣ Crear entrada adquirida
      const newPass = passRepo.create({
        user_id,
        event_pass_id,
        holder_name,
        holder_phone,
        holder_document,
        purchase_price: event.price_becoin,
        is_consumed: false,
        is_active: true,
      });
      const savedPass = await passRepo.save(newPass);

      // 7️⃣ Actualizar contador de tickets vendidos
      event.sold_tickets = +event.sold_tickets + 1;
      await eventRepo.save(event);

      return savedPass;
    });
  }

    // 🔄 DEVOLUTION EVENT PASS — refund process
    // 💸 REFUND EVENT PASS — Atomic transactional
    async refundEventPass(
    user_id: string,
    user_eventpass_id: string,
    ): Promise<UserEventPass> {
    return await this.dataSource.transaction(async (manager) => {
        const walletRepo = manager.getRepository(Wallet);
        const eventRepo = manager.getRepository(EventPass);
        const transRepo = manager.getRepository(Transaction);
        const statusRepo = manager.getRepository(TransactionState);
        const typeRepo = manager.getRepository(TransactionType);
        const passRepo = manager.getRepository(UserEventPass);

        // 1️⃣ Buscar la entrada adquirida y validar existencia
        const userPass = await passRepo.findOne({
        where: { id: user_eventpass_id, user_id }
        });

        if (!userPass)
        throw new NotFoundException('Entrada no encontrada.');
        if (userPass.is_consumed)
        throw new BadRequestException('La entrada ya fue utilizada y no puede devolverse.');

        const event = await eventRepo.findOne({ where: { id: userPass.event_pass_id } });
        if (!event)
        throw new NotFoundException('Evento no encontrado.');

        // 2️⃣ Validar si el evento permite devoluciones
        if (!event.is_refundable)
        throw new BadRequestException('El evento no permite devoluciones.');

        // 3️⃣ Validar que esté dentro del plazo permitido
        const now = new Date();
        const daysDiff =
        (event.event_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff < event.refund_days_limit)
        throw new BadRequestException(`Solo se permiten devoluciones hasta ${event.refund_days_limit} días antes del evento.`);

        // 4️⃣ Repositorios relacionados
        const [walletUser, walletOrganizer, status, typeRefund, typeDevolution] =
        await Promise.all([
            walletRepo.findOne({ where: { user_id } }),
            walletRepo.findOne({ where: { user_id: event.created_by_id } }),
            statusRepo.findOne({ where: { code: StatusCode.COMPLETED } }),
            typeRepo.findOne({ where: { code: TransactionCode.REFUND_EVENTPASS } }),
            typeRepo.findOne({ where: { code: TransactionCode.DEVOLUTION_EVENTPASS } }),
        ]);

        if (!walletUser)
        throw new NotFoundException('Billetera del usuario no encontrada.');
        if (!walletOrganizer)
        throw new NotFoundException('Billetera del organizador no encontrada.');
        if (!status || !typeRefund || !typeDevolution)
        throw new NotFoundException('Datos de tipo o estado de transacción incompletos.');

        // 5️⃣ Validar que el organizador tenga fondos suficientes para devolver
        if (+walletOrganizer.becoin_balance < +userPass.purchase_price)
        throw new BadRequestException('El organizador no tiene saldo suficiente para realizar el reembolso.');

        // 6️⃣ Realizar movimientos de saldo
        walletUser.becoin_balance = +walletUser.becoin_balance + +userPass.purchase_price;
        walletOrganizer.becoin_balance = +walletOrganizer.becoin_balance - +userPass.purchase_price;
        await walletRepo.save([walletUser, walletOrganizer]);

        // 7️⃣ Crear transacciones
        const refundTx = transRepo.create({
        wallet_id: walletUser.id,
        type_id: typeRefund.id,
        status_id: status.id,
        related_wallet_id: walletOrganizer.id,
        post_balance: +walletUser.becoin_balance,
        amount_becoin: +userPass.purchase_price,
        reference: 'REFUND EVENTPASS - ' + userPass.event_pass_id,
        });
        await transRepo.save(refundTx);

        const devolutionTx = transRepo.create({
        wallet_id: walletOrganizer.id,
        type_id: typeDevolution.id,
        status_id: status.id,
        related_wallet_id: walletUser.id,
        post_balance: +walletOrganizer.becoin_balance,
        amount_becoin: +userPass.purchase_price,
        reference: 'DEVOLUTION EVENTPASS - ' + userPass.event_pass_id,
        });
        await transRepo.save(devolutionTx);

        // 8️⃣ Actualizar contador de tickets vendidos
        event.sold_tickets = Math.max(0, +event.sold_tickets - 1);
        await eventRepo.save(event);

        // 9️⃣ Desactivar o eliminar la entrada
        userPass.is_active = false;
        userPass.is_refunded = true;
        userPass.refunded_at = new Date();
        await passRepo.save(userPass);

        return userPass;
    });
    }

    // user-event-pass.repository.ts
    async consumeEventPass(
    user_eventpass_id: string,
    eventpass_id: string, // me lo da el qr
    ): Promise<{ success: boolean; message: string; userEventPass?: UserEventPass }> {
    return this.dataSource.transaction(async (manager) => {
        const passRepo = manager.getRepository(UserEventPass);
        const eventpassRepo = manager.getRepository(EventPass);

        // 1️⃣ Buscar entrada adquirida con su EventPass y usuario
        const userPass = await passRepo.findOne({
        where: { id: user_eventpass_id },
        relations: {event_pass:true},
        });
        const eventPass = await eventpassRepo.findOne({where: {id: eventpass_id}})

        if (!userPass) throw new NotFoundException('Entrada de usuario no encontrada.');
        if (!eventPass) throw new NotFoundException('Entrada no encontrada.');

        if (userPass.event_pass_id !== eventpass_id)
          throw new BadRequestException('La entrada que estas intentando usar no pertenece a este evento.');

        // 2️⃣ Validaciones básicas
        if (!userPass.is_active)
          throw new BadRequestException('Esta entrada no está activa.');
        if (userPass.is_consumed)
          throw new BadRequestException('Esta entrada ya fue utilizada.');
        if (userPass.is_refunded)
          throw new BadRequestException('Esta entrada fue reembolsada y no puede usarse.');

        // 4️⃣ Marcar como consumida
        userPass.is_consumed = true;
        userPass.redemption_date = new Date();
        await passRepo.save(userPass);

        eventPass.attended_count = +eventPass.attended_count + 1;
        await eventpassRepo.save(eventPass);

        return {
        success: true,
        message: 'Entrada validada y consumida correctamente.',
        userEventPass: userPass,
        };
    });
    }


}
