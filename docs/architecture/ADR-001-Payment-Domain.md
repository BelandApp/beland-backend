# ADR-001 - Payment Domain

## Estado

Accepted

---

# Objetivo

Definir los principios arquitectónicos del dominio de pagos de Beland.

Este documento es la fuente oficial de verdad para cualquier desarrollo relacionado con:

- Wallet
- Stripe
- Payphone
- Transferencias
- GiftCards
- Orders
- EventPass
- Experiences
- Cualquier futuro medio de pago

Toda modificación deberá respetar estas reglas.

---

# Principios

## 1. Separación de responsabilidades

Los medios de pago nunca contienen lógica de negocio.

Su única responsabilidad es confirmar que el dinero fue recibido o que el saldo fue debitado correctamente.

---

## 2. Los UseCases contienen la lógica de negocio

Toda operación del dominio debe ejecutarse mediante un UseCase.

Ejemplos:

- RechargeUseCase
- PurchaseGiftCardUseCase
- PurchaseOrderPaymentUseCase
- PurchaseEventPassUseCase
- PurchaseExperienceUseCase

---

## 3. El origen del dinero no modifica la operación

Una compra debe ejecutarse exactamente igual independientemente del origen del dinero.

Ejemplos de Payment Sources:

- Stripe
- Payphone
- Transferencia
- Wallet
- GiftCard

Todos deben terminar ejecutando exactamente el mismo UseCase.

---

## 4. Cada movimiento financiero genera transacciones

Nunca se modifica un saldo sin registrar las transacciones correspondientes.

Las transacciones representan el libro contable del sistema.

---

## 5. Idempotencia

Toda operación financiera debe poder ejecutarse múltiples veces sin generar doble acreditación ni doble débito.

---

## 6. Atomicidad

Toda operación financiera que modifique más de una entidad debe ejecutarse dentro de una única transacción de base de datos.

---

# Payment Sources

Los medios de pago actualmente soportados son:

- Stripe
- Payphone
- Transferencia
- Wallet
- GiftCard

En el futuro podrán agregarse nuevos medios sin modificar los UseCases existentes.

---

# Purchase Targets

Las operaciones de negocio soportadas son:

- Recharge
- GiftCard
- Order Payment
- EventPass
- Experience

Cada operación representa un caso de uso independiente.

---

# Flujo oficial

Payment Source

↓

Confirma fondos

↓

UseCase

↓

Transactions

↓

Persistencia

↓

Fin

---

# Responsabilidades

## Payment Source

Debe:

- validar el pago
- confirmar el débito o acreditación
- ejecutar el UseCase correspondiente

No debe:

- modificar Wallets
- crear lógica de negocio
- decidir reglas de negocio

---

## UseCase

Debe:

- ejecutar toda la lógica de negocio
- actualizar entidades
- generar transacciones
- validar reglas del dominio

No debe:

- comunicarse con Stripe
- comunicarse con Payphone
- crear PaymentIntent
- consumir APIs externas

---

# Reglas

- Ningún medio de pago puede implementar lógica de negocio.
- Ningún UseCase puede depender de Stripe, Payphone o Transferencias.
- Todo movimiento financiero debe ser auditable.
- Ningún flujo puede acreditar dinero dos veces.
- Ningún flujo puede debitar dinero dos veces.
- Ningún flujo puede consumir una GiftCard dos veces.
- Toda modificación financiera debe quedar registrada mediante Transaction.

---

# Objetivo de la arquitectura

Permitir agregar nuevos:

- medios de pago
- operaciones de negocio
- combinaciones de pago

sin modificar los UseCases existentes ni duplicar lógica de negocio.