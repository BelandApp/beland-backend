# Diseño del Dominio: BeCoin Orange

## Objetivo

Este documento define el diseño del dominio BeCoin Orange tomando como fuente de verdad la especificación funcional previamente aprobada.

No define detalles de implementación, sino la arquitectura lógica del dominio, sus responsabilidades, límites y colaboración con el Core Financiero.

---

# Objetivos del dominio

El dominio BeCoin Orange tiene una única responsabilidad:

Administrar créditos promocionales cerrados destinados exclusivamente a reducir el costo de consumos internos dentro de la plataforma.

No administra dinero.

No administra pagos.

No administra comisiones.

No administra Wallets.

No administra campañas.

---

# Límites del dominio

El dominio Orange NO conoce:

- Stripe
- Payphone
- Transferencias
- Wallet interna
- Marketplace
- Beland
- Event Pass
- Campañas

Únicamente conoce solicitudes para:

- acreditar Orange
- consumir Orange
- revertir Orange

Todo lo demás pertenece a otros dominios.

---

# Integración con Core Financiero

Orange reutiliza completamente la infraestructura existente.

Reutiliza:

- Wallet
- Transaction
- Ledger
- TransactionManager
- Bloqueos
- Auditoría
- Eventos

No crea una billetera nueva.

No crea un ledger paralelo.

No crea balances independientes.

El saldo Orange continúa formando parte de Wallet mediante el campo existente:

becoin_orange

---

# Responsabilidades

Wallet

Responsable únicamente de almacenar el saldo.

No conoce promociones.

No conoce reglas de negocio.

---

Orange Domain

Responsable de validar todas las reglas funcionales:

- no negativo
- no transferible
- no retirable
- reintegro en especie
- no generar valor económico

---

Transaction

Responsable únicamente del registro contable de movimientos.

No calcula promociones.

No aplica reglas Orange.

---

Recharge

Puede solicitar la acreditación de Orange.

Nunca modifica Wallet directamente.

---

Marketplace

Puede solicitar consumir Orange.

Nunca modifica Wallet directamente.

---

Support

Puede solicitar acreditaciones manuales.

---

# Casos de uso

## GenerateOrangeReward

Origen:

Recharge
Promoción
Compensación
Soporte

Resultado:

Acreditación de Orange.

---

## SpendOrange

Origen:

Marketplace

Beland

EventPass

Resultado:

Débito de Orange.

---

## RefundOrange

Origen:

Cancelación de compra.

Resultado:

Reintegro exactamente en Orange.

---

## RevokeOrange

Origen:

Chargeback

Fraude

Resultado:

Revocación parcial o total respetando saldo >= 0.

---

# Reglas de colaboración

Los demás módulos nunca modifican directamente:

becoin_orange

Siempre solicitan la operación al dominio Orange.

Orange coordina con Wallet y Transaction.

---

# Extensibilidad

Nuevos orígenes de generación podrán incorporarse sin modificar el dominio:

- campañas
- referidos
- promociones
- eventos especiales
- programas de fidelidad

Todos consumirán el mismo caso de uso GenerateOrangeReward.

---

# Riesgos Arquitectónicos

Debe garantizarse:

- atomicidad
- idempotencia
- consistencia del saldo
- bloqueo pesimista durante consumos
- trazabilidad completa mediante Transaction

---

# Decisiones Arquitectónicas

Se reutiliza el Core Financiero existente.

No se crean Wallets paralelas.

No se crean Ledgers paralelos.

No se duplica lógica de transacciones.

Orange actúa como un dominio coordinador sobre infraestructura ya existente.

---

# Resultado esperado

El dominio Orange queda completamente desacoplado de:

- medios de pago
- campañas
- marketplace
- eventos

y únicamente expone operaciones de negocio relacionadas con créditos promocionales.