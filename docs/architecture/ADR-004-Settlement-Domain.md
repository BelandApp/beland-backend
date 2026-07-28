# ADR-004 - Settlement Domain

## Estado

Accepted

---

## Objetivo

Definir la diferencia entre el dinero real recibido por Beland y los saldos virtuales reflejados en las Wallets de los usuarios.

Esta separación forma parte del dominio financiero de Beland y deberá respetarse en todos los módulos actuales y futuros.

---

## Principios

### 1. Recaudación

Todo dinero proveniente de un medio de pago externo (Stripe, Payphone, Transferencias Bancarias u otros futuros proveedores) ingresa siempre a una cuenta bancaria perteneciente a Beland.

Ningún pago externo deposita dinero directamente en una cuenta bancaria de un comercio, organizador o usuario.

---

### 2. Wallet

La Wallet no representa dinero bancario.

Representa un saldo virtual pendiente de liquidación.

El saldo disponible en una Wallet indica cuánto dinero le corresponde a un usuario dentro del ecosistema Beland.

---

### 3. Acreditación

Cada UseCase es responsable de acreditar el saldo virtual a quien corresponda según la regla del dominio.

Ejemplos:

- Recharge → Wallet del usuario que recarga.
- PurchaseOrder → Wallet del propietario de la venta.
- PurchaseGiftCard → Wallet de Beland.
- PurchaseEventPass → Wallet del creador del EventPass.
- PurchaseExperience → Wallet del creador de la Experience.

---

### 4. Liquidación

La transferencia del dinero real desde la cuenta bancaria de Beland hacia un usuario constituye un proceso independiente denominado Settlement.

El proceso de Settlement no forma parte de ningún flujo de compra.

---

### 5. Independencia

Las reglas de liquidación podrán cambiar sin modificar los UseCases de compra.

Ejemplos:

- diferentes porcentajes de comisión;
- promociones;
- impuestos;
- retenciones;
- liquidaciones semanales;
- liquidaciones manuales;
- múltiples cuentas bancarias.

Los UseCases únicamente acreditan saldos virtuales.

Nunca ejecutan transferencias bancarias reales.

---

## Consecuencias

Todo nuevo flujo financiero deberá respetar esta separación.

Los Payment Providers confirman el ingreso del dinero.

Los UseCases actualizan las Wallets.

El dominio Settlement será responsable de las futuras transferencias bancarias hacia los usuarios.