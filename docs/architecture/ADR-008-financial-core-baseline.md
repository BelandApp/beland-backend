Estado

Accepted

Contexto

Las Fases 1 a 5 completaron el refactor del dominio financiero correspondiente al procesamiento de pagos de órdenes.

Durante el refactor se eliminaron múltiples implementaciones dispersas de lógica financiera y se consolidó el procesamiento en un único núcleo transaccional.

A partir de este documento, la arquitectura aquí definida constituye la línea base oficial del dominio financiero para pagos de órdenes.

Objetivos

El núcleo financiero debe garantizar:

un único punto de orquestación;
una única transacción SQL por operación;
un único responsable de registrar movimientos financieros;
un único responsable de modificar el estado del Payment;
reutilización entre todos los proveedores de pago;
separación clara entre adaptadores y lógica de negocio.
Arquitectura
Proveedor

↓

Controller

↓

Service

↓

EntityManager.transaction()

↓

PurchaseOrderPaymentUseCase

↓

GiftCardBalanceService

↓

WalletPaymentService

↓

Repositories

↓

COMMIT
Responsabilidades
Controllers

Responsables únicamente de:

recibir requests;
validar DTOs;
delegar.

No contienen lógica financiera.

Services

Responsables únicamente de:

iniciar la transacción;
resolver dependencias externas;
preparar parámetros;
invocar UseCases.

No contienen lógica financiera.

PurchaseOrderPaymentUseCase

Es el único orquestador financiero autorizado para pagos de órdenes.

Responsabilidades:

bloqueo pesimista de Payment;
consumo de GiftCards;
débito de Wallet;
registro de Transactions;
actualización de Payment;
actualización de Order;
consistencia transaccional.

Toda modificación futura sobre el flujo financiero deberá realizarse aquí.

GiftCardBalanceService

Responsable exclusivamente de:

consumeDirect()
consumeReserved()

No modifica Payment.

No modifica Order.

No registra Transactions.

WalletPaymentService

Responsable exclusivamente de los movimientos internos de Wallet.

No conoce Orders.

No conoce Stripe.

No conoce PayPhone.

Integración de proveedores

Todos los proveedores deben converger al mismo UseCase.

Wallet
Controller

↓

PaymentsService

↓

PurchaseOrderPaymentUseCase
Stripe
Webhook

↓

StripeTopupsService

↓

PurchaseOrderPaymentUseCase

Utiliza reservas mediante:

consumeReserved()
PayPhone
Controller

↓

PaymentsService

↓

PurchaseOrderPaymentUseCase

Utiliza:

consumeDirect()

No posee:

reservas;
intents;
cron jobs;
webhooks.
Transfer
Controller

↓

PaymentsService

↓

PurchaseOrderPaymentUseCase
Principios arquitectónicos
Regla 1

No existe lógica financiera fuera del PurchaseOrderPaymentUseCase para pagos de órdenes.

Regla 2

Controllers y Services actúan únicamente como adaptadores.

Regla 3

Todos los proveedores reutilizan el mismo núcleo financiero.

Regla 4

Los proveedores sólo difieren en la forma de llegar al UseCase.

Regla 5

Nunca modelar un proveedor tomando otro como referencia.

La arquitectura deberá derivarse exclusivamente del ciclo de vida real del proveedor.

Regla 6

Toda operación financiera deberá ejecutarse dentro de una única transacción SQL.

Regla 7

El bloqueo pesimista sobre Payment constituye el mecanismo oficial de protección contra concurrencia para pagos de órdenes.

Alcance

Este ADR aplica exclusivamente al dominio:

Order Payments

No cubre todavía:

recargas;
reembolsos;
cancelaciones;
EventPass;
GiftCards como producto;
futuros proveedores.
Resultado esperado

Toda nueva funcionalidad financiera deberá integrarse respetando este baseline.

Si una nueva fase requiere apartarse de estas reglas, deberá aprobarse un nuevo ADR antes de modificar la arquitectura.