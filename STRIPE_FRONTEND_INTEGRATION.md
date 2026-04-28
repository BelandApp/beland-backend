# Integracion Frontend - Recargas con Stripe

## Resumen del proceso

El flujo de recarga con Stripe es asincronico.

1. El frontend solicita al backend la creacion de un `PaymentIntent`.
2. El backend crea una recarga local en estado `PENDING` y devuelve el `clientSecret`.
3. El frontend usa ese `clientSecret` para confirmar el pago con Stripe.
4. Stripe procesa el pago y envia un webhook al backend.
5. El backend valida el webhook, acredita saldo en la wallet y actualiza la recarga a `COMPLETED` o `FAILED`.
6. El frontend debe mostrar un estado intermedio de "procesando recarga" hasta recibir:
   - una notificacion por websocket, o
   - una confirmacion consultando el endpoint de estado.

Importante:

- El frontend nunca acredita saldo por su cuenta.
- La fuente final de verdad es siempre el backend despues del webhook de Stripe.
- Aunque Stripe indique que el pago fue exitoso del lado cliente, el frontend debe esperar confirmacion del backend.

---

## Autenticacion

Los endpoints de creacion y consulta de estado requieren JWT:

```http
Authorization: Bearer <token>
```

El webhook de Stripe no lo consume el frontend.

---

## Endpoint 1 - Crear PaymentIntent

### Request

