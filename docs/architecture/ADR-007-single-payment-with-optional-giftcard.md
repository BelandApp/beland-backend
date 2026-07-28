# ADR-007 – Single Payment with Optional GiftCard

## Estado

Accepted

---

## Contexto

El Core Financiero de Beland soporta distintos tipos de operaciones comerciales (Orders, EventPass, GiftCards, Donations, Merchant, Recharge, etc.).

Durante el diseño del sistema de pagos se evaluó implementar un motor de pagos compuesto que permitiera combinar múltiples proveedores (Wallet, Stripe, PayPhone, Transferencias, GiftCards, Orange, etc.) dentro de una misma operación.

Luego de realizar una auditoría funcional completa del código se concluyó que esa complejidad no se encuentra justificada para el MVP.

La auditoría confirmó que:

- `Transaction` constituye el Ledger financiero universal del sistema.
- `WalletPaymentService` ya implementa correctamente el movimiento de dinero.
- `Payment` es una entidad comercial especializada del módulo Orders.
- El resto de los módulos no dependen de `Payment` para funcionar correctamente.

Por este motivo se decidió preservar la arquitectura actual y extender únicamente el flujo comercial de Orders para soportar GiftCards como mecanismo complementario de pago.

---

## Decisión

Cada `Payment` podrá resolverse utilizando:

- exactamente un proveedor principal de pago;
- opcionalmente una única `UserGiftCard`.

El flujo funcional será:

1. El usuario selecciona opcionalmente una GiftCard.
2. El sistema calcula automáticamente el monto máximo aplicable.
3. La GiftCard cubrirá parcial o totalmente el compromiso comercial.
4. Si existe un saldo restante, éste será abonado utilizando exactamente un único proveedor principal.
5. Si la GiftCard cubre el monto completo, no se ejecutará ningún proveedor adicional.

No se permitirá combinar múltiples proveedores principales dentro de un mismo Payment.

Ejemplos válidos:

- GiftCard + Wallet
- GiftCard + Stripe
- GiftCard + PayPhone
- GiftCard + Transferencia
- Wallet únicamente
- Stripe únicamente

Ejemplos no permitidos:

- Wallet + Stripe
- Wallet + PayPhone
- Stripe + Transferencia
- Wallet + Stripe + PayPhone
- múltiples GiftCards en un mismo Payment

---

## Consideraciones de consistencia

Los proveedores de pago no poseen el mismo comportamiento temporal.

### Proveedores síncronos

Ejemplo:

- Wallet

El pago se confirma durante la misma operación del sistema.

En estos casos la resolución del Payment puede realizarse completamente dentro de una única transacción de base de datos.

---

### Proveedores asíncronos

Ejemplos:

- Stripe
- PayPhone

Estos proveedores generan una intención de pago y la confirmación definitiva ocurre posteriormente mediante Webhooks.

Durante ese intervalo temporal el sistema deberá garantizar que la porción de GiftCard comprometida para ese Payment no pueda ser utilizada por otra operación.

La implementación concreta (reserva, bloqueo temporal, retención u otro mecanismo equivalente) queda fuera del alcance de este ADR.

Lo único obligatorio es preservar las siguientes garantías:

- evitar el doble consumo de una GiftCard;
- mantener la consistencia entre el Payment y el monto efectivamente cobrado por el proveedor;
- permitir liberar automáticamente el saldo comprometido cuando el checkout expire, sea cancelado o falle definitivamente.

Este ADR define dichas garantías funcionales, pero no impone una implementación específica.

---

## Alcance

Esta decisión aplica exclusivamente al MVP.

No impide que en el futuro se implemente un motor de pagos compuesto si aparecen requerimientos reales que lo justifiquen.

---

## Responsabilidades de las entidades

### Payment

Representa exclusivamente el compromiso comercial de pago asociado a una Order.

Puede registrar información relacionada con la GiftCard utilizada para satisfacer dicho compromiso.

No se generaliza para otros módulos.

---

### Transaction

Representa exclusivamente el movimiento contable real del dinero.

Nunca debe almacenar estados comerciales, checkouts pendientes ni intenciones de pago.

Permanece como Ledger universal del sistema.

---

### UserGiftCard

Representa el saldo disponible de una GiftCard.

Su saldo podrá participar como complemento de un Payment respetando las garantías de consistencia definidas en este ADR.

---

## Reglas de negocio

- Cada Payment admite como máximo una GiftCard.
- La GiftCard debe pertenecer al usuario que realiza el pago.
- Debe encontrarse activa.
- Debe poseer saldo disponible.
- El backend siempre recalcula el monto aplicable.
- Nunca se confiará en cálculos enviados por el frontend.
- La GiftCard podrá cubrir parcial o totalmente el Payment.
- El saldo restante deberá cancelarse utilizando exactamente un único proveedor principal.
- No se admitirán múltiples proveedores principales dentro del mismo Payment.
- Las implementaciones con proveedores asíncronos deberán garantizar la consistencia del saldo comprometido durante todo el ciclo de vida del checkout.

---

## Consecuencias

### Beneficios

- Mantiene intacta la arquitectura del Core Financiero.
- Conserva la separación entre responsabilidades comerciales y contables.
- Evita introducir un motor de pagos compuesto innecesario.
- Reutiliza el comportamiento existente del módulo Orders.
- Preserva la pureza del Ledger (`Transaction`).
- Mantiene encapsulado el cambio dentro del flujo de Orders.

### Limitaciones

No será posible combinar múltiples proveedores principales dentro de un mismo Payment.

Las implementaciones con proveedores asíncronos requerirán un mecanismo que garantice la consistencia temporal entre la creación del checkout y su confirmación definitiva.

---

## Estado futuro

Si en el futuro aparecen requerimientos reales para combinar múltiples proveedores principales en una misma operación, deberá abrirse un nuevo ADR para evaluar una arquitectura específica de composición de pagos.

Hasta entonces esta decisión permanecerá vigente como diseño oficial del sistema de pagos del MVP.