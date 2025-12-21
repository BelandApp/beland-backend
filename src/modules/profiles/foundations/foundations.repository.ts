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
import { NotFoundException } from '@nestjs/common';
import { Foundation } from './entities/foundation.entity';
import { FoundationQueryDto } from './dto/foundation-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';
import { ProfileEnum } from '../../users/enums/profiles.enum';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';

@Injectable()
export class FoundationsRepository {
  constructor(
    @InjectRepository(Foundation)
    private readonly repository: Repository<Foundation>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: FoundationQueryDto,
    page: number,
    limit: number,
  ): Promise<RespGetArrayDto<Foundation>> {
    const where: FindOptionsWhere<Foundation> = {};

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

  async findByUser(user_id: string): Promise<Foundation> {
    return this.repository.findOne({
      where: { user_id },
      relations: ['user', 'address'],
    });
  }

  async findOne(id: string): Promise<Foundation> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(body: Partial<Foundation>): Promise<Foundation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundation = queryRunner.manager.create(Foundation, body);
      const savedFoundation = await queryRunner.manager.save(foundation);

      await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.FOUNDATION,
      );

      await queryRunner.commitTransaction();
      return savedFoundation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async disactive(id: string): Promise<Foundation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundation = await queryRunner.manager.findOne(Foundation, {
        where: { id },
      });

      if (!foundation) {
        throw new NotFoundException(
          'No se encontró la fundación sin fines de lucro',
        );
      }

      // 1. Desactivar Fundación
      foundation.is_active = false;
      const savedFoundation = await queryRunner.manager.save(foundation);

      // 2. Remover perfil FOUNDATION
      await removeProfileFromUser(
        queryRunner,
        foundation.user_id,
        ProfileEnum.FOUNDATION,
      );

      await queryRunner.commitTransaction();
      return savedFoundation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async activate(id: string): Promise<Foundation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundation = await queryRunner.manager.findOne(Foundation, {
        where: { id },
      });

      if (!foundation) {
        throw new NotFoundException(
          'No se encontró la fundación sin fines de lucro',
        );
      }

      // 1. Activar Fundación
      foundation.is_active = true;
      const savedFoundation = await queryRunner.manager.save(foundation);

      // 2. Asignar perfil FOUNDATION
      await assignProfileToUser(
        queryRunner,
        foundation.user_id,
        ProfileEnum.FOUNDATION,
      );

      await queryRunner.commitTransaction();
      return savedFoundation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    body: Partial<Foundation>,
  ): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundation = await queryRunner.manager.findOne(Foundation, {
        where: { id },
      });

      let deleteResult: DeleteResult = { raw: [], affected: 0 };

      if (foundation) {
        // 1. Buscar perfil FOUNDATION
        const profile = await queryRunner.manager.findOne(Profile, {
          where: { name: ProfileEnum.FOUNDATION },
        });

        // 2. Eliminar relación user-profile
        if (profile) {
          const userProfile = await queryRunner.manager.findOne(UserProfile, {
            where: {
              user_id: foundation.user_id,
              profile_id: profile.id,
            },
          });

          if (userProfile) {
            await queryRunner.manager.delete(UserProfile, userProfile.id);
          }
        }

        // 3. Eliminar Foundation
        deleteResult = await queryRunner.manager.delete(Foundation, id);
      }

      await queryRunner.commitTransaction();

      // fallback defensivo
      if (!foundation) return await this.repository.delete(id);

      return deleteResult;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
