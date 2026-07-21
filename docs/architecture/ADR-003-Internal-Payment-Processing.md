# ADR-003 - Internal Payment Processing

## Estado

Accepted

---

# Objetivo

Definir dónde debe ejecutarse la lógica correspondiente al consumo de fondos internos del sistema (Wallet y GiftCards).

Esta decisión aplica a todas las operaciones financieras actuales y futuras.

---

# Contexto

Beland soporta dos grandes grupos de medios de pago.

## Medios externos

- Stripe
- Payphone
- Transferencias
- Cualquier proveedor futuro

En estos casos el dinero ya fue confirmado por un proveedor externo antes de ejecutar el UseCase.

---

## Medios internos

- Wallet
- GiftCard

En estos casos el propio sistema es responsable de debitar los fondos disponibles.

---

# Decisión

Los UseCases son los únicos responsables de orquestar una operación financiera.

Cuando el medio de pago es interno, el UseCase deberá decidir si corresponde debitar fondos.

La ejecución del débito no deberá implementarse directamente dentro del UseCase sino delegarse a un servicio especializado del dominio.

Ejemplos:

- WalletPaymentService
- GiftCardPaymentService

Estos servicios deberán ejecutarse siempre dentro de la misma transacción de base de datos iniciada por el UseCase.

---

### Efectos Externos

Los UseCases no deberán emitir efectos externos antes de la finalización exitosa de la transacción.

Se consideran efectos externos:

- Sockets
- Emails
- Push Notifications
- Webhooks
- Mensajería
- Integraciones HTTP
- Cualquier comunicación fuera de la base de datos.

Los UseCases deberán retornar la información necesaria para que el orquestador emita dichos eventos únicamente después del commit exitoso de la transacción.

# Flujo

## Pago externo

Payment Source

↓

Confirma fondos

↓

UseCase

↓

Lógica de negocio

↓

Transactions

↓

Fin

---

## Pago interno

Payment Source

↓

UseCase

↓

WalletPaymentService / GiftCardPaymentService

↓

Lógica de negocio

↓

Transactions

↓

Fin

---

# Reglas

- Los Payment Sources nunca debitan fondos internos.
- Los Payment Sources nunca modifican Wallets.
- Los Payment Sources nunca modifican GiftCards.
- Los UseCases deciden cuándo debe producirse un débito.
- Los servicios de dominio ejecutan el débito efectivo.
- Todo ocurre dentro de una única transacción.
- Ningún servicio puede modificar saldos fuera de un UseCase.

---

# Consecuencias

Esta decisión permite:

- reutilizar los mismos UseCases para todos los medios de pago;
- evitar duplicación de lógica financiera;
- mantener la atomicidad de todas las operaciones;
- incorporar nuevos medios de pago sin modificar la lógica de negocio;
- incorporar nuevas operaciones de compra reutilizando la misma infraestructura.