`POST /api/stripe-topups/create-intent`

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "amountUsd": 25.5
}
```

### Validaciones del backend

- `amountUsd` debe ser numerico.
- maximo 2 decimales.
- minimo `0.50`.
- maximo `10000`.
- el usuario autenticado debe tener wallet.

### Response exitosa

```json
{
  "topupId": "5d8c7f9f-0f55-4d06-968b-00d1e9dfe2b1",
  "clientTransactionId": "f483d90a-482e-4924-89f6-e4d8dbf9296f",
  "paymentIntentId": "pi_3RwExample123456789",
  "clientSecret": "pi_3RwExample123456789_secret_xxx",
  "amountUsd": 25.5,
  "currency": "usd",
  "status": "PENDING"
}
```

### Que debe hacer el frontend con esta respuesta

1. Guardar al menos:
   - `topupId`
   - `clientTransactionId`
   - `paymentIntentId`
2. Usar `clientSecret` para confirmar el pago con Stripe Elements o el SDK que usen.
3. Mostrar estado visual:
   - `Iniciando pago`
   - luego `Procesando recarga`
4. No asumir que el saldo ya fue acreditado solo por recibir esta respuesta.

### Manejo sugerido en frontend

Si el backend responde error `400`, mostrar el mensaje recibido.

Ejemplos:

- monto invalido
- wallet inexistente
- error de configuracion o creacion del PaymentIntent

---

## Paso del frontend con Stripe

Este paso no pega contra el backend. Se hace contra Stripe usando el `clientSecret`.

### Objetivo

Confirmar el `PaymentIntent`.

### Resultado esperado

El frontend puede recibir de Stripe alguno de estos escenarios:

- pago confirmado o en proceso
- pago fallido
- autenticacion adicional requerida

### Que debe hacer el frontend despues de confirmar con Stripe

- Si Stripe devuelve error inmediato, mostrar el error y frenar el flujo.
- Si Stripe devuelve un estado exitoso o en proceso, mostrar `Estamos confirmando tu recarga`.
- En ese momento empezar a esperar confirmacion del backend por websocket o consultar el endpoint de estado.

Importante:

- aun cuando Stripe responda bien del lado cliente, el frontend no debe actualizar el saldo local como definitivo hasta la confirmacion del backend.

---

## Endpoint 2 - Consultar estado de la recarga

### Request

`GET /api/stripe-topups/:id/status`

### Ejemplo

`GET /api/stripe-topups/5d8c7f9f-0f55-4d06-968b-00d1e9dfe2b1/status`

### Headers

```http
Authorization: Bearer <token>
```

### Response exitosa

```json
{
  "id": "5d8c7f9f-0f55-4d06-968b-00d1e9dfe2b1",
  "clientTransactionId": "f483d90a-482e-4924-89f6-e4d8dbf9296f",
  "paymentIntentId": "pi_3RwExample123456789",
  "amountUsd": 25.5,
  "currency": "usd",
  "status": "COMPLETED",
  "becoinsGranted": 479,
  "createdAt": "2026-04-11T15:30:00.000Z",
  "completedAt": "2026-04-11T15:30:08.000Z",
  "failureCode": null,
  "failureMessage": null
}
```

### Posibles valores de `status`

- `PENDING`
- `FAILED`
- `CANCELLED`
- `COMPLETED`

### Que debe hacer el frontend con esta respuesta

Si `status = PENDING`:

- seguir mostrando `Procesando recarga`
- volver a consultar luego de unos segundos si no llego websocket

Si `status = COMPLETED`:

- mostrar `Saldo acreditado`
- refrescar wallet/saldo del usuario
- cerrar modal o llevar al estado final exitoso

Si `status = FAILED` o `CANCELLED`:

- mostrar mensaje de error
- usar `failureMessage` si viene informado
- permitir reintentar

### Error de autorizacion o acceso

Si el backend devuelve `403` o `404`, el frontend no debe seguir haciendo polling con ese `topupId`.

---

## Websocket

El backend emite un evento al usuario cuando la recarga termina.

### Evento emitido

Actualmente el gateway emite el evento:

`payment-success`

### Payload cuando sale bien

```json
{
  "wallet_id": "wallet-uuid",
  "message": "Recarga acreditada con exito",
  "amount": 25.5,
  "success": true,
  "amount_payment_id_deleted": null,
  "noHidden": true
}
```

### Payload cuando falla o se cancela

```json
{
  "wallet_id": "wallet-uuid",
  "message": "Stripe informo que el pago fallo",
  "amount": 25.5,
  "success": false,
  "amount_payment_id_deleted": null,
  "noHidden": true
}
```

### Que debe hacer el frontend al recibir websocket

Si `success = true`:

- mostrar mensaje de recarga exitosa
- refrescar wallet/saldo
- detener polling al endpoint de estado

Si `success = false`:

- mostrar mensaje de error
- detener polling
- permitir nuevo intento

---

## Estrategia recomendada para frontend

### Flujo recomendado

1. Llamar `POST /api/stripe-topups/create-intent`
2. Confirmar pago con Stripe usando `clientSecret`
3. Mostrar estado `Procesando recarga`
4. Escuchar websocket
5. En paralelo, si quieren robustez extra, consultar `GET /api/stripe-topups/:id/status` cada 2 o 3 segundos durante un tiempo corto
6. Cuando llegue `COMPLETED`, refrescar wallet

### Recomendacion de UX

- No cerrar la pantalla apenas Stripe confirme el pago.
- Mostrar un paso intermedio:
  - `Pago recibido`
  - `Estamos acreditando tu saldo`
- Finalizar el flujo solo con confirmacion del backend.

---

## Casos a contemplar en frontend

### Caso 1 - Error al crear PaymentIntent

El frontend debe mostrar el error y no intentar abrir Stripe.

### Caso 2 - Error inmediato al confirmar pago con Stripe

El frontend debe mostrar el error devuelto por Stripe y permitir reintento.

### Caso 3 - Stripe confirma, pero el backend aun no proceso webhook

El frontend debe quedar en `Procesando recarga`.

### Caso 4 - No llega websocket

El frontend debe apoyarse en `GET /api/stripe-topups/:id/status`.

### Caso 5 - Recarga completada

El frontend refresca el saldo y muestra mensaje de exito.

### Caso 6 - Recarga fallida o cancelada

El frontend informa el fallo y permite intentar nuevamente.

---

## Campos que el frontend deberia persistir durante el flujo

- `topupId`
- `clientTransactionId`
- `paymentIntentId`
- `amountUsd`

El campo mas importante para consultar estado es `topupId`.

---

## Resumen corto para implementacion

- El frontend inicia la recarga con `create-intent`.
- Stripe maneja la captura del pago.
- El backend confirma todo por webhook.
- El frontend espera confirmacion real del backend.
- La acreditacion de saldo nunca se decide del lado cliente.
