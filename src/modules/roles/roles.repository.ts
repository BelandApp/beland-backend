import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ValidRoleNames } from './enum/role-validate.enum';

@Injectable()
export class RolesRepository {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleORMRepository: Repository<Role>,
  ) {}

  async findOne(id: string): Promise<Role | null> {
    return this.roleORMRepository.findOne({ where: { role_id: id } });
  }

  async findByName(name: ValidRoleNames): Promise<Role | null> {
    return this.roleORMRepository.findOne({ where: { name } });
  }

  async save(role: Role): Promise<Role> {
    return this.roleORMRepository.save(role);
  }

  create(rolePartial: Partial<Role>): Role {
    return this.roleORMRepository.create(rolePartial);
  }

  async remove(role: Role): Promise<Role> {
    return this.roleORMRepository.remove(role);
  }

  async find(): Promise<Role[]> {
    return this.roleORMRepository.find();
  }
}
