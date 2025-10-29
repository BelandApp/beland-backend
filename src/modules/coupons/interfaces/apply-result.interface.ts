import { Coupon } from '../entities/coupon.entity';

/**
 * src/modules/coupons/interfaces/apply-result.interface.ts
 *
 * Interfaz para el resultado de la aplicación de un cupón.
 * Define la estructura que debe tener el objeto ApplyResult.
 */
export interface ApplyResult {
  /** Indica si el cupón se aplicó con éxito (siempre true en el camino de éxito). */
  success: boolean;
  /** El ID del cupón aplicado. */
  couponId: string;
  /** El monto total original de la compra antes del descuento. */
  originalTotal: number;
  /** El valor del descuento aplicado. */
  discountAmount: number;
  /** El nuevo monto total de la compra después de aplicar el descuento. */
  newTotal: number;
  /** Mensaje de estado que explica el resultado del descuento aplicado. */
  message: string;
  /** El objeto completo del cupón que fue aplicado. */
  coupon: Coupon;
}
