// src/group-services/group-services.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GroupService } from './entities/group-service.entity';
import { CreateGroupServiceDto } from './dto/create-group-service.dto';
import { UpdateGroupServiceDto } from './dto/update-group-service.dto';

@Injectable()
export class GroupServicesRepository extends Repository<GroupService> {
  constructor(dataSource: DataSource) {
    super(GroupService, dataSource.createEntityManager());
  }

  /* ======================================================
   * CREATE
   * ====================================================== */
  async createOne(dto: CreateGroupServiceDto & { cost: number }) {
    const entity = this.create({
      ...dto,
      is_completed: false,
    });

    return this.save(entity);
  }

  /* ======================================================
   * FIND
   * ====================================================== */
  async findAll() {
    return this.find({
      relations: {
        group: true,
        service: true,
        payment_type: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOneById(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        group: true,
        service: true,
        payment_type: true,
      },
    });
  }

  async findByGroup(group_id: string) {
    return this.find({
      where: { group_id },
      relations: {
        service: true,
        payment_type: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findPendingByGroup(group_id: string) {
    return this.find({
      where: {
        group_id,
        is_completed: false,
      },
      relations: {
        service: true,
        payment_type: true,
      },
    });
  }

  /* ======================================================
   * UPDATE
   * ====================================================== */
  async updateOne(id: string, dto: UpdateGroupServiceDto) {
    await this.update(id, dto);
    return this.findOneById(id);
  }

  async markAsCompleted(id: string) {
    await this.update(id, { is_completed: true });
    return this.findOneById(id);
  }

  /* ======================================================
   * DELETE
   * ====================================================== */
  async deleteOne(id: string) {
    return this.delete(id);
  }
}
