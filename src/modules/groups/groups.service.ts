// src/groups/groups.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { Group } from './entities/group.entity';
import { GroupMember } from '../group-members/entities/group-member.entity';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { GetGroupsQueryDto } from './dto/get-groups-query.dto';
@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createGroup(createGroupDto: Partial<Group>,user_id: string): Promise<Group> {
    this.logger.debug(
      `createGroup(): Intentando crear grupo para el líder ID: ${user_id}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si ya existe un grupo con el mismo nombre (insensible a mayúsculas/minúsculas)
      const existingGroup = await this.groupsRepository.findOneByName(
        createGroupDto.name,
      );
      if (existingGroup) {
        throw new ConflictException(
          `Ya existe un grupo con el nombre "${createGroupDto.name}".`,
        );
      }

      // Guardar la nueva entidad de grupo
      const savedGroup = await queryRunner.manager.save(Group, {
        ...createGroupDto,
        user_id
      });

      // Guardar la membresía del grupo para el líder
      const leaderMembership = await queryRunner.manager.save(GroupMember, {
        group: savedGroup, // Asociar con el grupo recién creado
        user_id, // Asociar con el usuario líder
        role: 'LEADER', // Establecer el rol como LÍDER
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        `createGroup(): Grupo "${savedGroup.name}" (ID: ${savedGroup.id}) creado exitosamente por el líder ${user_id}.`,
      );

      return savedGroup;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `createGroup(): Error durante la transacción de creación de grupo para el líder ID ${user_id}:`,
        error,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error; // Re-lanzar excepciones conocidas
      }
      throw new InternalServerErrorException(
        'Fallo al crear el grupo debido a un error interno.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getGroupsByUserId(user_id: string, is_active?:boolean): Promise<Group[]> {
    try {
    return await this.groupsRepository.getGroupsByUserId(user_id, is_active);
    } catch (error) {
      throw new InternalServerErrorException('Error interno: ', error)
    }
  }

  async findAllGroups(queryDto: GetGroupsQueryDto): Promise<{ groups: Group[]; total: number }> {
    this.logger.debug(
      `findAllGroups(): Obteniendo todos los grupos con consulta: ${JSON.stringify(
        queryDto,
      )}`,
    );
    try {
      const { groups, total } = await this.groupsRepository.findAllPaginated(
        { page: queryDto.page, limit: queryDto.limit },
        { sortBy: queryDto.sortBy, order: queryDto.order },
        {
          name: queryDto.name,
          is_active: queryDto.is_active,
          user_id: queryDto.user_id,
          is_delete: queryDto.is_delete,
        },
      );
      // Transformar entidades a DTOs para la respuesta
      const groupsDto = plainToInstance(Group, groups);
      return { groups: groupsDto, total };
    } catch (error) {
      this.logger.error(
        `findAllGroups(): Error interno del servidor al obtener grupos: ${
          (error as Error).message
        }`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Fallo al recuperar grupos debido a un error interno.',
      );
    }
  }

  async findGroupById(groupId: string): Promise<Group> {
    try {
      const group = await this.groupsRepository.findOneById(groupId);
      if (!group) throw new NotFoundException('Grupo no encontrado')
      return group
    } catch (error) {
      throw new InternalServerErrorException('Error al Recuperar Grupo: ', error)
    }
    
  }

  async update(id: string,body: Partial<Group>, user_id:string): Promise<{success: boolean, message: string}> {
    try{
      const update = await this.groupsRepository.update(id, body, user_id)
      if (update.affected === 0) throw new NotFoundException('El grupo no existe o Usted no es el creador.') 
      return {success: true, message: 'Actualizacion Exitosa'}
    } catch (error) {
      throw new InternalServerErrorException('Error al Actualizar Grupo: ', error)
    }
  }

  async remove(id: string, user_id:string): Promise<{success: boolean, message: string}> {
    try{
      const remove = await this.groupsRepository.remove(id, user_id)
      if (remove.affected === 0) throw new NotFoundException('El grupo no existe o Usted no es el creador.') 
      return {success: true, message: 'Eliminación Exitosa'}
    } catch (error) {
      throw new InternalServerErrorException('Error al Eliminar Grupo: ', error)
    }
  }

  /*async addGroupMember(
    createGroupMemberDto: CreateGroupMemberDto,
  ): Promise<GroupMemberDto> {
    this.logger.debug(
      `addGroupMember(): Añadiendo usuario ${createGroupMemberDto.user_id} al grupo ${createGroupMemberDto.group_id}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verificar la existencia del grupo y cargar ansiosamente los miembros con sus detalles de usuario
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: createGroupMemberDto.group_id },
        relations: ['members', 'leader', 'members.user'], // Cargar ansiosamente miembros y sus usuarios asociados
      });
      if (!group) {
        throw new NotFoundException(
          `Grupo con ID "${createGroupMemberDto.group_id}" no encontrado.`,
        );
      }

      // 2. Encontrar al usuario invitado
      const invitedUser: User | null = await queryRunner.manager.findOne(User, {
        where: { id: createGroupMemberDto.user_id },
      });

      if (!invitedUser) {
        throw new NotFoundException(
          'Usuario invitado no encontrado por las credenciales proporcionadas (user_id).',
        );
      }

      // 3. Verificar si el usuario ya es miembro
      const isAlreadyMember = group.members.some(
        (member) => member.user?.id === invitedUser.id, // Usar encadenamiento opcional para seguridad
      );

      if (isAlreadyMember) {
        throw new ConflictException(
          `El usuario "${invitedUser.email}" ya es miembro del grupo "${group.name}".`,
        );
      }

      // 4. Prevenir la asignación directa de un nuevo líder a través de este método, a menos que sea la creación inicial del grupo manejada por createGroup
      // Para promover a un miembro a líder, usa updateGroupMemberRole
      if (
        createGroupMemberDto.role === 'LEADER' &&
        group.user !== null &&
        group.user.id !== invitedUser.id
      ) {
        throw new BadRequestException(
          'No se puede añadir directamente un nuevo líder a un grupo existente a través de este método. Usa el endpoint de actualización de rol de miembro para promover a un miembro existente.',
        );
      }

      // 5. Crear la nueva membresía de grupo
      const newMembership = this.groupMembersRepository.create({
        group: group,
        user: invitedUser,
        role: createGroupMemberDto.role || 'MEMBER', // Usar el rol del DTO o predeterminar a MIEMBRO
      });

      // Guardar la nueva membresía usando el queryRunner.manager
      const savedMembership = await queryRunner.manager.save(
        GroupMember,
        newMembership,
      );

      await queryRunner.commitTransaction();
      this.logger.log(
        `addGroupMember(): Usuario ${invitedUser.email} añadido al grupo ${group.name} exitosamente.`,
      );
      // Retornar la representación DTO de la nueva membresía, incluyendo relaciones pobladas
      return plainToInstance(GroupMemberDto, savedMembership, {
        enableCircularCheck: true,
        excludeExtraneousValues: true,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `addGroupMember(): Error durante la transacción de añadir miembro al grupo:`,
        error,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Fallo al añadir el usuario al grupo debido a un error interno.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getGroupMembers(groupId: string): Promise<GroupMemberDto[]> {
    this.logger.debug(
      `getGroupMembers(): Obteniendo miembros para el grupo ID: ${groupId}`,
    );
    const group = await this.groupsRepository.findOneById(groupId); // Asegurar que el grupo existe
    if (!group) {
      throw new NotFoundException(`Grupo con ID "${groupId}" no encontrado.`);
    }

    const members = await this.groupMembersRepository.findGroupMembersByGroupId(
      groupId,
    );
    return plainToInstance(GroupMemberDto, members);
  }

  async updateGroupMemberRole(
    memberId: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<GroupMemberDto> {
    this.logger.debug(
      `updateGroupMemberRole(): Actualizando miembro del grupo con ID: ${memberId} con datos: ${JSON.stringify(
        updateGroupMemberDto,
      )}`,
    );

    const existingMembership = await this.groupMembersRepository.findOneById(
      memberId,
    );

    if (!existingMembership) {
      throw new NotFoundException(
        `Miembro del grupo con ID "${memberId}" no encontrado.`,
      );
    }

    if (
      updateGroupMemberDto.role &&
      updateGroupMemberDto.role === 'LEADER' &&
      existingMembership.role !== 'LEADER'
    ) {
      const group = await this.groupsRepository.findOneById(
        existingMembership.group.id,
      );
      if (group) {
        const leaderMemberships = group.members.filter(
          (m) => m.role === 'LEADER' && m.id !== memberId,
        );
        if (leaderMemberships.length > 0) {
          throw new BadRequestException(
            'Un grupo solo puede tener un líder. Por favor, degrada al líder actual primero.',
          );
        }
      }
    }

    Object.assign(existingMembership, updateGroupMemberDto);

    const updatedMembership = await this.groupMembersRepository.saveGroupMember(
      existingMembership,
    );
    this.logger.log(
      `updateGroupMemberRole(): Miembro del grupo ${memberId} actualizado exitosamente.`,
    );
    return plainToInstance(GroupMemberDto, updatedMembership);
  }

  async removeGroupMember(memberId: string): Promise<void> {
    this.logger.debug(
      `removeGroupMember(): Eliminando miembro del grupo con ID: ${memberId}`,
    );
    const groupMember = await this.groupMembersRepository.findOneById(memberId);

    if (!groupMember) {
      throw new NotFoundException(
        `Miembro del grupo con ID "${memberId}" no encontrado.`,
      );
    }

    if (groupMember.role === 'LEADER') {
      const group = await this.groupsRepository.findOneById(
        groupMember.group.id,
      );
      if (group) {
        const leaderMemberships = group.members.filter(
          (m) => m.role === 'LEADER' && m.id !== memberId,
        );
        if (leaderMemberships.length === 0) {
          throw new BadRequestException(
            'No se puede eliminar al último líder de un grupo activo. Por favor, asigna otro líder primero o elimina el grupo.',
          );
        }
      }
    }

    await this.groupMembersRepository.deleteGroupMember(memberId);
    this.logger.log(
      `removeGroupMember(): Miembro del grupo ${memberId} eliminado exitosamente.`,
    );
  }

  async inviteUserToGroup(
    groupId: string,
    inviteUserDto: InviteUserDto,
    currentUserId: string,
  ): Promise<GroupInvitationDto> {
    this.logger.debug(
      `inviteUserToGroup(): Orquestando invitación para grupo ${groupId} y usuario ${JSON.stringify(
        inviteUserDto,
      )} por ${currentUserId}`,
    );

    const createInvitationDto: CreateGroupInvitationDto = {
      // Especificar tipo para asegurar compatibilidad
      group_id: groupId,
      email: inviteUserDto.email,
      username: inviteUserDto.username,
      // Asegurarse de que 'phone' sea de tipo string en CreateGroupInvitationDto y GroupInvitation.
      // Si inviteUserDto.phone es un número y CreateGroupInvitationDto.phone es string, necesitarás
      // convertirlo: String(inviteUserDto.phone)
      phone: inviteUserDto.phone as string, // Realiza un type assertion aquí.
      role: inviteUserDto.role || 'MEMBER', // Asigna un rol predeterminado si no se proporciona
    };

    return await this.groupInvitationsService.createInvitation(
      createInvitationDto,
      currentUserId,
    );
  }*/
}
