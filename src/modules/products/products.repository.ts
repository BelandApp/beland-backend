import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository, In, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderDto } from 'src/common/dto/order.dto';
import { GroupType } from 'src/modules/group-type/entities/group-type.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Product | null> {
    return this.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return this.findOne({
      where: { name },
      relations: { category: true },
    });
  }

  async findAllPaginated(
    pagination: PaginationDto,
    order: OrderDto,
    category_id?: string,
    name?: string,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = pagination;
    const { sortBy = 'created_at', order: orderDir = 'DESC' } = order;

    this.logger.log(
      `[ProductRepository] Parámetros recibidos: ${JSON.stringify({
        pagination,
        order,
        category_id,
        name,
      })}`,
    );

    // Validar columnas ordenables
    const validSortColumns = ['created_at', 'name', 'price', 'cost'];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';

    this.logger.log(
      `[ProductRepository] Ordenando por: ${sortColumn} ${orderDir.toUpperCase()}`,
    );

    // Construcción del where dinámico
    const where: any = {};

    if (name) {
      this.logger.log(
        `[ProductRepository] Filtro aplicado: name ILIKE %${name}%`,
      );
      where.name = ILike(`%${name}%`);
    }

    if (category_id) {
      this.logger.log(
        `[ProductRepository] Filtro aplicado: category.id = ${category_id}`,
      );
      where.category = { id: category_id };
    }

    where.is_experience = false;

    this.logger.log(
      `[ProductRepository] WHERE final: ${JSON.stringify(where)}`,
    );

    this.logger.log(
      `[ProductRepository] Paginación: page=${page}, limit=${limit}, skip=${(page - 1) * limit}`,
    );

    // Ejecución con findAndCount
    const [products, total] = await this.findAndCount({
      where,
      relations: {
        category: true, // ← incluye la relación
      },
      order: {
        [sortColumn]: orderDir.toUpperCase() as 'ASC' | 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    this.logger.log(
      `[ProductRepository] Resultados obtenidos: total=${total}, productos=${products.length}`,
    );

    return {
      products,
      total,
      page,
      limit,
    };
  }


  async addGroupTypesToProduct(
    productId: string,
    groupTypeIds: string[],
  ): Promise<Product> {
    const productRepo = this.dataSource.getRepository(Product);
    const groupRepo = this.dataSource.getRepository(GroupType);

    // Buscar producto con la relación
    const product = await productRepo.findOne({
      where: { id: productId },
      relations: ['group_types'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    // Buscar los tipos de grupo
    const groupTypes = await groupRepo.findBy({ id: In(groupTypeIds) });

    if (!groupTypes.length) {
      throw new NotFoundException(
        `No se encontraron GroupTypes para los IDs especificados`,
      );
    }

    // Agregar evitando duplicados
    const existingIds = new Set(product.group_types.map((gt) => gt.id));
    const newGroupTypes = groupTypes.filter((gt) => !existingIds.has(gt.id));

    product.group_types = [...product.group_types, ...newGroupTypes];

    return await productRepo.save(product);
  }

  // Nuevo método para eliminar todos los productos de forma permanente
  // MÁS SEGURO Y MEJOR FORMA de borrar todo
  async deleteAllProducts(): Promise<void> {
    this.logger.warn(
      'Ejecutando la eliminación permanente de todos los productos.',
    );
    await this.createQueryBuilder().delete().execute();
  }

  // Nuevo método para encontrar productos con soft-delete
  async findSoftDeleted(): Promise<Product[]> {
    this.logger.log('Buscando productos eliminados con soft-delete.');
    return this.createQueryBuilder('product')
      .withDeleted()
      .where('product.deleted_at IS NOT NULL')
      .getMany();
  }
}
