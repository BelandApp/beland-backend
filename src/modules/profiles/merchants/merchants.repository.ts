import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, FindOptionsWhere, ILike, Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@zxing/library';
import { User } from '../../users/entities/users.entity';
import { Role } from '../../roles/entities/role.entity';
import { RoleEnum } from '../../roles/enum/role-validate.enum';
import { Merchant } from './entities/merchant.entity';
import { MerchantQueryDto } from './dto/merchant-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { ProfileEnum } from '../../users/enums/profiles.enum';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';

@Injectable()
export class MerchantsRepository {
  constructor(
    @InjectRepository(Merchant)
    private repository: Repository<Merchant>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: MerchantQueryDto,
    page: number,
    limit: number,
    ): Promise<RespGetArrayDto<Merchant>> {

    const where: FindOptionsWhere<Merchant> = {};

    // --- FILTROS ---
    if (query.user_id) where.user_id = query.user_id;

    if (query.address_id) where.address_id = query.address_id;

    if (query.is_active !== undefined) {
        where.is_active = query.is_active === 'true';
    }

    if (query.name) {
        where.name = ILike(`%${query.name}%`);
    }

    if (query.legal_name) {
        where.legal_name = ILike(`%${query.legal_name}%`);
    }

    if (query.ruc) {
        where.ruc = ILike(`%${query.ruc}%`);
    }

    if (query.email) {
        where.email = ILike(`%${query.email}%`);
    }

    if (query.phone) {
        where.phone = ILike(`%${query.phone}%`);
    }

    // --- ORDEN ---
    const orderBy = query.orderBy ?? 'created_at';
    const order = query.order ?? 'DESC';

    const [data, total] = await this.repository.findAndCount({
        where,
        order: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user', 'address'],
    });

    return {
        page,
        limit,
        total,
        data,
    };
  }

  async findByUser(user_id: string): Promise<Merchant> {
        return this.repository.findOne({
            where: { user_id },
            relations: ['user', 'address'],
        });
  }

  async findOne(id: string): Promise<Merchant> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(body: Partial<Merchant>): Promise<Merchant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const merchant = queryRunner.manager.create(Merchant, body);
        const savedMerchant = await queryRunner.manager.save(merchant);

        await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.MERCHANT,
        );

        await queryRunner.commitTransaction();
        return savedMerchant;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  async disactive(id: string): Promise<Merchant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id },
        });

        if (!merchant) {
        throw new NotFoundException('No se encontró el Comercio');
        }

        // 1. Desactivar Merchant
        merchant.is_active = false;
        const savedMerchant = await queryRunner.manager.save(merchant);

        // 2. Remover perfil MERCHANT
        await removeProfileFromUser(
        queryRunner,
        merchant.user_id,
        ProfileEnum.MERCHANT,
        );

        await queryRunner.commitTransaction();
        return savedMerchant;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  async activate (id: string): Promise<Merchant> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id },
        });

        if (!merchant) {
        throw new NotFoundException('No se encontró el Comercio');
        }

        // 1. Activar Merchant
        merchant.is_active = true;
        const savedMerchant = await queryRunner.manager.save(merchant);

        // 2. Asignar perfil MERCHANT
        await assignProfileToUser(
        queryRunner,
        merchant.user_id,
        ProfileEnum.MERCHANT,
        );

        await queryRunner.commitTransaction();
        return savedMerchant;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  async update(id: string, body: Partial<Merchant>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id },
      });

      let deleteResult: DeleteResult = { raw: [], affected: 0 };

      if (merchant) {
        // 1. Buscar perfil MERCHANT
        const profile = await queryRunner.manager.findOne(Profile, {
          where: { name: ProfileEnum.MERCHANT },
        });

        // 2. Eliminar relación user-profile
        if (profile) {
          const userProfile = await queryRunner.manager.findOne(UserProfile, {
            where: {
              user_id: merchant.user_id,
              profile_id: profile.id,
            },
          });

          if (userProfile) {
            await queryRunner.manager.delete(UserProfile, userProfile.id);
          }
        }

        // 3. Eliminar Merchant
        deleteResult = await queryRunner.manager.delete(Merchant, id);
      }

      await queryRunner.commitTransaction();

      // fallback defensivo (mismo patrón que Driver)
      if (!merchant) return await this.repository.delete(id);

      return deleteResult;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
