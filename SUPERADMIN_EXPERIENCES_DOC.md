# Documentación para Frontend: Panel de Experiences (Purchases)

Esta guía documenta los endpoints y transiciones de estado disponibles para el panel administrativo de compras y reservas de Experiences.

Todas las rutas aquí detalladas requieren **Autenticación (JWT)** y rol **ADMIN** o **SUPERADMIN**.

---

## 1. Listado de Compras/Reservas

**Endpoint:** `GET /api/experiences/purchases`
**Autenticación:** Sí (Bearer Token)
**Query Params:** `?page=1&limit=20`

**Respuesta de Ejemplo:**
```json
{
  "data": [
    {
      "id": "uuid-1234",
      "email": "user@example.com",
      "phone": "0991234567",
      "total_amount": "50.00",
      "payment_method": "TRANSFER",
      "status": "RESERVADO",
      "is_reserved": true,
      "orange_reward_amount": 0,
      "orange_reward_credited": false,
      "created_at": "2023-10-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 2. Detalle de una Compra/Reserva

**Endpoint:** `GET /api/experiences/purchases/:id`
**Autenticación:** Sí (Bearer Token)

**Respuesta de Ejemplo:**
```json
{
  "id": "uuid-1234",
  "email": "user@example.com",
  "phone": "0991234567",
  "total_amount": "50.00",
  "currency": "USD",
  "status": "PAGADO",
  "is_reserved": true,
  "payment_method": "PAYPHONE",
  "payphone_transaction_id": "tx-999",
  "orange_reward_amount": 5,
  "orange_reward_credited": false,
  "created_at": "2023-10-01T12:00:00.000Z",
  "updated_at": "2023-10-02T10:00:00.000Z",
  "items": [
    {
      "id": "item-uuid",
      "product_id": "prod-uuid",
      "quantity": 2,
      "unit_price": "25.00",
      "subtotal": "50.00",
      "product": {
        "id": "prod-uuid",
        "name": "Experiencia en Globo",
        "price": "25.00"
      }
    }
  ]
}
```

---

## 3. Transiciones de Estado (Acciones)

Nunca envíes un estado arbitrario. Existen dos endpoints específicos para realizar transiciones controladas de estado.

### A. Marcar como Pagado
Solo mostrar el botón "Marcar como pagado" si el `status` es **RESERVADO**.

**Endpoint:** `PATCH /api/experiences/purchases/:id/status/paid`
**Autenticación:** Sí (Bearer Token)
**Body:** No requiere body.

**Respuesta Exitosa (200 OK):**
```json
{
  "purchase_id": "uuid-1234",
  "status": "PAGADO",
  "orange_reward_amount": 5
}
```
*(Nota: Al marcar como pagado, el backend automáticamente calcula y asigna el cashback correspondiente).*

### B. Marcar como Entregado
Mostrar el botón "Marcar como entregado" si el `status` es **PAGADO** o **RESERVADO**.

**Endpoint:** `PATCH /api/experiences/purchases/:id/status/delivered`
**Autenticación:** Sí (Bearer Token)
**Body:** No requiere body.

**Respuesta Exitosa (200 OK):**
```json
{
  "purchase_id": "uuid-1234",
  "status": "ENTREGADO"
}
```

---

## 4. Reglas UI de Botones por Estado

Utiliza la propiedad `status` recibida para condicionar qué botones mostrar en el frontend:

| Estado Actual (`status`) | Botones a Mostrar |
| :--- | :--- |
| **RESERVADO** | `[Marcar como Pagado]` `[Marcar como Entregado]` |
| **PAGADO** | `[Marcar como Entregado]` |
| **ENTREGADO** | *(Ninguna acción de estado permitida)* |

> **Nota:** La propiedad `is_reserved` (booleano) indica si el pedido comenzó como reserva, independientemente del estado actual de la orden. No uses `is_reserved` para calcular si se muestra el botón "Marcar como Pagado", utiliza `status === 'RESERVADO'`.
