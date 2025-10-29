import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsRepository } from './coupons.repository';
import { CouponUsage } from './entities/coupon-usage.entity';
import { CouponType } from './enum/coupon-type.enum';
import { ApplyResult } from './interfaces/apply-result.interface'; // Importar la interfaz correcta

// Helper para verificar si un error es una instancia de Error
function isError(error: unknown): error is Error {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Error).message === 'string'
  );
}

// REMOVIDO: export type ApplyResult = { ... } para evitar el shadowing.

@Injectable()
export class CouponsService {
  private readonly completeMessage = 'el cupón';
  private readonly logger = new Logger(CouponsService.name);

  constructor(private readonly repository: CouponsRepository) {}

  async findAll(
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Coupon[], number]> {
    try {
      // user_id es vacío para ADMINs, o el created_by_user_id para COMMERCE
      const response = await this.repository.findAll(
        user_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error al listar cupones: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async findAvailableForCommerce(
    commerceId: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[Coupon[], number]> {
    try {
      const response = await this.repository.findAvailableByCommerce(
        commerceId,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error al listar cupones disponibles para comercio ${commerceId}: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Coupon> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      // Re-lanza NotFoundException o InternalServerErrorException
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Coupon>): Promise<Coupon> {
    try {
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      this.logger.error(
        `Error al crear cupón: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Coupon>): Promise<UpdateResult> {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res;
    } catch (error) {
      this.logger.error(
        `Error al actualizar cupón ${id}: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      return res as DeleteResult;
    } catch (error) {
      this.logger.error(
        `Error al eliminar cupón ${id}: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(error);
    }
  } // --- LÓGICA DE APLICACIÓN Y REDENCIÓN DE CUPÓN (VALIDATE + REDEEM) ---
  /**
   * Valida un cupón, calcula el descuento y registra el uso (redención).
   * NOTA: Para producción con límites de uso, esta lógica debería estar envuelta
   * en una transacción para asegurar atomicidad y evitar doble redención.
   */

  async validateAndRedeemCoupon(
    code: string,
    user_id: string,
    commerce_id: string,
    purchase_total: number, // Nombre armonizado con el DTO
    order_id?: string | null, // Opcional, para el registro de uso
  ): Promise<ApplyResult> {
    try {
      // 1. Buscar el cupón por código
      const coupon = await this.repository.findByCode(code);
      if (!coupon) {
        throw new NotFoundException('Cupón no encontrado.');
      } // 2. Validaciones básicas del cupón

      const now = new Date();

      if (!coupon.is_active) {
        throw new ConflictException('El cupón no está activo.');
      }

      if (coupon.expires_at && coupon.expires_at < now) {
        throw new ConflictException('El cupón ha expirado.');
      } // 2.1 Validar que el cupón sea para el comercio correcto

      if (coupon.created_by_user_id !== commerce_id) {
        throw new ConflictException(
          'El cupón no es válido para este comercio.',
        );
      } // 3. Validaciones de Uso (Límites) // 3.1 Límite de usos total (max_usage_count)

      if (coupon.max_usage_count !== null && coupon.max_usage_count > 0) {
        const totalUsages = await this.repository.countTotalUsages(coupon.id);
        if (totalUsages >= coupon.max_usage_count) {
          throw new ConflictException(
            'El cupón ha alcanzado su límite máximo de usos.',
          );
        }
      } // 3.2 Límite de usos por usuario (usage_limit_per_user)

      if (
        coupon.usage_limit_per_user !== null &&
        coupon.usage_limit_per_user > 0
      ) {
        const userUsages = await this.repository.countUserUsages(
          coupon.id,
          user_id,
        );
        if (userUsages >= coupon.usage_limit_per_user) {
          throw new ConflictException(
            'Ya has alcanzado el límite de uso para este cupón.',
          );
        }
      } // 4. Lógica de cálculo y validación de reglas de negocio específicas

      let discountAmount = 0; // Cambiado a camelCase
      let message = `Cupón ${code} aplicado exitosamente.`;

      if (coupon.type === CouponType.PERCENTAGE) {
        // Validación de gasto mínimo
        if (
          coupon.min_spend_required !== null &&
          purchase_total < coupon.min_spend_required
        ) {
          throw new ConflictException(
            `El cupón requiere una compra mínima de $${coupon.min_spend_required.toFixed(
              2,
            )}.`,
          );
        } // Aplicar porcentaje

        let calculatedDiscount = purchase_total * (coupon.value / 100); // Aplicar tope máximo (max_discount_cap)

        if (
          coupon.max_discount_cap !== null &&
          calculatedDiscount > coupon.max_discount_cap
        ) {
          calculatedDiscount = coupon.max_discount_cap;
          message = `Descuento limitado al tope máximo de $${calculatedDiscount.toFixed(
            2,
          )}.`;
        }

        discountAmount = parseFloat(calculatedDiscount.toFixed(2));
        message = `¡Descuento de ${
          coupon.value
        }% aplicado! Monto: $${discountAmount.toFixed(2)}`;
      } else if (coupon.type === CouponType.FIXED) {
        // Validación de gasto mínimo (MANDATORIO si se configuró)
        if (
          coupon.min_spend_required !== null &&
          purchase_total < coupon.min_spend_required
        ) {
          throw new ConflictException(
            `El cupón fijo requiere una compra mínima de $${coupon.min_spend_required.toFixed(
              2,
            )}.`,
          );
        } // Aplicar monto fijo

        discountAmount = coupon.value; // El descuento no puede ser mayor que el monto de la compra

        if (discountAmount > purchase_total) {
          discountAmount = purchase_total;
        }

        message = `¡Descuento fijo de $${discountAmount.toFixed(2)} aplicado!`;
      } else {
        // Esto no debería suceder si el enum está bien tipado
        throw new ConflictException('Tipo de cupón no soportado.');
      } // Asegurar que el descuento no sea negativo y no exceda el total

      discountAmount = Math.max(0, Math.min(discountAmount, purchase_total)); // Calcular el nuevo total

      const newTotal = purchase_total - discountAmount; // 5. Registrar el uso del cupón (Redención)

      const usageData: Partial<CouponUsage> = {
        coupon_id: coupon.id,
        user_id: user_id,
        original_amount: purchase_total,
        discount_amount: discountAmount, // Usar discountAmount
        order_id: order_id || null, // Se puede pasar el ID de la orden o nulo
      };

      await this.repository.createCouponUsage(usageData); // 6. Devolver resultado de aplicación (Alineado con ApplyResult Interface)

      return {
        success: true, // Requerido por la interfaz
        couponId: coupon.id, // Requerido por la interfaz
        originalTotal: purchase_total, // Requerido por la interfaz
        discountAmount, // Requerido por la interfaz
        newTotal: parseFloat(newTotal.toFixed(2)), // Requerido por la interfaz
        message,
        coupon,
      };
    } catch (error) {
      this.logger.error(
        `Error al aplicar cupón: ${
          isError(error) ? error.message : String(error)
        }`,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al aplicar cupón: ${
          isError(error) ? error.message : String(error)
        }`,
      );
    }
  }
}
