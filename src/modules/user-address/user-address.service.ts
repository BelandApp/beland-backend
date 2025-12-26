import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserAddress } from './entities/user-address.entity';
import { UserAddressRepository } from './user-address.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UserAddressService {
  private readonly completeMessage = 'la dirección de usuario';
  private readonly logger = new Logger(UserAddressService.name);

  constructor(private readonly repository: UserAddressRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[UserAddress[], number]> {
    try {
      const response = await this.repository.findAll(
        user_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<UserAddress> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<UserAddress>): Promise<UserAddress> {
    try {
      if (body.isDefault) {
        // resetear todas las direcciones anteriores del usuario
        await this.dataSource.manager.update( UserAddress, 
          { user_id: body.user_id },
          { isDefault: false },
        );
      }
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAdressDefault(id: string, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.debug(`Solicitud para establecer dirección por defecto: addressId=${id}, userId=${userId}`);

    try {
      // Buscar dirección
      const address = await queryRunner.manager.findOne(UserAddress, { where: { id } });

      if (!address) {
        this.logger.warn(`Dirección con id=${id} no encontrada`);
        throw new NotFoundException("La dirección no existe");
      }

      // Verificar propiedad del usuario
      if (address.user_id !== userId) {
        this.logger.warn(`Usuario ${userId} intentó modificar dirección que no le pertenece (addressId=${id})`);
        throw new ForbiddenException("Esta dirección no es del usuario. No puede modificarla");
      }

      this.logger.debug(`Reseteando todas las direcciones del usuario=${userId}`);

      // Resetear todas las direcciones de ese usuario a isDefault=false
      await queryRunner.manager.update(
        UserAddress,
        { user_id: userId },
        { isDefault: false }
      );

      // Establecer la dirección actual como default
      address.isDefault = true;

      this.logger.debug(`Estableciendo dirección id=${id} como predeterminada`);

      await queryRunner.manager.save(address);

      // Commit
      await queryRunner.commitTransaction();

      this.logger.log(`Dirección predeterminada actualizada exitosamente para userId=${userId} (addressId=${id})`);

      return address

    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error al actualizar dirección predeterminada: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Error desconocido en updateAdressDefault()', String(error));
      }

      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al actualizar la dirección predeterminada');
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }

  async update(id: string, body: Partial<UserAddress>) {
    try {

      if (body.isDefault) {
        const existing = await this.repository.findOne(id);
        if (!existing) {
          throw new NotFoundException(
            `No se encontró ${this.completeMessage}`,
          );
        }
        // resetear las demás direcciones del usuario
        await this.dataSource.manager.update( UserAddress, 
          { user_id: existing.user_id },
          { isDefault: false },
        );
      }

      const res = await this.repository.update(id, body);

      if (res.affected === 0) {
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      }

      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }
}
