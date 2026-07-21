# GiftCard Balance Service Design

## Objetivo

Definir el comportamiento funcional del `GiftCardBalanceService`, responsable de administrar el ciclo de vida del saldo de las `UserGiftCard`.

Este documento complementa el ADR-007 y constituye la especificación funcional del servicio encargado de garantizar la consistencia del saldo de las GiftCards independientemente del proveedor de pago utilizado.

No define detalles de implementación, únicamente el comportamiento esperado del servicio.

---

# Responsabilidad

El `GiftCardBalanceService` es el único componente autorizado para modificar el saldo de una `UserGiftCard`.

Ningún UseCase, Controller, Service o Provider deberá modificar directamente el balance de una GiftCard.

Toda modificación deberá realizarse exclusivamente a través de este servicio.

---

# Modelo de Persistencia

La implementación del servicio utilizará el siguiente modelo persistente para representar el estado del saldo de una GiftCard.

La entidad `UserGiftCard` mantendrá:

- `current_balance`: saldo actualmente disponible para nuevas operaciones.
- `reserved_balance`: saldo temporalmente comprometido por operaciones asincrónicas aún no confirmadas.

La entidad `Payment` registrará:

- `user_gift_card_id`: GiftCard utilizada durante el pago.
- `gift_card_amount_used`: monto aplicado desde la GiftCard.

Este modelo permite implementar las operaciones `reserve()`, `consume()`, `release()` y `refund()` sin introducir nuevas entidades ni modificar la arquitectura definida por el ADR-007.

La elección de este modelo responde al criterio de mínima complejidad y menor impacto sobre el dominio existente.

---

# Objetivos del Servicio

El servicio debe garantizar:

- integridad matemática del saldo;
- ausencia de doble consumo;
- consistencia frente a concurrencia;
- independencia del proveedor de pago;
- reversibilidad de operaciones comerciales cuando corresponda.

---

# Operaciones

## reserve()

### Objetivo

Comprometer temporalmente una porción del saldo de una GiftCard para una operación comercial que aún no fue confirmada.

### Casos de uso

- Stripe
- PayPhone
- cualquier proveedor asincrónico

### Garantías

- nunca podrá reservar más saldo del disponible;
- deberá impedir reservas concurrentes incompatibles;
- la operación deberá ser atómica.

---

## consume()

### Objetivo

Consumir definitivamente un saldo previamente reservado o, en operaciones síncronas, consumir directamente el saldo disponible.

### Casos de uso

- Wallet
- confirmación de Webhooks
- pagos internos

### Garantías

- el saldo consumido pasa a ser irreversible desde el punto de vista comercial;
- nunca podrá consumirse dos veces la misma reserva.

---

## release()

### Objetivo

Liberar una reserva cuando el pago nunca llegó a completarse.

### Casos de uso

- checkout cancelado
- timeout comercial
- webhook de cancelación
- error definitivo del proveedor

### Garantías

- el saldo vuelve a quedar completamente disponible;
- la operación deberá ser idempotente.

---

## refund()

### Objetivo

Restituir saldo a una GiftCard luego de una operación ya consumida.

### Casos de uso

- devolución de Orders
- cancelaciones posteriores
- reversión comercial

### Garantías

- sólo podrá devolver el monto efectivamente consumido;
- deberá mantener trazabilidad completa.

---

# Flujo esperado

## Wallet

```
reserve()
(opcional)

↓

consume()

↓

Payment COMPLETED
```

Todo ocurre dentro de una única transacción.

---

## Stripe / PayPhone

```
reserve()

↓

Checkout

↓

Webhook OK

↓

consume()
```

Si el checkout falla:

```
reserve()

↓

checkout cancelado

↓

release()
```

---

# Invariantes

El servicio deberá garantizar siempre:

- nunca consumir más saldo del disponible;
- nunca permitir doble consumo;
- nunca dejar saldo negativo;
- nunca perder saldo por errores de concurrencia;
- todas las operaciones deberán ser atómicas.

---

# Concurrencia

Toda operación que modifique el saldo deberá ejecutarse utilizando mecanismos de bloqueo apropiados (`pessimistic_write` o equivalente).

No se admitirán operaciones optimistas sobre balances monetarios.

---

# Independencia del proveedor

El servicio no debe conocer:

- Stripe
- PayPhone
- Wallet
- Transfer
- Orders

Únicamente administra saldo.

El proveedor de pago únicamente decide cuál operación invocar.

---

# Responsabilidades

El servicio:

✓ administra balances.

✓ garantiza consistencia.

✓ protege concurrencia.

✓ ejecuta reservas.

✓ consume saldo.

✓ libera reservas.

✓ realiza devoluciones.

No le corresponde:

✗ cerrar Payments.

✗ crear Transactions.

✗ modificar Orders.

✗ comunicarse con proveedores externos.

✗ enviar notificaciones.

---

# Relación con ADR-007

Este documento implementa las garantías funcionales definidas por el ADR-007 para el manejo del saldo comprometido de las GiftCards.

No modifica la arquitectura del sistema ni introduce nuevos conceptos de negocio.

Únicamente especifica el comportamiento esperado del componente responsable de administrar el saldo de las GiftCards.

---

# Estado

Accepted

Este documento constituye la especificación oficial del comportamiento del `GiftCardBalanceService`.