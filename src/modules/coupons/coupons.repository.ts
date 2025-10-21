import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult, MoreThan } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponUsage } from './entities/coupon-usage.entity'; // Importar CouponUsage

// Helper para verificar si un error tiene una propiedad stack (para log)
function isError(error: unknown): error is Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as Error).stack === 'string'
  );
}

@Injectable()
export class CouponsRepository {
  private readonly logger = new Logger(CouponsRepository.name);

  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private usageRepository: Repository<CouponUsage>, // Inyectar CouponUsage Repository
  ) {}

  /**
   * Lista cupones. Si se proporciona user_id, lista los cupones creados por ese user_id (para COMMERCE).
   */
  async findAll(
    user_id: string,
    page: number,
    limit: number,
  ): Promise<[Coupon[], number]> {
    try {
      // Si user_id está presente, se filtra por el creador (Asumido rol COMMERCE)
      const where: any = user_id ? { created_by_user_id: user_id } : {};

      return this.couponRepository.findAndCount({
        where,
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['created_by_user'],
      });
    } catch (error) {
      this.logger.error(
        'Error al buscar todos los cupones:',
        isError(error) ? error.stack : String(error),
      );
      throw error;
    }
  }

  async findAvailableByCommerce(
    commerceId: string,
    page: number,
    limit: number,
  ): Promise<[Coupon[], number]> {
    try {
      const now = new Date();

      return this.couponRepository.findAndCount({
        where: {
          created_by_user_id: commerceId, // Usar created_by_user_id
          is_active: true,
          expires_at: MoreThan(now), // Cupones no expirados
        },
        order: { created_at: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (error) {
      this.logger.error(
        'Error al buscar cupones disponibles por comercio:',
        error,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Coupon> {
    return this.couponRepository.findOne({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Coupon> {
    return this.couponRepository.findOne({
      where: { code },
    });
  }

  async create(body: Partial<Coupon>): Promise<Coupon> {
    return await this.couponRepository.save(body);
  }

  async update(id: string, body: Partial<Coupon>): Promise<UpdateResult> {
    return await this.couponRepository.update(id, body);
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.couponRepository.delete(id);
    } catch (error) {
      this.logger.error(
        'Error al eliminar cupón:',
        isError(error) ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Crea un nuevo registro de uso para el cupón.
   */
  async createCouponUsage(
    usageData: Partial<CouponUsage>,
  ): Promise<CouponUsage> {
    try {
      const newUsage = this.usageRepository.create(usageData);
      return await this.usageRepository.save(newUsage);
    } catch (error) {
      this.logger.error(
        'Error al crear el registro de uso del cupón:',
        isError(error) ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Cuenta los usos de un cupón específico por un usuario específico.
   */
  async countUserUsages(coupon_id: string, user_id: string): Promise<number> {
    return this.usageRepository.count({
      where: { coupon_id, user_id },
    });
  }

  /**
   * Cuenta el total de usos de un cupón específico.
   */
  async countTotalUsages(coupon_id: string): Promise<number> {
    return this.usageRepository.count({
      where: { coupon_id },
    });
  }
}
