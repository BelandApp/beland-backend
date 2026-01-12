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
import { DataSource, IsNull } from 'typeorm';
import { GroupMember } from './entities/group-member.entity';
import { RoleGroupEnum } from './enums/role-group.enum';
import { CreateGroupMemberDto, CreateManyGroupMemberDto } from './dto/create-group-member.dto';
import { PaymentTypeCode } from '../payment-types/enum/payment-type.enum';
import { CartItemsRepository } from '../cart-items/cart-items.repository';

@Injectable()
export class GroupMembersService {
  private readonly logger = new Logger(GroupMembersService.name);

  constructor(
    private readonly repository: GroupMembersRepository,
    private readonly itemsRepository: CartItemsRepository,
    private readonly dataSource: DataSource,
  ) { }

  async createGroupMember(createDto: CreateGroupMemberDto): Promise<GroupMember> {
    const { group_id, user_id } = createDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener el grupo con su tipo de pago y el carrito activo
      // (Necesitamos el carrito para saber QUÉ items repartir entre el nuevo total de miembros)
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: group_id },
        relations: { 
          payment_type: true,
        }
      });

      if (!group) throw new NotFoundException(`Grupo no encontrado.`);

      // 2. Validaciones de Usuario
      const userToAdd = await queryRunner.manager.findOne(User, {
        where: { id: user_id, deleted_at: IsNull(), isBlocked: false }
      });
      if (!userToAdd) throw new NotFoundException(`Usuario no encontrado.`);

      // 3. Verificar duplicados
      const existing = await queryRunner.manager.findOne(GroupMember, {
        where: { group_id, user_id }
      });
      if (existing) throw new ConflictException('Este usuario ya es miembro del grupo.');

      // 4. Guardar el nuevo miembro
      const member = await queryRunner.manager.save(GroupMember, {
        group_id,
        user_id,
        role: RoleGroupEnum.MEMBER,
      });

      // 5. RECALCULO CONDICIONAL
      // Solo si el pago es EQUAL_SPLIT y hay un carrito activo procesándose
      if (
        group.payment_type?.code === PaymentTypeCode.EQUAL_SPLIT
      ) {
        await this.itemsRepository.recalculateSharedBalances(group.cart.id, queryRunner);
      }

      await queryRunner.commitTransaction();
      return member;

    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      if (error?.code === '23505') {
        throw new ConflictException('Este usuario ya es miembro del grupo.');
      }
      
      throw new InternalServerErrorException('Error al crear la membresía.');
    } finally {
      await queryRunner.release();
    }
  }

  async createMany(dto: CreateManyGroupMemberDto, req_user_id: string): Promise<{ message: string; success: true }> {
    const { group_id, users } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar grupo, cargar tipo de pago y carrito en una sola consulta
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: group_id },
        relations: { 
          payment_type: true,
          cart: true // Cargamos el carrito para el recalculo posterior
        }
      });

      if (!group) {
        throw new NotFoundException(`Grupo con ID "${group_id}" no encontrado.`);
      }

      if (group.user_id !== req_user_id) {
        throw new ForbiddenException(`Solo el creador del grupo puede agregar miembros.`);
      }

      // 2. Procesar los usuarios en el bucle
      for (const user_id of users) {
        // Validar usuario (activo y no bloqueado como en la función individual)
        const user = await queryRunner.manager.findOne(User, {
          where: { id: user_id, deleted_at: IsNull(), isBlocked: false },
        });
        
        if (!user) {
          throw new NotFoundException(`Usuario con ID "${user_id}" no encontrado o inactivo.`);
        }

        // Validar membresía existente
        const existing = await queryRunner.manager.findOne(GroupMember, {
          where: { 
            group_id: group_id, 
            user_id: user_id 
          },
        });

        if (existing) {
          throw new ConflictException(`El usuario con ID "${user_id}" ya es miembro.`);
        }

        // Crear membresía (usamos IDs directamente para mayor velocidad)
        const member = queryRunner.manager.create(GroupMember, {
          group_id,
          user_id,
          role: RoleGroupEnum.MEMBER,
        });

        await queryRunner.manager.save(member);
      }

      // 3. RECALCULO ÚNICO AL FINAL
      // Si el pago es EQUAL_SPLIT y el grupo tiene un carrito, recalculamos una sola vez
      if (
        group.payment_type?.code === PaymentTypeCode.EQUAL_SPLIT &&
        group.cart?.id
      ) {
        await this.itemsRepository.recalculateSharedBalances(group.cart.id, queryRunner);
      }

      await queryRunner.commitTransaction();
      return { message: 'Miembros agregados correctamente.', success: true };

    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      // Manejo de errores específicos
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof ConflictException) {
        throw error;
      }

      if (error?.code === '23505') {
        throw new ConflictException('Uno o más usuarios ya son miembros del grupo.');
      }

      throw new InternalServerErrorException('Error al agregar múltiples miembros.');
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

