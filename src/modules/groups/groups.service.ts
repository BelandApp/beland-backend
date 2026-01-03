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
import { GetGroupsQueryDto } from './dto/filters-groups.dto';
import { RoleGroupEnum } from '../group-members/enums/role-group.enum';
import { RespGetTypeDto } from 'src/dto/resp-app.dto';
import { GroupPrivacy } from './entities/group-privacy.entity';
import { UserAddress } from '../user-address/entities/user-address.entity';
import { GroupType } from '../group-type/entities/group-type.entity';
import { PaymentType } from '../payment-types/entities/payment-type.entity';
@Injectable()
export class GroupsService {
  
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: GetGroupsQueryDto,
  ): Promise<{
    data: Group[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
    } = query;

    const [data, total] =
      await this.groupsRepository.findAllWithFilters(query);

    return {
      data,
      total,
      page,
      limit,
    };
  }

async getInfoCreate(): Promise<{
    user_address: UserAddress[];
    group_types: GroupType[];
    group_privacies: GroupPrivacy[];
    payment_types: PaymentType[];
  }> {
    const [
      user_address,
      group_types,
      group_privacies,
      payment_types,
    ] = await Promise.all([
      this.dataSource.getRepository(UserAddress).find({ where: { is_active: true } }),
      this.dataSource.getRepository(GroupType).find(),
      this.dataSource.getRepository(GroupPrivacy).find({ where: { is_active: true } }),
      this.dataSource.getRepository(PaymentType).find({ where: { is_active: true } }),
    ]);

    return {
      user_address,
      group_types,
      group_privacies,
      payment_types,
    };
  }

  async getGroupPrivacy(): Promise<RespGetTypeDto<GroupPrivacy>> {
    const [data, total] = await this.dataSource.manager.findAndCount(GroupPrivacy)
    return {data, total}
  }

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
        group_id: savedGroup.id, // Asociar con el grupo recién creado
        user_id, // Asociar con el usuario líder
        role: RoleGroupEnum.LEADER, // Establecer el rol como LÍDER
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
  // falta incluir paginacion en todos los que devuvlen array
  async getGroupsCreatedByUserId(user_id: string, is_active?:boolean): Promise<Group[]> {
    try {
    return await this.groupsRepository.getGroupsCreatedByUserId(user_id, is_active);
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

}
