# Payment GiftCard Implementation Roadmap

## Fuente de verdad

Este documento define exclusivamente el orden recomendado para implementar el soporte de **Single Payment with Optional GiftCard**.

No constituye un documento de arquitectura.

Las decisiones arquitectónicas se encuentran definidas únicamente en:

- ADR-007-single-payment-with-optional-giftcard.md
- giftcard-balance-service-design.md

En caso de conflicto, dichos documentos prevalecen sobre este roadmap.

Este roadmap no introduce nuevas decisiones de diseño; únicamente organiza la ejecución de la implementación.

---

# Objetivo

Implementar el soporte para pagos mediante GiftCards respetando estrictamente la arquitectura aprobada.

El desarrollo deberá realizarse de forma incremental, procurando que el sistema compile y permanezca funcional al finalizar cada fase.

Cada fase constituye una unidad de trabajo independiente y verificable.

---

# Fase 1 — Persistencia

## Objetivo

Preparar el modelo de persistencia para soportar el nuevo flujo sin modificar todavía el comportamiento del sistema.

## Archivos afectados

- `src/modules/payments/entities/payment.entity.ts`
- `src/modules/gift-card/entities/user-giftcard.entity.ts`
- `src/database/migrations/...`

## Orden de implementación

1. Incorporar en `Payment` los campos necesarios para registrar la participación de una GiftCard.
2. Incorporar en `UserGiftCard` las estructuras necesarias para soportar reservas temporales.
3. Crear la migración correspondiente.
4. Ejecutar la migración.

## Dependencias

Ninguna.

## Salida esperada

- El proyecto compila.
- Ningún comportamiento funcional cambia.
- Todos los flujos actuales continúan funcionando exactamente igual.

## Riesgos

- Conflictos de migraciones.
- Incompatibilidades entre entidades y base de datos.

## Checklist

- [ ] Migración ejecuta correctamente (Up).
- [ ] Migración revierte correctamente (Down).
- [ ] Proyecto compila.
- [ ] No falla ningún flujo existente.

---

# Fase 2 — GiftCardBalanceService

## Objetivo

Implementar el servicio responsable de administrar el ciclo de vida del saldo de las GiftCards.

## Archivos afectados

- `src/modules/gift-card/services/gift-card-balance.service.ts`

## Orden de implementación

1. Implementar `reserve()`.
2. Implementar `consume()`.
3. Implementar `release()`.
4. Implementar `refund()`.

## Dependencias

Fase 1.

## Salida esperada

- El servicio existe.
- Todavía no es utilizado por ningún flujo de pagos.

## Riesgos

- Pérdida de atomicidad.
- Errores de concurrencia.

## Checklist

- [ ] reserve() valida saldo disponible.
- [ ] reserve() soporta concurrencia.
- [ ] consume() funciona sobre reservas y pagos síncronos.
- [ ] release() es idempotente.
- [ ] refund() mantiene consistencia matemática.

---

# Fase 3 — Integración Wallet

## Objetivo

Incorporar GiftCards al flujo síncrono de Wallet.

## Archivos afectados

- DTOs de Wallet.
- PurchaseOrderPaymentUseCase.

## Orden de implementación

1. Recibir opcionalmente la GiftCard.
2. Validar GiftCard.
3. Calcular monto aplicable.
4. Consumir GiftCard.
5. Ejecutar Wallet únicamente por el saldo restante.
6. Actualizar Payment.

## Dependencias

Fase 2.

## Salida esperada

- Wallet soporta GiftCards.
- Stripe y PayPhone continúan funcionando exactamente igual que antes.

## Riesgos

- Errores de cálculo con descuentos.
- Consumo doble por falta de bloqueo.

## Checklist

- [ ] Wallet sin GiftCard sigue funcionando.
- [ ] Wallet + GiftCard funciona.
- [ ] GiftCard 100% evita usar Wallet.

---

# Fase 4 — Integración Stripe

## Objetivo

Incorporar GiftCards al flujo asincrónico de Stripe.

## Archivos afectados

- stripe-topups.service.ts
- PurchaseOrderPaymentUseCase

## Orden de implementación

1. Reservar saldo al crear el checkout.
2. Configurar Stripe únicamente por el saldo restante.
3. Consumir la reserva cuando llegue el webhook exitoso.
4. Liberar la reserva cuando el checkout falle.

## Dependencias

Fase 3.

## Salida esperada

- Stripe soporta GiftCards.
- Wallet continúa funcionando sin modificaciones.

## Riesgos

- Asociación incorrecta entre reserva y Payment.
- Procesamiento duplicado de webhooks.

## Checklist

- [ ] Reserva correcta.
- [ ] Stripe cobra únicamente el saldo restante.
- [ ] Webhook consume correctamente la reserva.
- [ ] Payment finaliza correctamente.

---

# Fase 5 — Integración PayPhone

## Objetivo

Incorporar GiftCards al flujo asincrónico de PayPhone.

## Archivos afectados

- payments.service.ts
- PurchaseOrderPaymentUseCase

## Orden de implementación

1. Reservar saldo durante la creación del checkout.
2. Configurar PayPhone por el saldo restante.
3. Consumir la reserva cuando llegue la confirmación.
4. Liberar la reserva frente a errores.

## Dependencias

Fase 4.

## Salida esperada

- PayPhone soporta GiftCards.
- Stripe continúa funcionando correctamente.

## Riesgos

- Diferencias de comportamiento respecto de Stripe.
- Idempotencia.

## Checklist

- [ ] Reserva correcta.
- [ ] Cobro parcial correcto.
- [ ] Confirmación correcta.
- [ ] Liberación correcta.

---

# Fase 6 — Cancelaciones, Timeouts y Refunds

## Objetivo

Completar el ciclo de vida del saldo reservado.

## Archivos afectados

- CancelOrderUseCase
- RefundOrderUseCase
- Stripe Webhooks
- PayPhone

## Orden de implementación

1. Liberar reservas en cancelaciones.
2. Liberar reservas por timeout.
3. Liberar reservas por errores definitivos.
4. Implementar refunds hacia GiftCards.

## Dependencias

Fase 5.

## Salida esperada

- Ningún saldo puede quedar retenido permanentemente.
- Todo flujo posee reversión consistente.

## Riesgos

- Release duplicado.
- Refund duplicado.
- Inconsistencias por operaciones concurrentes.

## Checklist

- [ ] Cancelación libera reservas.
- [ ] Timeout libera reservas.
- [ ] Payment Failed libera reservas.
- [ ] Refund devuelve correctamente el saldo.

---

# Validación Final

Antes de considerar terminada la implementación deberán verificarse los siguientes escenarios:

- Pago 100% Wallet.
- Pago 100% GiftCard.
- Pago Wallet + GiftCard.
- Pago Stripe + GiftCard.
- Pago PayPhone + GiftCard.
- Cancelación antes del pago.
- Timeout del checkout.
- Webhook duplicado.
- Dos usuarios intentando consumir simultáneamente la misma GiftCard.
- Reembolso parcial.
- Reembolso total.

---

# Criterio de Finalización

La implementación se considerará finalizada únicamente cuando:

- Todas las fases estén completas.
- Todos los checklists estén aprobados.
- Los flujos existentes continúen funcionando sin regresiones.
- Las reglas establecidas en el ADR-007 y en el GiftCard Balance Service Design se cumplan íntegramente.