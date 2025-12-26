import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Hub } from './entities/hub.entity';
import { HubsRepository } from './hubs.repository';
import { HubQueryDto } from './dto/hub-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@Injectable()
export class HubsService {
  private readonly completeMessage = 'el Centro de Acopio';

  constructor(private readonly repository: HubsRepository) {}

  async findAll(query: HubQueryDto): Promise<RespGetArrayDto<Hub>> {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;

      return await this.repository.findAll(query, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Hub> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(user_id: string): Promise<Hub> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Hub>): Promise<Hub> {
    try {
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

  async disactiveHub(id: string): Promise<Hub> {
    try {
      return await this.repository.disactive(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async activateHub(id: string): Promise<Hub> {
    try {
      return await this.repository.activate(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Hub>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new ConflictException(
        `No se puede eliminar ${this.completeMessage}, posiblemente tenga registros asociados.`,
      );
    }
  }
}
