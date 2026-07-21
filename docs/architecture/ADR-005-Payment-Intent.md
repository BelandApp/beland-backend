# ADR-005 - Payment Intent

## Estado

Accepted

---

## Objetivo

Definir el concepto de Payment Intent dentro del dominio Merchant y separar las intenciones de cobro del dominio financiero.

---

## Definición

Un Payment Intent representa una intención temporal de cobro creada por un comercio.

No representa una transacción financiera.

No representa dinero.

No modifica balances.

No genera movimientos contables.

Su única finalidad es facilitar el proceso de pago mediante QR.

---

## AmountToPayment

La entidad AmountToPayment constituye la implementación actual del Payment Intent.

Contiene únicamente la información necesaria para iniciar un cobro:

- comercio propietario;
- monto sugerido;
- mensaje opcional;
- fecha de creación.

---

## QR

Cada comercio posee un único QR permanente.

El QR únicamente identifica la Wallet del comercio.

Nunca representa una venta específica.

Nunca contiene información financiera.

Cuando un cliente escanea el QR, el sistema consulta si existe un Payment Intent activo para esa Wallet.

Si existe, utiliza dicho importe.

Si no existe, el comprador podrá ingresar el monto manualmente.

---

## Consumo

Un Payment Intent únicamente puede consumirse una vez.

Cuando el pago finaliza correctamente:

- se ejecuta el UseCase correspondiente;
- se registran todas las Transaction necesarias;
- se actualizan las Wallets;
- se elimina el AmountToPayment;
- se notifican las partes correspondientes.

Todo ello dentro de la misma transacción de base de datos.

---

## Responsabilidades

El Payment Intent nunca debe:

- modificar Wallets;
- crear Transactions;
- realizar cálculos financieros;
- abrir transacciones;
- emitir lógica de negocio financiera.

El Payment Intent únicamente representa una intención de cobro pendiente.

---

## Consecuencias

Toda lógica financiera relacionada con pagos mediante QR deberá implementarse exclusivamente dentro de PurchaseMerchantUseCase.

AmountToPayment permanecerá como una entidad auxiliar del dominio Merchant y nunca como parte del dominio financiero.