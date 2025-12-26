import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';
import { NotFoundException } from '@zxing/library';

import { Hub } from './entities/hub.entity';
import { HubQueryDto } from './dto/hub-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';
import { ProfileEnum } from '../../users/enums/profiles.enum';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';

@Injectable()
export class HubsRepository {
  constructor(
    @InjectRepository(Hub)
    private repository: Repository<Hub>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: HubQueryDto,
    page: number,
    limit: number,
  ): Promise<RespGetArrayDto<Hub>> {
    const where: FindOptionsWhere<Hub> = {};

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

  async findByUser(user_id: string): Promise<Hub> {
    return this.repository.findOne({
      where: { user_id },
      relations: ['address', 'products', 'products.product'],
    });
  }

  async findOne(id: string): Promise<Hub> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'address', 'products', 'products.product'],
    });
  }

  async create(body: Partial<Hub>): Promise<Hub> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hub = queryRunner.manager.create(Hub, body);
      const savedHub = await queryRunner.manager.save(hub);

      await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.HUB,
      );

      await queryRunner.commitTransaction();
      return savedHub;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async disactive(id: string): Promise<Hub> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hub = await queryRunner.manager.findOne(Hub, {
        where: { id },
      });

      if (!hub) {
        throw new NotFoundException('No se encontró el Centro de Acopio');
      }

      // 1. Desactivar Hub
      hub.is_active = false;
      const savedHub = await queryRunner.manager.save(hub);

      // 2. Remover perfil HUB
      await removeProfileFromUser(
        queryRunner,
        hub.user_id,
        ProfileEnum.HUB,
      );

      await queryRunner.commitTransaction();
      return savedHub;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async activate(id: string): Promise<Hub> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hub = await queryRunner.manager.findOne(Hub, {
        where: { id },
      });

      if (!hub) {
        throw new NotFoundException('No se encontró el Centro de Acopio');
      }

      // 1. Activar Hub
      hub.is_active = true;
      const savedHub = await queryRunner.manager.save(hub);

      // 2. Asignar perfil HUB
      await assignProfileToUser(
        queryRunner,
        hub.user_id,
        ProfileEnum.HUB,
      );

      await queryRunner.commitTransaction();
      return savedHub;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, body: Partial<Hub>): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const hub = await queryRunner.manager.findOne(Hub, {
        where: { id },
        });

        let deleteResult: DeleteResult = { raw: [], affected: 0 };

        if (hub) {
        // 1. Buscar perfil HUB
        const profile = await queryRunner.manager.findOne(Profile, {
            where: { name: ProfileEnum.HUB },
        });

        // 2. Eliminar relación user-profile
        if (profile) {
            const userProfile = await queryRunner.manager.findOne(UserProfile, {
            where: {
                user_id: hub.user_id,
                profile_id: profile.id,
            },
            });

            if (userProfile) {
            await queryRunner.manager.delete(UserProfile, userProfile.id);
            }
        }

        // 3. Eliminar Hub
        deleteResult = await queryRunner.manager.delete(Hub, id);
        }

        await queryRunner.commitTransaction();

        // fallback defensivo (mismo patrón que Driver)
        if (!hub) return await this.repository.delete(id);

        return deleteResult;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

}
