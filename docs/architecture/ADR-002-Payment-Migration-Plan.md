# ADR-002 - Payment Migration Plan

## Estado

Accepted

---

## Objetivo

Documentar el inventario del estado actual de la migración del módulo de pagos hacia una arquitectura limpia basada en UseCases, identificando para cada flujo el nivel de implementación por medio de pago y las tareas pendientes para completar la migración.

---

## Regla de Migración

Durante esta migración no se modificarán las reglas de negocio existentes.

Cada fase deberá:
- mantener compatibilidad con producción;
- modificar un único flujo de negocio;
- reutilizar los UseCases existentes;
- respetar el ADR-001.

---

## Inventario de Flujos de Pago

### 1. Recharge (Recarga de Saldo)

*   **Medio de pago:** Stripe
    *   **Estado:** Migrado
    *   **UseCase utilizado:** `RechargeUseCase`
    *   **Archivo principal:** `src/modules/stripe-topups/stripe-topups.service.ts`
    *   **Qué falta para completar la migración:** Finalizada.
*   **Medio de pago:** Payphone
    *   **Estado:** Legacy
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** `src/modules/wallets/wallets.service.ts` (`recharge`)
    *   **Qué falta para completar la migración:** Reemplazar la lógica transaccional directa por el llamado a `RechargeUseCase`.
*   **Medio de pago:** Transferencia
    *   **Estado:** Legacy
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** `src/modules/user-recharge/user-recharge.service.ts`
    *   **Qué falta para completar la migración:** Implementar `RechargeUseCase` al momento en el que el superadmin valida y aprueba la transferencia.
*   **Medio de pago:** Wallet / GiftCard
    *   **Estado:** N/A
    *   **Qué falta para completar la migración:** No aplican para recargar una Wallet.

Prioridad: -

---

### 2. GiftCard Purchase (Compra de GiftCard)

*   **Medio de pago:** Stripe
    *   **Estado:** Migrado
    *   **UseCase utilizado:** `PurchaseGiftCardUseCase`
    *   **Archivo principal:** `src/modules/stripe-topups/stripe-topups.service.ts`
    *   **Qué falta para completar la migración:** Finalizada.
*   **Medio de pago:** Payphone / Transferencia / Wallet
    *   **Estado:** Falta implementar
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** N/A
    *   **Qué falta para completar la migración:** Implementar endpoints correspondientes que reciban el pago e invoquen el `PurchaseGiftCardUseCase`.
*   **Medio de pago:** GiftCard
    *   **Estado:** N/A
    *   **Qué falta para completar la migración:** No aplica comprar una GiftCard usando otra GiftCard (según reglas del dominio).

Prioridad: Alta

---

### 3. Order Payment (Pago de Órdenes)

*   **Medio de pago:** Stripe
    *   **Estado:** Migrado
    *   **UseCase utilizado:** `PurchaseOrderPaymentUseCase`
    *   **Archivo principal:** `src/modules/stripe-topups/stripe-topups.service.ts`
    *   **Qué falta para completar la migración:** Finalizada.
*   **Medio de pago:** Wallet
    *   **Estado:** Legacy
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** `src/modules/payments/payments.service.ts` (`payNow`)
    *   **Qué falta para completar la migración:** Refactorizar la función `payNow` para que ejecute la lógica a través del `PurchaseOrderPaymentUseCase`.
*   **Medio de pago:** GiftCard
    *   **Estado:** Parcial / Legacy
    *   **UseCase utilizado:** `apply-gift-card-to-order.use-case.ts` (Archivo vacío).
    *   **Archivo principal:** `src/modules/gift-card/use-cases/apply-gift-card-to-order.use-case.ts`
    *   **Qué falta para completar la migración:** Implementar la lógica del UseCase para validar y debitar la GiftCard, y actualizar el estado de la orden correspondiente de acuerdo con la nueva arquitectura.
*   **Medio de pago:** Payphone / Transferencia
    *   **Estado:** Falta implementar
    *   **UseCase utilizado:** Ninguno.
    *   **Qué falta para completar la migración:** Habilitar endpoints para el pago de órdenes invocando `PurchaseOrderPaymentUseCase`.

Prioridad: Alta

---

### 4. EventPass Purchase (Compra de Entradas)

*   **Medio de pago:** Stripe
    *   **Estado:** Migrado
    *   **UseCase utilizado:** `PurchaseEventPassUseCase`
    *   **Archivo principal:** `src/modules/stripe-topups/stripe-topups.service.ts`
    *   **Qué falta para completar la migración:** Finalizada.
*   **Medio de pago:** Wallet
    *   **Estado:** Legacy
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** `src/modules/user-event-pass/user-event-pass.repository.ts` (`purchaseEventPass`)
    *   **Qué falta para completar la migración:** Delegar toda la lógica transaccional de creación del `UserEventPass` y cobro de wallet al `PurchaseEventPassUseCase`.
*   **Medio de pago:** Payphone
    *   **Estado:** Legacy
    *   **UseCase utilizado:** Ninguno.
    *   **Archivo principal:** `src/modules/user-event-pass/user-event-pass.repository.ts` (`purchaseEventPassWhitRecharge`)
    *   **Qué falta para completar la migración:** Actualmente se hace una "recarga + compra con wallet" embebida. Se debe llamar directo al `PurchaseEventPassUseCase` enviando la referencia del pago de Payphone.
*   **Medio de pago:** Transferencia / GiftCard
    *   **Estado:** Falta implementar
    *   **UseCase utilizado:** Ninguno.
    *   **Qué falta para completar la migración:** Implementar la integración de este caso de uso para dichos medios de pago si el negocio lo requiere.

Prioridad: Media
---

### 5. Experience Purchase (Compra de Experiencias)

*   **Medio de pago:** Todos (Stripe, Payphone, Transferencia, Wallet, GiftCard)
    *   **Estado:** Parcial / Falta implementar
    *   **UseCase utilizado:** `PurchaseExperienceUseCase` (Actualmente comentado en el webhook de Stripe).
    *   **Archivo principal:** `src/modules/stripe-topups/stripe-topups.service.ts`
    *   **Qué falta para completar la migración:** 
        1. Definir y crear el modelo/entidad de Experiences.
        2. Crear el `PurchaseExperienceUseCase`.
        3. Descomentar e integrar en Stripe.
        4. Implementarlo para Wallet, Payphone y los demás medios aplicables.

Prioridad: Baja
