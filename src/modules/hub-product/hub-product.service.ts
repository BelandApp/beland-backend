import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HubProductsRepository } from './hub-product.repository'; 
import { HubProduct } from './entities/hub-product.entity';
import { HubProductQueryDto } from './dto/hub-product-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@Injectable()
export class HubProductsService {
  private readonly completeMessage = 'el item de stock';

  constructor(
    private readonly repository: HubProductsRepository,
  ) {}

  // LISTAR STOCK (general con filtros)
  async findAll(
    query: HubProductQueryDto,
  ): Promise<RespGetArrayDto<HubProduct>> {
    try {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;

      return await this.repository.findAll(query, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // OBTENER UN ITEM DE STOCK
  async findOne(id: string): Promise<HubProduct> {
    try {
      const res = await this.repository.findOne(id);

      if (!res) {
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      }

      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // CREAR ITEM DE STOCK
  async create(body: Partial<HubProduct>): Promise<HubProduct> {
    try {
      const res = await this.repository.create(body);

      if (!res) {
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      }

      return res;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  // ACTUALIZAR ITEM DE STOCK
  async update(id: string, body: Partial<HubProduct>) {
    try {
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

  // ELIMINAR ITEM DE STOCK
  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);

      if (res.affected === 0) {
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      }

      return res;
    } catch (error) {
      throw new ConflictException(
        `No se puede eliminar ${this.completeMessage}, posiblemente tenga registros asociados.`,
      );
    }
  }

  // AGREGAR STOCK
  async addStock(
    id: string,
    quantity: number,
  ): Promise<HubProduct> {
    try {
      return await this.repository.addStock(id, quantity);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  // DESCONTAR STOCK
  async discountStock(
    id: string,
    quantity: number,
  ): Promise<HubProduct> {
    try {
      return await this.repository.discountStock(id, quantity);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
