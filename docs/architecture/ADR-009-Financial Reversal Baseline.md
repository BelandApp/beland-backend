# ADR-009 - Financial Reversal Baseline

**Status:** Accepted

---

# Context

Beland implementa una economía principalmente cerrada.

La mayor parte de los movimientos financieros permanecen dentro del ecosistema de la plataforma mediante Wallets internas.

Las pasarelas de pago (Stripe, PayPhone y futuras integraciones) se utilizan únicamente para ingresar dinero al ecosistema y no participan automáticamente en los procesos de devolución.

Cuando un usuario requiere una devolución de dinero real hacia una cuenta bancaria o medio de pago externo, dicho proceso será resuelto manualmente por un SuperAdmin fuera de Beland. Posteriormente, el sistema actualizará únicamente su estado financiero interno para mantener la consistencia contable.

Las reversiones financieras forman parte del funcionamiento normal del negocio y abarcan distintos dominios como cancelaciones de órdenes, devoluciones parciales de productos, reembolsos de EventPass y futuras funcionalidades similares.

---

# Objetivos

- Definir una arquitectura única para todas las reversiones financieras.
- Centralizar toda la lógica financiera de devolución.
- Mantener la consistencia del estado interno.
- Evitar duplicación de lógica.
- Desacoplar completamente las devoluciones internas de las pasarelas de pago externas.

---

# Alcance

Este ADR aplica a:

- Cancelación de Orders.
- Refunds parciales de productos.
- Refunds de EventPass.
- Cancelación de GiftCards.
- Futuras reversiones financieras internas.

Este ADR NO aplica a:

- Retiros bancarios de comerciantes.
- Payouts.
- Devoluciones automáticas mediante Stripe.
- Devoluciones automáticas mediante PayPhone.
- Transferencias bancarias.
- Chargebacks.
- Procesos administrativos externos.

---

# Principios Arquitectónicos

## PA-001 — Economía Cerrada

Beland administra una economía principalmente interna.

Las operaciones de refund modifican únicamente el estado financiero interno del sistema.

---

## PA-002 — Separación entre dinero interno y dinero externo

Beland nunca ejecutará automáticamente devoluciones de dinero hacia proveedores externos.

Cuando corresponda devolver dinero real:

- el SuperAdmin resolverá el movimiento fuera de la plataforma;
- posteriormente confirmará la operación en Beland;
- Beland únicamente actualizará su contabilidad interna.

---

## PA-003 — Wallet como destino oficial

Toda devolución interna acreditará fondos en la Wallet del usuario.

La Wallet constituye el destino oficial de cualquier refund.

La devolución al medio original de pago (GiftCards u otros instrumentos internos) podrá implementarse en el futuro únicamente cuando no incremente significativamente la complejidad del sistema.

Hasta entonces, Wallet constituye el comportamiento oficial.

---

## PA-004 — Núcleo único de reversión

Toda la lógica financiera de reversión deberá concentrarse en un único núcleo reutilizable.

Los distintos casos de uso únicamente decidirán:

- cuándo revertir;
- por qué revertir;
- qué entidades de negocio actualizar.

La mecánica financiera nunca deberá implementarse dentro de dichos casos de uso.

---

## PA-005 — Auditoría completa

Toda reversión financiera deberá generar nuevas Transaction.

Nunca deberán modificarse ni eliminarse transacciones históricas.

El historial financiero deberá permanecer completamente auditable.

---

## PA-006 — Consistencia transaccional

Toda reversión deberá mantener consistente el estado de todas las entidades involucradas.

Entre ellas:

- Wallet
- Transaction
- Payment
- Order

y cualquier otra entidad participante según el dominio correspondiente.

---

# Reglas de Negocio

## RN-001 — Refunds internos

Las devoluciones estándar permanecerán dentro del ecosistema Beland acreditando saldo en la Wallet del usuario.

---

## RN-002 — Refunds externos

Las devoluciones de dinero real constituyen procesos administrativos.

Beland únicamente registrará y reflejará el resultado confirmado por el SuperAdmin.

---

## RN-003 — Cancelación de Orders

Una Order únicamente podrá cancelarse mientras no haya comenzado el proceso de delivery.

Cuando una Order sea cancelada antes del despacho:

- se revertirá la totalidad de la operación;
- se reintegrará el valor completo de los productos;
- se reintegrará el costo del delivery;
- la devolución se acreditará en la Wallet del usuario.

Una vez iniciado el proceso de delivery, la Order ya no podrá cancelarse.

---

## RN-003Bis — Inmutabilidad de la Order

Una Order confirmada constituye un registro inmutable.

Una vez creada:

- no podrán agregarse productos;
- no podrán eliminarse productos;
- no podrán modificarse cantidades.

Las únicas operaciones permitidas serán:

- Cancelación completa (antes del despacho).
- Devoluciones parciales de productos (después de la entrega, durante el retiro de residuos).

---

## RN-004 — Delivery

El costo del delivery representa un servicio independiente del producto.

Cuando el servicio haya sido prestado:

- el delivery no será reembolsable.

Las devoluciones parciales reintegrarán exclusivamente el valor de los productos devueltos.

---

## RN-005 — Devoluciones posteriores a la entrega

Las devoluciones parciales forman parte del flujo normal del negocio.

Podrán realizarse durante el retiro de residuos.

En estos casos:

- únicamente se reintegrará el valor de los productos efectivamente devueltos;
- el costo del delivery no será reembolsado;
- la devolución se acreditará en la Wallet del usuario.

---

## RN-005Bis — Delivery

El delivery constituye un servicio independiente del producto.

Si una Order es cancelada antes de iniciar el delivery, el costo del servicio será reintegrado.

Una vez iniciado el delivery, dicho servicio se considera prestado y deja de ser reembolsable.

## RN-006 — Green Coins

Las recompensas ecológicas (Green Coins) pertenecen a un dominio independiente.

Las reversiones financieras no modificarán automáticamente dichas recompensas salvo que una regla específica del negocio lo indique expresamente.

---

## PA-007 — Simplicidad sobre automatización

Beland prioriza soluciones simples y mantenibles.

Cuando un proceso financiero pueda resolverse razonablemente mediante una intervención administrativa, dicha alternativa tendrá prioridad sobre la automatización.

El núcleo financiero únicamente automatizará aquellas operaciones que aporten valor directo al funcionamiento de la plataforma.

---

# Consecuencias

Como consecuencia de este ADR:

- Existirá un único núcleo de reversión financiera.
- No se permitirá lógica financiera duplicada.
- Las pasarelas externas permanecerán desacopladas del dominio de refunds.
- Todos los casos de uso reutilizarán el mismo mecanismo financiero de reversión.
- La Wallet será el destino estándar de los fondos devueltos.
- El historial financiero permanecerá completamente auditable mediante nuevas transacciones.

---

# Relación con otros ADR

Este ADR complementa al:

**ADR-008 – Financial Core Baseline**

Mientras ADR-008 define la arquitectura del flujo de pagos, ADR-009 define la arquitectura del flujo de reversiones financieras.

Ambos conforman el núcleo financiero oficial de Beland.