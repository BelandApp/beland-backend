// src/group-members/group-members.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { GroupMembersRepository } from './group-members.repository';
import { Group } from 'src/modules/groups/entities/group.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { DataSource } from 'typeorm';
import { GroupMember } from './entities/group-member.entity';
import { RoleGroupEnum } from './enums/role-group.enum';
import { CreateGroupMemberDto, CreateManyGroupMemberDto } from './dto/create-group-member.dto';

@Injectable()
export class GroupMembersService {
  private readonly logger = new Logger(GroupMembersService.name);

  constructor(
    private readonly repository: GroupMembersRepository,
    private readonly dataSource: DataSource,
  ) { }

  async createGroupMember(createDto: CreateGroupMemberDto, req_user_id: string): Promise<GroupMember> {
    const { group_id, user_id } = createDto;

    // 1. Check if group exists
    const group = await this.dataSource.manager.findOne(Group, { where: { id: group_id }, relations: {user:true, privacy:true} });
    if (!group) throw new NotFoundException(`Grupo con ID "${group_id}" no encontrado.`);

    if (!group.privacy.allow_free_join) {
      if (group.user_id !== req_user_id) {
        throw new ForbiddenException('No tienes permiso para agregar miembros a este grupo.');
      }
    }
    

    // 3. User existence
    const userToAdd = await this.dataSource.manager.findOne(User, { where: { id: user_id } });
    if (!userToAdd) throw new NotFoundException(`Usuario con ID "${user_id}" no encontrado.`);

    // 4. Check duplicate
    const existing = await this.repository.findOneByGroupAndUser(group_id, user_id);
    if (existing) throw new ConflictException('Este usuario ya es miembro del grupo.');

    try {
      const member = this.repository.create({
        group_id,
        user_id,
        role: RoleGroupEnum.MEMBER,
      });
      return member;
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Este usuario ya es miembro del grupo.');
      }
      throw new InternalServerErrorException('Error interno al crear la membresía.');
    }
  }

  async createMany(dto: CreateManyGroupMemberDto, req_user_id: string): Promise<{ message: string; success: true }> {
    const { group_id, users } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // validar que el grupo exista
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: group_id },
      });
      if (!group) {
        throw new NotFoundException(`Grupo con ID "${group_id}" no encontrado.`);
      }

      if (group.user_id !== req_user_id) {
        throw new ForbiddenException(`Solo el creador del grupo puede agregar miembros.`);
      }

      for (const user_id of users) {
        // validar usuario
        const user = await queryRunner.manager.findOne(User, {
          where: { id: user_id },
        });
        if (!user) {
          throw new NotFoundException(`Usuario con ID "${user_id}" no encontrado.`);
        }

        // validar membresía existente
        const existing = await queryRunner.manager.findOne(GroupMember, {
          where: {
            group: { id: group_id },
            user: { id: user_id },
          },
        });
        if (existing) {
          throw new ConflictException(
            `El usuario "${user_id}" ya es miembro del grupo.`,
          );
        }

        // crear membresía
        const member = queryRunner.manager.create(GroupMember, {
          group,
          user,
          role: RoleGroupEnum.MEMBER,
        });

        await queryRunner.manager.save(member);
      }

      await queryRunner.commitTransaction();
      return { message: 'Miembros agregados correctamente.', success: true };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      // fallback por concurrencia
      if (error?.code === '23505') {
        throw new ConflictException(
          'Uno o más usuarios ya son miembros del grupo.',
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  } 

  async findOne(id: string): Promise<GroupMember> {
    try {
      const member = await this.repository.findOneById(id);
      if (!member) {
        throw new NotFoundException(`Membresía con ID "${id}" no encontrada.`);
      }
      return member;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar la membresía.');
    }
  }

  async findAllByGroupId(groupId: string): Promise<GroupMember[]> {
    try {
      const members = await this.repository.findMembersByGroupId(
        groupId,
      );
      return members;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar la membresía.');
    }
  }

  async findGroupsByUserId(userId: string): Promise<GroupMember[]> {
    try {
      const groups = await this.repository.findGroupsByUserId(userId);
      return groups;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar la membresía.');
    }
  }

  async findOneByGroupAndUser(groupId: string, userId: string): Promise<GroupMember> {
    try {
      const member = await this.repository.findOneByGroupAndUser(groupId, userId);
      if (!member) {
        throw new NotFoundException(`Membresía no encontrada.`);
      }
      return member;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar la membresía.');
    }
  }

  async deleteGroupMember(id: string, user_id: string): Promise<{message: string, success: boolean}> {
    try {
      const membership = await this.repository.findOneById(id);
      if (!membership) throw new NotFoundException('Membresía no encontrada');
      
      const is_user_owner = membership.user_id === user_id;
      const is_user_admin = membership.group.user_id === user_id;
      if (!is_user_owner && !is_user_admin) throw new ForbiddenException('No tienes permiso para eliminar a este miembro.');
      
      await this.repository.delete(id);
      
      return {message: 'Membresía eliminada correctamente.', success: true}
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar la membresía.');
    }
  }

  async removeMemberByGroupAndUser(groupId: string, userId: string, req_user_id: string): Promise<{message: string, success: boolean}> {
    try {
      const membership = await this.repository.findOneByGroupAndUser(groupId, userId);
      if (!membership) throw new NotFoundException('El usuario no es miembro de este grupo');

      const is_user_owner = membership.user_id === req_user_id;
      const is_user_admin = membership.group.user_id === req_user_id;
      if (!is_user_owner && !is_user_admin) throw new ForbiddenException('No tienes permiso para eliminar a este miembro.');
      
      const memebership_deleted = await this.repository.delete(membership.id);
      if (memebership_deleted.affected === 0) throw new NotFoundException('No se encontró la membresía a eliminar.');
      return {message: 'Membresía eliminada correctamente.', success: true}
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar la membresía.');
    }
  }

}


