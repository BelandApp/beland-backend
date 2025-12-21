import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { HubProduct } from './entities/hub-product.entity';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { HubProductQueryDto } from './dto/hub-product-query.dto';

@Injectable()
export class HubProductsRepository {
  constructor(
    @InjectRepository(HubProduct)
    private readonly repository: Repository<HubProduct>,
    private readonly dataSource: DataSource,
  ) {}

  // FIND ALL (stock general)
  async findAll(
    query: HubProductQueryDto,
    page: number,
    limit: number,
  ): Promise<RespGetArrayDto<HubProduct>> {
    const where: FindOptionsWhere<HubProduct> = {};

    if (query.hub_id) where.hub_id = query.hub_id;
    if (query.product_id) where.product_id = query.product_id;

    if (query.quantity_min !== undefined) {
      where.quantity = MoreThanOrEqual(query.quantity_min);
    }

    if (query.quantity_max !== undefined) {
      where.quantity = LessThanOrEqual(query.quantity_max);
    }

    const orderBy = query.orderBy ?? 'product';
    const order = query.order ?? 'ASC';

    const [data, total] = await this.repository.findAndCount({
      where,
      order: { [orderBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: {hub:true, product:true},
    });

    return {
      page,
      limit,
      total,
      data,
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<HubProduct> {
    return this.repository.findOne({
      where: { id },
      relations: {hub:true, product:true},
    });
  }

  // CREATE
  async create(body: Partial<HubProduct>): Promise<HubProduct> {
    try {
      const entity = this.repository.create(body);
      return await this.repository.save(entity);
    } catch (error) {
      // Unique(hub_id, product_id)
      throw new BadRequestException(
        'El producto ya existe en el stock de este centro de acopio',
      );
    }
  }

  // UPDATE
  async update(id: string, body: Partial<HubProduct>): Promise<UpdateResult> {
    return this.repository.update(id, body);
  }

  // REMOVE
  async remove(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  // ADD STOCK
  async addStock(id: string, quantity: number): Promise<HubProduct> {
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad a agregar debe ser mayor a cero');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hubProduct = await queryRunner.manager.findOne(HubProduct, {
        where: { id },
      });

      if (!hubProduct) {
        throw new NotFoundException('Item de stock no encontrado');
      }

      hubProduct.quantity += quantity;

      const saved = await queryRunner.manager.save(hubProduct);

      await queryRunner.commitTransaction();
      return saved;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // DISCOUNT STOCK
  async discountStock(id: string, quantity: number): Promise<HubProduct> {
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad a descontar debe ser mayor a cero');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hubProduct = await queryRunner.manager.findOne(HubProduct, {
        where: { id },
      });

      if (!hubProduct) {
        throw new NotFoundException('Item de stock no encontrado');
      }

      if (hubProduct.quantity < quantity) {
        throw new BadRequestException(
          'Stock insuficiente para realizar la operación',
        );
      }

      hubProduct.quantity -= quantity;

      const saved = await queryRunner.manager.save(hubProduct);

      // ⚠️ ACÁ ES DONDE SE PUEDE DISPARAR SOCKET / EVENTO
      // if (saved.quantity <= saved.stock_min) {
      //   emitir evento / socket: "Stock mínimo alcanzado"
      // }

      await queryRunner.commitTransaction();
      return saved;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
