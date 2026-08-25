# Guía de Integración para Frontend - Módulo de Experiences

## 1. Productos y Likes (Público)

El endpoint de likes ahora es **público** y ya no requiere token de autenticación. Funciona como un contador simple (tipo "claps").

**Endpoint:** `POST /api/products/:id/like`
- **Body:** `{}` (Ninguno)
- **Respuesta Exitosa (200 OK):**
```json
{
  "likes": 15
}
```

Al listar Experiences (`GET /api/feed/experiences`), la propiedad `isLiked` siempre retornará `false` (ya no se trackea por usuario). El campo `likesCount` indicará el total de likes.

---

## 2. Compras y Reservas de Experiences

**Endpoint:** `POST /api/experiences/purchases`
- **Método:** POST
- **Auth:** Público (Guest) o Autenticado.

### Payload

```json
{
  "items": [
    {
      "product_id": "uuid-del-producto",
      "quantity": 1
    }
  ],
  "total_amount": 100.50,          // Monto total sumado (Obligatorio)
  "email": "comprador@email.com",    // Obligatorio para cashback futuro
  "phone": "0987654321",             // Obligatorio
  "is_reserved": false,              // true si es reserva, false si es compra inmediata
  "payment_method": "PAYPHONE",      // "PAYPHONE" o "TRANSFER"
  "payphone_transaction_id": "tx_12345" // Opcional (Requerido solo si hay pago con Payphone)
}
```

### Flujos de Negocio y sus Reglas

Existen 4 combinaciones posibles que el Frontend puede enviar:

#### A) Compra Inmediata con Payphone (Cashback Inmediato/Pendiente)
- `is_reserved`: **false**
- `payment_method`: **"PAYPHONE"**
- `payphone_transaction_id`: **Requerido** (ID devuelto por Payphone tras el cobro).

#### B) Compra Inmediata con Transferencia (Cashback Inmediato/Pendiente)
- `is_reserved`: **false**
- `payment_method`: **"TRANSFER"**
- `payphone_transaction_id`: **Omitir**

#### C) Reserva sin Pago (Sin Cashback hasta que pague en puerta)
- `is_reserved`: **true**
- `payment_method`: **"PAYPHONE"** (Se usa Payphone como default para reservas sin pago online).
- `payphone_transaction_id`: **Omitir**

#### D) Reserva Pagada con Payphone (Cashback Inmediato/Pendiente)
- `is_reserved`: **true**
- `payment_method`: **"PAYPHONE"**
- `payphone_transaction_id`: **Requerido**

*(Nota: `TRANSFER` no está permitido si `is_reserved` es `true`. El backend lanzará un error 400).*

### Respuesta

El backend procesará la compra y determinará si otorga cashback de BeCoins Orange.
Ejemplo de respuesta (201 Created):
```json
{
  "purchase_id": "uuid-de-la-compra",
  "status": "ENTREGADO", 
  "is_reserved": false,
  "orange_reward_amount": 50 // Cashback ganado (0 si no aplica o es reserva sin pago)
}
```
**Estados devueltos en `status`**:
- `ENTREGADO`: Compra inmediata completada.
- `PAGADO`: Reserva pagada online.
- `RESERVADO`: Reserva sin pago online.

---

## 3. Recompensas (Cashback) para Guest Users

Si el usuario realiza una compra como Guest (`email` y `phone` provistos) y dicha compra generó cashback (`orange_reward_amount > 0`), las BeCoins Orange quedan "pendientes".
**Automáticamente**, cuando ese usuario se registre en la App usando el mismo `email` o `phone`, el backend acreditará todas sus recompensas pendientes a su nueva billetera sin que el Frontend deba llamar a ningún endpoint adicional.

---

## 4. Endpoint de Administración

Para uso futuro o panel administrativo:
**Endpoint:** `PATCH /api/experiences/purchases/:id/status/delivered`
- **Descripción:** Cambia manualmente el estado de una compra/reserva a `ENTREGADO`.
- **Respuesta:**
```json
{
  "purchase_id": "uuid-de-la-compra",
  "status": "ENTREGADO"
}
```
