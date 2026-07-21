# Payment Patterns

## Objetivo

Este documento describe el patrón obligatorio que deben seguir todos los flujos de pago del sistema.

No define nuevas decisiones arquitectónicas.

Su única finalidad es evitar que futuros desarrollos implementen variantes diferentes para un mismo flujo.

Las decisiones arquitectónicas correspondientes se encuentran documentadas en:

- ADR-001 - Payment Domain
- ADR-002 - Payment Migration Plan
- ADR-003 - Internal Payment Processing

---

# Flujo General

Todos los medios de pago deben terminar ejecutando exactamente el mismo UseCase.

```
Payment Provider
        │
        ▼
 PurchaseXXXUseCase
        │
        ├───────────────┐
        │               │
        │ si el origen  │
        │ es interno     │
        ▼               │
WalletPaymentService     │
GiftCardPaymentService   │
        │               │
        └───────────────┘
                │
                ▼
      Lógica del negocio
                │
                ▼
      Acreditación destino
                │
                ▼
 Transaction(s) de negocio
                │
                ▼
             Commit
```

---

# Responsabilidades

## Payment Provider

Responsable de:

- validar el pago externo;
- identificar el Owner;
- iniciar una única transacción;
- ejecutar el UseCase correspondiente.

No debe:

- modificar Wallets;
- crear Transactions;
- ejecutar lógica de negocio;
- abrir más de una transacción.

---

## UseCase

Responsable de:

- ejecutar la lógica de negocio;
- coordinar los servicios de dominio;
- acreditar los fondos al destino correspondiente;
- generar las Transactions del negocio.

No debe:

- abrir transacciones;
- crear QueryRunner;
- realizar commits;
- realizar rollbacks.

---

## WalletPaymentService

Responsable exclusivamente de:

- debitar saldo de una Wallet;
- registrar la Transaction correspondiente al movimiento de la Wallet.

No conoce:

- Stripe;
- Payphone;
- Transferencias;
- GiftCards;
- Orders;
- EventPass;
- Experiences.

---

## GiftCardPaymentService

Responsable exclusivamente de:

- consumir saldo de una UserGiftCard;
- actualizar su saldo disponible;
- registrar la Transaction correspondiente.

No conoce la lógica del negocio que originó el consumo.

---

# Atomicidad

Todas las operaciones financieras deben ejecutarse utilizando exclusivamente el EntityManager recibido por el UseCase.

Está prohibido:

- crear QueryRunner;
- abrir nuevas transacciones;
- realizar commits intermedios;
- realizar rollbacks intermedios.

Toda modificación de entidades debe pertenecer a la misma transacción de base de datos.

---

# Patrón por medio de pago

| Medio de pago | Debita Wallet | Debita GiftCard | Ejecuta UseCase | Acredita destino | Transaction negocio |
|---------------|---------------|-----------------|-----------------|------------------|---------------------|
| Stripe | No | No | Sí | Sí | Sí |
| Payphone | No | No | Sí | Sí | Sí |
| Transferencia | No | No | Sí | Sí | Sí |
| Wallet | Sí | No | Sí | Sí | Sí |
| GiftCard | No | Sí | Sí | Sí | Sí |

---

# Regla de Extensión

Al agregar un nuevo medio de pago:

- nunca crear un nuevo UseCase;
- nunca duplicar lógica de negocio;
- reutilizar el UseCase existente;
- reutilizar los servicios de dominio existentes;
- mantener una única transacción.

---

# Próximos servicios de dominio previstos

Cuando el dominio lo requiera, podrán agregarse nuevos servicios especializados siguiendo el mismo patrón.

Ejemplos:

- GiftCardPaymentService
- RefundService
- CommissionService
- SplitPaymentService

Todos deberán ser reutilizables, agnósticos del proveedor de pago y ejecutarse siempre dentro del EntityManager recibido.