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

import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { async } from 'rxjs';

@Injectable()
export class GroupMembersService {
  private readonly logger = new Logger(GroupMembersService.name);

  constructor(
    private readonly repository: GroupMembersRepository,
    private readonly dataSource: DataSource,
  ) { }

  async createGroupMember(createDto: CreateGroupMemberDto, requestingUser: User): Promise<GroupMember> {
    const { group_id, user_id } = createDto;

    // 1. Check if group exists
    const group = await this.dataSource.manager.findOne(Group, { where: { id: group_id }, relations: ['user'] });
    if (!group) throw new NotFoundException(`Grupo con ID "${group_id}" no encontrado.`);

    if (group.user_id !== requestingUser.id) {
      throw new ForbiddenException('No tienes permiso para agregar miembros a este grupo.');
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

  async deleteGroupMember(id: string, requestingUser: User): Promise<{message: string, success: boolean}> {
    try {
      const membership = await this.repository.findOneById(id);
      if (!membership) throw new NotFoundException('Membresía no encontrada');
      
      const is_user_owner = membership.user_id === requestingUser.id;
      const is_user_admin = membership.group.user_id === requestingUser.id;
      if (!is_user_owner && !is_user_admin) throw new ForbiddenException('No tienes permiso para eliminar a este miembro.');
      
      const memebership_deleted = await this.repository.delete(id);
      if (memebership_deleted.affected === 0) throw new NotFoundException('No se encontró la membresía a eliminar.');
      return {message: 'Membresía eliminada correctamente.', success: true}
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar la membresía.');
    }
  }

  async removeMemberByGroupAndUser(groupId: string, userId: string, requestingUser: User): Promise<{message: string, success: boolean}> {
    try {
      const membership = await this.repository.findOneByGroupAndUser(groupId, userId);
      if (!membership) throw new NotFoundException('El usuario no es miembro de este grupo');

      const is_user_owner = membership.user_id === requestingUser.id;
      const is_user_admin = membership.group.user_id === requestingUser.id;
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


