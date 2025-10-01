import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserAddress } from './entities/user-address.entity';
import { UserAddressRepository } from './user-address.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UserAddressService {
  private readonly completeMessage = 'la dirección de usuario';

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
