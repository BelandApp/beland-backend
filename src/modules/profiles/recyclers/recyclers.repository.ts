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
import { RecyclerBase } from './entities/recycler.entity';
import { RecyclerBaseQueryDto } from './dto/recycler-base-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { assignProfileToUser } from 'src/helpers/assign-profile-to-user.helper';
import { removeProfileFromUser } from 'src/helpers/remove-profile-from-user.helper';
import { ProfileEnum } from '../../users/enums/profiles.enum';

@Injectable()
export class RecyclersRepository {
  constructor(
    @InjectRepository(RecyclerBase)
    private repository: Repository<RecyclerBase>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: RecyclerBaseQueryDto,
    page: number,
    limit: number,
  ): Promise<RespGetArrayDto<RecyclerBase>> {
    const where: FindOptionsWhere<RecyclerBase> = {};

    // --- FILTROS ---
    if (query.user_id) where.user_id = query.user_id;

    if (query.national_id) {
      where.national_id = ILike(`%${query.national_id}%`);
    }

    if (query.belongs_to_association !== undefined) {
      where.belongs_to_association = query.belongs_to_association === 'true';
    }

    if (query.association_name) {
      where.association_name = ILike(`%${query.association_name}%`);
    }

    if (query.has_collection_center !== undefined) {
      where.has_collection_center = query.has_collection_center === 'true';
    }

    if (query.has_mobility !== undefined) {
      where.has_mobility = query.has_mobility === 'true';
    }

    if (query.is_active !== undefined) {
      where.is_active = query.is_active === 'true';
    }

    // --- ORDEN ---
    const orderBy = query.orderBy ?? 'created_at';
    const order = query.order ?? 'DESC';

    const [data, total] = await this.repository.findAndCount({
      where,
      order: { [orderBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return {
      page,
      limit,
      total,
      data,
    };
  }

  async findOne(id: string): Promise<RecyclerBase> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUser(user_id: string): Promise<RecyclerBase> {
    return this.repository.findOne({
      where: { user_id },
      relations: ['user'],
    });
  }

  async create(body: Partial<RecyclerBase>): Promise<RecyclerBase> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recycler = queryRunner.manager.create(RecyclerBase, body);
      const savedRecycler = await queryRunner.manager.save(recycler);

      await assignProfileToUser(
        queryRunner,
        body.user_id,
        ProfileEnum.RECYCLER_BASE,
      );

      await queryRunner.commitTransaction();
      return savedRecycler;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async disactive(id: string): Promise<RecyclerBase> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recycler = await queryRunner.manager.findOne(RecyclerBase, {
        where: { id },
      });

      if (!recycler) {
        throw new NotFoundException('No se encontró el Reciclador de Base');
      }

      recycler.is_active = false;
      const savedRecycler = await queryRunner.manager.save(recycler);

      await removeProfileFromUser(
        queryRunner,
        recycler.user_id,
        ProfileEnum.RECYCLER_BASE,
      );

      await queryRunner.commitTransaction();
      return savedRecycler;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async activate(id: string): Promise<RecyclerBase> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recycler = await queryRunner.manager.findOne(RecyclerBase, {
        where: { id },
      });

      if (!recycler) {
        throw new NotFoundException('No se encontró el Reciclador de Base');
      }

      recycler.is_active = true;
      const savedRecycler = await queryRunner.manager.save(recycler);

      await assignProfileToUser(
        queryRunner,
        recycler.user_id,
        ProfileEnum.RECYCLER_BASE,
      );

      await queryRunner.commitTransaction();
      return savedRecycler;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    body: Partial<RecyclerBase>,
  ): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