async deleteGroupMember(id: string, requester_id: string): Promise<{ message: string, success: boolean }> {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Obtener la membresía con contexto de grupo, tipo de pago y carrito
    const membership = await queryRunner.manager.findOne(GroupMember, {
      where: { id },
      relations: {
        group: {
          payment_type: true,
          cart: true // Necesario para el recalculo
        }
      }
    });

    if (!membership) throw new NotFoundException('Membresía no encontrada');

    // 2. Validar permisos
    const is_user_owner = membership.user_id === requester_id;
    const is_user_admin = membership.group.user_id === requester_id;
    
    if (!is_user_owner && !is_user_admin) {
      throw new ForbiddenException('No tienes permiso para eliminar a este miembro.');
    }

    // 3. Guardar datos necesarios antes de la eliminación
    const cartId = membership.group.cart?.id;
    const paymentTypeCode = membership.group.payment_type?.code;
    const groupId = membership.group_id;

    // 4. Eliminar la membresía
    await queryRunner.manager.delete(GroupMember, id);

    // 5. RECALCULO
    // Si el grupo está en EQUAL_SPLIT, debemos repartir la carga entre los que quedan
    if (paymentTypeCode === PaymentTypeCode.EQUAL_SPLIT && cartId) {
      await this.itemsRepository.recalculateSharedBalances(cartId, queryRunner);
    }

    await queryRunner.commitTransaction();
    
    return { message: 'Membresía eliminada correctamente.', success: true };

  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Error al eliminar la membresía.');
  } finally {
    await queryRunner.release();
  }
}

async removeMemberByGroupAndUser(
  groupId: string, 
  userId: string, 
  req_user_id: string
): Promise<{ message: string, success: boolean }> {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Buscar la membresía con relaciones para tener el contexto del balance
    const membership = await queryRunner.manager.findOne(GroupMember, {
      where: { 
        group_id: groupId, 
        user_id: userId 
      },
      relations: {
        group: {
          payment_type: true,
          cart: true
        }
      }
    });

    if (!membership) {
      throw new NotFoundException('El usuario no es miembro de este grupo');
    }

    // 2. Validar permisos (Mismo criterio: dueño de la membresía o admin del grupo)
    const is_user_owner = membership.user_id === req_user_id;
    const is_user_admin = membership.group.user_id === req_user_id;
    
    if (!is_user_owner && !is_user_admin) {
      throw new ForbiddenException('No tienes permiso para eliminar a este miembro.');
    }

    // 3. Guardar datos para el recalculo antes de borrar
    const cartId = membership.group.cart?.id;
    const paymentTypeCode = membership.group.payment_type?.code;

    // 4. Eliminar la membresía
    const deleteResult = await queryRunner.manager.delete(GroupMember, membership.id);
    
    if (deleteResult.affected === 0) {
      throw new NotFoundException('No se encontró la membresía a eliminar.');
    }

    // 5. RECALCULO GRUPAL
    // Solo recalculamos si el tipo de pago es por división equitativa
    if (paymentTypeCode === PaymentTypeCode.EQUAL_SPLIT && cartId) {
      await this.itemsRepository.recalculateSharedBalances(cartId, queryRunner);
    }

    await queryRunner.commitTransaction();
    
    return { message: 'Membresía eliminada correctamente.', success: true };

  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Error al eliminar la membresía.');
  } finally {
    await queryRunner.release();
  }
}

}


