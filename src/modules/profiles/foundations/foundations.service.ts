import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FoundationsRepository } from './foundations.repository';
import { Foundation } from './entities/foundation.entity';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { FoundationQueryDto } from './dto/foundation-query.dto';

@Injectable()
export class FoundationsService {
  private readonly completeMessage = 'la fundación sin fines de lucro';

  constructor(private readonly repository: FoundationsRepository) {}

  async findAll(
    query: FoundationQueryDto,
  ): Promise<RespGetArrayDto<Foundation>> {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;

      return await this.repository.findAll(query, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Foundation> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(user_id: string): Promise<Foundation> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Foundation>): Promise<Foundation> {
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

  async disactiveFoundation(id: string): Promise<Foundation> {
    try {
      const respuesta = await this.repository.disactive(id);
      return respuesta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async activateFoundation(id: string): Promise<Foundation> {
    try {
      const respuesta = await this.repository.activate(id);
      return respuesta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Foundation>) {
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
