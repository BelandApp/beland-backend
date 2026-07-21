import { Repository, DeleteResult, QueryRunner, DataSource, Not, IsNull } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Cart } from '../cart/entities/cart.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userORMRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  private createQueryBuilder(alias = 'user') {
    return this.userORMRepository.createQueryBuilder(alias);
  }

async findOne(id: string, deleted: boolean = false): Promise<User | null> {
  const where: any = { id };

  if (deleted) {
    where.deleted_at = Not(IsNull());
  } else {
    where.deleted_at = IsNull();
  }

  return this.userORMRepository.findOne({
    where,
    relations: { role: true, profiles: { profile: true } },
  });
}


  async findById(id: string): Promise<User | null> {
    return this.userORMRepository.findOne({
      where: { id },
      relations: { wallet: true, cart: true, role: true, profiles: {profile:true} },
    });
  }

  async findByAuth0Id(auth0_id: string): Promise<User | null> {
    return this.userORMRepository.findOne({
      where: {auth0_id},
      relations: {role:true, wallet:true, cart:true, profiles: { profile: true } }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userORMRepository.findOne({
      where: { email },
      relations: { wallet: true, cart: true, role: true, profiles: { profile: true } },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userORMRepository.findOne({
      where: { username },
      relations: { wallet: true, cart: true, role: true, profiles: { profile: true } },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userORMRepository.findOne({ where: {phone}, relations: {role:true, profiles: { profile: true }}});
  }


  /**
   * Busca todos los usuarios con paginación, ordenación y filtros opcionales.
   * @param paginationOptions Opciones de paginación.
   * @param orderOptions Opciones de ordenación.
   * @param includeDeleted Si se deben incluir usuarios eliminados.
   * @param filterId ID para filtrar.
   * @param filterEmail Email para filtrar.
   * @param filterRoleName Nombre del rol para filtrar.
   * @param filterIsBlocked Estado de bloqueo para filtrar.
   * @returns Un objeto con la lista de usuarios y el total.
   */
  async findAllPaginated(
    getUsersQueryDto: GetUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    // CORRECCIÓN: Asegurarse de desestructurar todas las propiedades del DTO
    const {
      page,
      limit,
      sortBy,
      order,
      includeDeleted,
      id,
      email,
      roleName,
      isBlocked,
      username, // Añadido
      full_name, // Añadido
      oauth_provider, // Añadido
      phone, // Añadido
      country, // Añadido
      city, // Añadido
    } = getUsersQueryDto;

    const query = this.createQueryBuilder('user').leftJoinAndSelect(
      'user.role',
      'role',
    );

    // Aplicar filtros dinámicamente
    if (id) {
      query.andWhere('user.id = :id', { id });
    }
    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }
    if (username) {
      query.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }
    if (full_name) {
      query.andWhere('user.full_name ILIKE :full_name', {
        full_name: `%${full_name}%`,
      });
    }
    if (oauth_provider) {
      query.andWhere('user.oauth_provider ILIKE :oauth_provider', {
        oauth_provider: `%${oauth_provider}%`,
      });
    }
    if (phone) {
      query.andWhere('user.phone = :phone', { phone });
    }
    if (country) {
      query.andWhere('user.country ILIKE :country', {
        country: `%${country}%`,
      });
    }
    if (city) {
      query.andWhere('user.city ILIKE :city', { city: `%${city}%` });
    }
    if (roleName) {
      query.andWhere('role.name = :roleName', { roleName });
    }
    if (typeof isBlocked === 'boolean') {
      query.andWhere('user.isBlocked = :isBlocked', { isBlocked });
    }

    if (!includeDeleted) {
      query.andWhere('user.deleted_at IS NULL');
    }

    const validSortColumns = {
      created_at: 'user.created_at',
      updated_at: 'user.updated_at',
      email: 'user.email',
      username: 'user.username',
      full_name: 'user.full_name',
      role: 'user.role_name',
      isBlocked: 'user.isBlocked',
    };

    const actualSortBy = validSortColumns[sortBy] || 'user.created_at';

    query.orderBy(actualSortBy, order);

    const [users, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  /**
   * Encuentra usuarios que han sido desactivados (soft-deleted).
   * @returns Una lista de entidades User desactivadas.
   */
  async findDeactivatedUsers(): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.deleted_at IS NOT NULL')
      .getMany();
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userORMRepository.create(user)
  }

  async save(user: User): Promise<User> {
    return await this.userORMRepository.save(user)
  }

  async saveUser(user: Partial<User>): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userCreated = await queryRunner.manager.save(User, user)
      if (!userCreated) throw new ConflictException ('No se pudo crear el usuario')
      
      await this.createWalletAndCart(queryRunner, userCreated);

      await queryRunner.commitTransaction();

      return userCreated;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
    
  }

  async createWalletAndCart(queryRunner: QueryRunner, user: User ): Promise<void> {
      this.logger.debug(
        `createWalletAndCart(): Creando Wallet y Cart para el usuario ID: ${user.id}`,
      );
      try {
        // 1. Crear la nueva Wallet sin el QR ni el alias
        const newWallet = queryRunner.manager.create(Wallet, {
          user: user,
        });
  
        // 2. Guardar la Wallet para que se le asigne un ID de la base de datos
        const walletCreated = await queryRunner.manager.save(newWallet);
        this.logger.debug(
          `createWalletAndCart(): Wallet creada con ID: ${newWallet.id} para el usuario ID: ${user.id}`,
        );
  
        // 6. Crear y guardar el Cart
        const newCart = queryRunner.manager.create(Cart, { user: user });
        await queryRunner.manager.save(newCart);
        this.logger.debug(
          `createWalletAndCart(): Cart creado para el usuario ID: ${user.id}`,
        );
      } catch (error: unknown) {
        this.logger.error(
          `createWalletAndCart(): Error al crear Wallet/Cart para el usuario ID: ${
            user.id
          }: ${(error as Error).message}`,
          (error as Error).stack,
        );
        throw new InternalServerErrorException(
          'Fallo al crear la cartera o el carrito del usuario.',
        );
      }
  }

  async update(id: string, partialEntity: Partial<User>): Promise<any> {
    return this.userORMRepository.update({ id }, partialEntity);
  }

  async softDelete(id: string): Promise<void> {
    await this.userORMRepository.update({ id }, { deleted_at: new Date() });
  }

  async remove (id: string): Promise<DeleteResult> {
    return await this.userORMRepository.delete({id});
  }

  async reactivate(id: string): Promise<void> {
    await this.userORMRepository.update({ id }, { deleted_at: null });
  }
}
