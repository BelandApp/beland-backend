// Define los tipos de cupón solicitados
export enum CouponType {
  PERCENTAGE = 'PERCENTAGE', // Porcentaje con tope máximo (usa max_discount_cap)
  FIXED = 'FIXED', // Monto fijo con gasto mínimo (usa min_spend_required)
  BONUS_COINS = 'BONUS_COINS', // Monedas de bonificación (legado/futuro)
  CIRCULARES = 'CIRCULARES', // Cupones circulantes o de lealtad (legado/futuro)
}
