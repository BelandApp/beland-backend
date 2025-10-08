import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { NotFoundException } from '@zxing/library';
import { User } from '../users/entities/users.entity';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/enum/role-validate.enum';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectRepository(Organization)
    private repository: Repository<Organization>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    user_id: string,
    page: number,
    limit: number,
  ): Promise<[Organization[], number]> {
    const where = user_id ? { user_id } : {};

    return this.repository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Organization> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(body: Partial<Organization>): Promise<Organization> {
    return await this.repository.save(body);
  }

  async disactiveOrganization (id: string): Promise<Organization> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await queryRunner.manager.findOne(Organization, {
        where: {id}
      });
      if (!organization) throw new NotFoundException('No se encontro la Organizacion')
    
      const user = await queryRunner.manager.findOne(User, {
        where: {id: organization.user_id}
      })
      if (!user) throw new NotFoundException('No se encontro el usuario propietario de la organizacion');

      organization.is_active = false;
      await queryRunner.manager.save(organization);

      const role = await queryRunner.manager.findOne(Role, {
        where: {name: RoleEnum.USER}
      })
      if (!role) throw new NotFoundException(`No se encontro el Rol ${RoleEnum.USER}`);

      user.role_name = role.name;
      user.role_id = role.role_id;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return organization;
    } catch (error) {
      // ❌ Deshacer todo si algo falla
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Cerrar el queryRunner
      await queryRunner.release();
    }
  }

  async update(id: string, body: Partial<Organization>): Promise<UpdateResult> {
    return await this.repository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
