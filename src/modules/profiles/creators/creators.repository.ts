import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { Creator } from './entities/creator.entity';
import { CreatorQueryDto } from './dto/creator-query.dto'; 

import { SocialNetwork } from './entities/social-network.entity';
import { ContentCategory } from './entities/content-category.entity';

import { Profile } from '../../users/entities/profile.entity';
import { UserProfile } from '../../users/entities/profile-user.entity';
import { ProfileEnum } from '../../users/enums/profiles.enum';

import { RespGetArrayDto, RespGetTypeDto } from 'src/dto/resp-app.dto';
import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';

@Injectable()
export class CreatorsRepository {
  constructor(
    @InjectRepository(Creator)
    private readonly repository: Repository<Creator>,
    private readonly dataSource: DataSource,
  ) {}

  // -------------------------
  // FIND ALL (con filtros)
  // -------------------------
  async findAll(
    query: CreatorQueryDto,
    page: number,
    limit: number,
  ): Promise<RespGetArrayDto<Creator>> {

    const where: FindOptionsWhere<Creator> = {};

    // --- FILTROS ---
    if (query.user_id) where.user_id = query.user_id;

    if (query.main_social_network_id)
      where.main_social_network_id = query.main_social_network_id;

    if (query.category_id)
      where.category_id = query.category_id;

    if (query.is_active !== undefined) {
      where.is_active = query.is_active === true;
    }

    // --- ORDEN ---
    const orderBy = query.orderBy ?? 'created_at';
    const order = query.order ?? 'DESC';

    const [data, total] = await this.repository.findAndCount({
      where,
      order: { [orderBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user', 'social_network', 'content_category'],
    });

    return { page, limit, total, data };
  }

  // -------------------------
  // FIND ONE
  // -------------------------
  async findOne(id: string): Promise<Creator> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'social_network', 'content_category'],
    });
  }

  // -------------------------
  // FIND BY USER
  // -------------------------
  async findByUser(user_id: string): Promise<Creator> {
    return this.repository.findOne({
      where: { user_id },
      relations: ['user', 'social_network', 'content_category'],
    });
  }

  // -------------------------
  // CREATE
  // -------------------------
  async create(body: Partial<Creator>): Promise<Creator> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const creator = queryRunner.manager.create(Creator, body);
      const savedCreator = await queryRunner.manager.save(creator);

      await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.CREATOR,
      );

      await queryRunner.commitTransaction();
      return savedCreator;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // -------------------------
  // DISACTIVE
  // -------------------------
  async disactive(id: string): Promise<Creator> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const creator = await queryRunner.manager.findOne(Creator, {
        where: { id },
      });

      if (!creator) {
        throw new NotFoundException('No se encontró el Creador');
      }

      creator.is_active = false;
      const saved = await queryRunner.manager.save(creator);

      await removeProfileFromUser(
        queryRunner,
        creator.user_id,
        ProfileEnum.CREATOR,
      );

      await queryRunner.commitTransaction();
      return saved;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // -------------------------
  // ACTIVATE
  // -------------------------
  async activate(id: string): Promise<Creator> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const creator = await queryRunner.manager.findOne(Creator, {
        where: { id },
      });

      if (!creator) {
        throw new NotFoundException('No se encontró el Creador');
      }

      creator.is_active = true;
      const saved = await queryRunner.manager.save(creator);

      await assignProfileToUser(
        queryRunner,
        creator.user_id,
        ProfileEnum.CREATOR,
      );

      await queryRunner.commitTransaction();
      return saved;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // -------------------------
  // UPDATE
  // -------------------------
  async update(id: string, body: Partial<Creator>): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  // -------------------------
  // REMOVE (bien hecho)
  // -------------------------
  async remove(id: string): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const creator = await queryRunner.manager.findOne(Creator, {
        where: { id },
      });

      let deleteResult: DeleteResult = { raw: [], affected: 0 };

      if (creator) {
        const profile = await queryRunner.manager.findOne(Profile, {
          where: { name: ProfileEnum.CREATOR },
        });

        if (profile) {
          const userProfile = await queryRunner.manager.findOne(UserProfile, {
            where: {
              user_id: creator.user_id,
              profile_id: profile.id,
            },
          });

          if (userProfile) {
            await queryRunner.manager.delete(UserProfile, userProfile.id);
          }
        }

        deleteResult = await queryRunner.manager.delete(Creator, id);
      }

      await queryRunner.commitTransaction();

      if (!creator) return this.repository.delete(id);

      return deleteResult;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ======================================================
  // EXTRA: TIPOS AUXILIARES
  // ======================================================

  async findAllSocialNetworks(): Promise<RespGetTypeDto<SocialNetwork>> {
    const [data, total] =
      await this.dataSource.manager.findAndCount(SocialNetwork);

    return { data, total };
  }

  async findAllContentCategories(): Promise<RespGetTypeDto<ContentCategory>> {
    const [data, total] =
      await this.dataSource.manager.findAndCount(ContentCategory);

    return { data, total };
  }
}
