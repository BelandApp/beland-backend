import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecyclersRepository } from './recyclers.repository';
import { RecyclerBase } from './entities/recycler.entity';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { RecyclerBaseQueryDto } from './dto/recycler-base-query.dto';

@Injectable()
export class RecyclersService {
  private readonly completeMessage = 'el Reciclador de Base';

  constructor(private readonly repository: RecyclersRepository) {}

  async findAll(
    query: RecyclerBaseQueryDto,
  ): Promise<RespGetArrayDto<RecyclerBase>> {
    try {
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;

      return await this.repository.findAll(query, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<RecyclerBase> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByUser(user_id: string): Promise<RecyclerBase> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<RecyclerBase>): Promise<RecyclerBase> {
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

  async disactiveRecycler(id: string): Promise<RecyclerBase> {
    try {
      return await this.repository.disactive(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async activateRecycler(id: string): Promise<RecyclerBase> {
    try {
      return await this.repository.activate(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<RecyclerBase>) {
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
