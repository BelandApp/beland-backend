import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Creator } from './entities/creator.entity';
import { CreatorsRepository } from './creators.repository';
import { CreatorQueryDto } from './dto/creator-query.dto';
import { RespGetArrayDto, RespGetTypeDto } from 'src/dto/resp-app.dto';
import { SocialNetwork } from './entities/social-network.entity';
import { ContentCategory } from './entities/content-category.entity';

@Injectable()
export class CreatorsService {
  private readonly completeMessage = 'el Creador de Contenido';

  constructor(private readonly repository: CreatorsRepository) {}

  async findAll(
    query: CreatorQueryDto,
  ): Promise<RespGetArrayDto<Creator>> {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;

      return await this.repository.findAll(query, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllSocialNetworks(): Promise<RespGetTypeDto<SocialNetwork>> {
    try {
      return await this.repository.findAllSocialNetworks();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllContentCategories(): Promise<RespGetTypeDto<ContentCategory>> {
    try {
      return await this.repository.findAllContentCategories();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Creator> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(user_id: string): Promise<Creator> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Creator>): Promise<Creator> {
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

  async disactive(id: string): Promise<Creator> {
    try {
      const respuesta = await this.repository.disactive(id);
      return respuesta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async activate(id: string): Promise<Creator> {
    try {
      const respuesta = await this.repository.activate(id);
      return respuesta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Creator>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
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
      throw new ConflictException(
        `No se puede eliminar ${this.completeMessage}, posiblemente tenga registros asociados.`,
      );
    }
  }
}
