// src/group-member-consumptions/group-member-consumptions.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GroupMemberConsumptionsRepository } from './group-members-consumption.repository';
import { GroupMemberConsumption } from './entities/group-members-consumption.entity';
import { GroupMemberConsumptionFiltersDto } from './dto/group-member-consumption-filters.dto';
import {
  CreateGroupMemberConsumptionDto,
  CreateManyGroupMemberConsumptionDto,
} from './dto/create-group-members-consumption.dto';
import { UpdateGroupMemberConsumptionDto } from './dto/update-group-members-consumption.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@Injectable()
export class GroupMemberConsumptionsService {
  private readonly logger = new Logger(
    GroupMemberConsumptionsService.name,
  );

  constructor(
    private readonly consumptionsRepository: GroupMemberConsumptionsRepository,
  ) {}

  // ============================
  // FIND ALL (con filtros)
  // ============================
  async findAll(
    filters: GroupMemberConsumptionFiltersDto,
  ): Promise<RespGetArrayDto<GroupMemberConsumption>> {
    try {
      return await this.consumptionsRepository.findAll(filters);
    } catch (error) {
      this.logger.error(
        'findAll(): Error obteniendo consumos',
        error,
      );
      throw new InternalServerErrorException(
        'Error al obtener los consumos',
      );
    }
  }

  // ============================
  // FIND ONE
  // ============================
  async findOne(id: string): Promise<GroupMemberConsumption> {
    try {
      const entity =
        await this.consumptionsRepository.findOneById(id);

      if (!entity) {
        throw new NotFoundException(
          'Consumo no encontrado',
        );
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'findOne(): Error obteniendo consumo',
        error,
      );
      throw new InternalServerErrorException(
        'Error al obtener el consumo',
      );
    }
  }

  // ============================
  // AGRUPADO POR PRODUCTO
  // ============================
  async findGroupedByProduct(group_id: string) {
    try {
      return await this.consumptionsRepository.findGroupedByProduct(
        group_id,
      );
    } catch (error) {
      this.logger.error(
        'findGroupedByProduct(): Error obteniendo resumen',
        error,
      );
      throw new InternalServerErrorException(
        'Error al obtener consumos agrupados',
      );
    }
  }

  // ============================
  // CREATE ONE
  // ============================
  async createOne(
    dto: CreateGroupMemberConsumptionDto,
  ): Promise<GroupMemberConsumption> {
    try {
      return await this.consumptionsRepository.createOne(dto);
    } catch (error) {
      this.logger.error(
        'createOne(): Error creando consumo',
        error,
      );
      throw new InternalServerErrorException(
        'Error al crear el consumo',
      );
    }
  }

  // ============================
  // CREATE MANY
  // ============================
  async createMany(
    dto: CreateManyGroupMemberConsumptionDto,
    user_id: string,
  ): Promise<GroupMemberConsumption[]> {
    try {
      if (!dto.productsNotes || dto.productsNotes.length === 0) {
        throw new BadRequestException(
          'Debe enviar al menos un producto',
        );
      }

      const result =
        await this.consumptionsRepository.createMany(
          dto,
          user_id,
        );

      this.logger.log(
        `createMany(): ${result.length} consumos creados para user ${user_id} en group ${dto.group_id}`,
      );

      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        'createMany(): Error creando consumos',
        error,
      );
      throw new InternalServerErrorException(
        'Error al registrar los consumos',
      );
    }
  }

  // ============================
  // UPDATE
  // ============================
  async update(
    id: string,
    dto: UpdateGroupMemberConsumptionDto,
  ): Promise<GroupMemberConsumption> {
    try {
      const updated =
        await this.consumptionsRepository.updateOne(
          id,
          dto,
        );

      if (!updated) {
        throw new NotFoundException(
          'Consumo no encontrado',
        );
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'update(): Error actualizando consumo',
        error,
      );
      throw new InternalServerErrorException(
        'Error al actualizar el consumo',
      );
    }
  }

  // ============================
  // DELETE
  // ============================
  async remove(
    id: string,
  ): Promise<{ success: boolean }> {
    try {
      const result =
        await this.consumptionsRepository.deleteOne(id);

      if (result.affected === 0) {
        throw new NotFoundException(
          'Consumo no encontrado',
        );
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        'remove(): Error eliminando consumo',
        error,
      );
      throw new InternalServerErrorException(
        'Error al eliminar el consumo',
      );
    }
  }
}
