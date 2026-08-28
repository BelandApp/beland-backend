# EXPERIENCES_EVENT_FINAL_PLAN

## Auditoría y Estado Actual
Tras revisar la estructura del código, se determinó lo siguiente:
- **Experiences/Products:** Se apoyan sobre `Product` con el flag `is_experience = true`. Esto funciona correctamente y los flujos de creación, lectura e imágenes/videos deben mantenerse intactos.
- **Likes:** Actualmente, se utiliza una entidad relacional `ProductLike` (tabla `product_likes`) que asocia `product_id` con `user_id`. Existen endpoints protegidos (`POST /products/:id/like` y `DELETE /products/:id/like`). Esto contradice el nuevo requerimiento de usar un contador simple público.
- **ExperiencePurchase:** Actualmente tiene campos como `payphone_transaction_id` (obligatorio y único), `email` (opcional), `total_amount`, `currency` y `status`. No contempla reservas sin pago ni la generación de cashback Orange.
- **Cashback (BeCoins Orange):** La lógica de cashback ya existe y se utiliza en `RechargeUseCase`. Delega en `SuperAdminConfigService.getRechargeCommission(provider)` y el valor de la BeCoin (`priceOneBecoin`). Es completamente reutilizable sin inventar sistemas paralelos.
- **Rewards / Códigos Promocionales:** El módulo `becoin-code` (que incluye `RewardCode`, `RewardRedemption` y el endpoint de claim) fue creado específicamente para este flujo en un commit anterior ("termino compra de experiencias..."). No se utiliza en otras partes del sistema y, por tanto, **quedó obsoleto**.

---

## 1 y 2. Modelo Final (Entidades)

### `ExperiencePurchase` (Modificado)
- **`id`**: uuid (PK)
- **`payphone_transaction_id`**: varchar (nullable) - *Para permitir reservas sin pago.*
- **`email`**: varchar (NOT NULL)
- **`phone`**: varchar (NOT NULL) - *Nuevo campo.*
- **`total_amount`**: numeric(10,2)
- **`currency`**: varchar (default 'USD')
- **`status`**: varchar - *Valores posibles: 'RESERVADO', 'PAGADO', 'ENTREGADO'.*
- **`is_reserved`**: boolean (NOT NULL) - *Nuevo campo.*
- **`orange_reward_amount`**: int (default 0) - *Nuevo campo.*
- **`orange_reward_credited`**: boolean (default false) - *Nuevo campo.*
- **`created_at`**: timestamptz
- **`updated_at`**: timestamptz

### `ExperiencePurchaseItem` (Sin cambios)
Se mantiene exactamente igual.
- `id`, `purchase_id`, `product_id`, `quantity`, `unit_price`, `subtotal`.

---

## 3. Campos Necesarios y Reglas
- **Obligatoriedad:** `email` y `phone` son siempre obligatorios sin importar si el usuario está logueado o es Guest.
- **Integridad de Precios:** Los precios se toman siempre de la base de datos (`Product.price`), ignorando cualquier valor unitario enviado por el frontend.

---

## 4 y 5. Estados y `is_reserved`
Existen tres estados funcionales soportados por la entidad:
- **`RESERVADO`**: Reserva sin pago (`is_reserved = true`).
- **`PAGADO`**: Reserva pagada en el momento pero pendiente de entrega (`is_reserved = true`).
- **`ENTREGADO`**: Compra pagada y entregada de forma inmediata, o reserva que fue posteriormente entregada (`is_reserved = false` en el primer caso, y se mantiene `true` en el segundo).

---

## 6, 7 y 8. Los Tres Flujos Principales

### A. Compra Inmediata
- **Frontend envía:** `payphone_transaction_id`, items, email, phone, `is_reserved: false`.
- **Backend:** Calcula precios. Si coinciden, crea `ExperiencePurchase` con `is_reserved = false`, `status = 'ENTREGADO'`.
- **Cashback:** Calcula `orange_reward_amount` basado en la configuración actual y lo guarda (con `orange_reward_credited = false`).

### B. Reserva Sin Pago
- **Frontend envía:** items, email, phone, `is_reserved: true`. (No envía `payphone_transaction_id`).
- **Backend:** Crea `ExperiencePurchase` con `payphone_transaction_id = null`, `is_reserved = true`, `status = 'RESERVADO'`.
- **Cashback:** Al no haber pago, guarda `orange_reward_amount = 0` y `orange_reward_credited = false`.

### C. Reserva Pagada en el Momento
- **Frontend envía:** `payphone_transaction_id`, items, email, phone, `is_reserved: true`.
- **Backend:** Crea `ExperiencePurchase` con `payphone_transaction_id` recibido, `is_reserved = true`, `status = 'PAGADO'`.
- **Cashback:** Calcula el `orange_reward_amount` de la misma manera que en la compra inmediata y lo guarda.

---

## 9. Flujo de Entrega Posterior
El SUPERADMIN, mediante un endpoint (a determinar si ya existe para modificar órdenes o se creará en el controlador de experiencias), buscará la compra por ID y cambiará el `status` de `'RESERVADO'` o `'PAGADO'` a `'ENTREGADO'`.

---

## 10, 11 y 12. Flujo de Cashback (BeCoins Orange)
El cashback se calculará reutilizando `SuperadminConfigService`:
1. Se obtiene el `recharge_commission_payphone` (ej: 0.02 = 2%).
2. Se obtiene el `priceOneBecoin` (ej: 0.05).
3. **Cálculo:** `orange_reward_amount = Math.floor((total_amount / priceOneBecoin) * commission_payphone)`.
4. Se almacena este valor en `orange_reward_amount` de la compra.
5. El flag `orange_reward_credited` se inicializa en `false`.

---

## 13. Acreditación Posterior
Se creará un nuevo Caso de Uso `ProcessPendingExperiencePurchasesUseCase` que será invocado desde `AuthService` cuando un usuario se registra o hace login.
- Buscará todas las compras en `ExperiencePurchase` asociadas al `email` (y `phone` si corresponde) del usuario donde `orange_reward_credited = false` y `orange_reward_amount > 0`.
- Se aplicará un **lock pesimista** (`pessimistic_write`) sobre las filas encontradas para evitar condiciones de carrera.
- Invoca `GenerateOrangeRewardUseCase` para acreditar las BeCoins a la Wallet del usuario.
- Actualiza `orange_reward_credited = true`.

---

## 14. Endpoint de Likes
Se eliminará la lógica de la entidad `ProductLike`.
- En su lugar, se añadirá la columna `likes` (tipo int, default 0) a la entidad `Product`.
- Se modificará el endpoint `POST /products/:id/like` para que sea **público**.
- Dicho endpoint ejecutará un simple `UPDATE products SET likes = likes + 1 WHERE id = :id` y devolverá el total actualizado.

---

## 15 y 16. Endpoints y Obsoletos

**Endpoints Finales de Experiences/Purchases:**
- `POST /experiences/purchases`: Atiende los tres flujos en una sola llamada.
- Retorno:
  ```json
  {
    "purchase_id": "uuid",
    "status": "RESERVADO | PAGADO | ENTREGADO",
    "is_reserved": boolean,
    "orange_reward_amount": integer
  }
  ```
- `POST /products/:id/like` (Público).

**Endpoints Obsoletos (Serán Eliminados):**
- `DELETE /products/:id/like` (Ya no hay removes por usuario).
- `POST /api/rewards/claim` (El sistema paralelo de códigos desaparece).

---

## 17. Migraciones Necesarias
Se generará una única migración que:
1. Haga `payphone_transaction_id` `nullable` en la tabla `experience_purchases`.
2. Añada la columna `phone` (`varchar`, no null).
3. Modifique `email` para ser `NOT NULL`.
4. Añada `is_reserved` (`boolean`, no null).
5. Añada `orange_reward_amount` (`int`, default 0) y `orange_reward_credited` (`boolean`, default false).
6. Elimine la tabla `product_likes`.
7. Añada la columna `likes` (`int`, default 0) a la tabla `products`.
8. *Opcional:* Elimine las tablas `reward_codes` y `reward_redemptions`.

---

## 18 y 19. Archivos a Modificar / Eliminar

**A Modificar:**
- `src/modules/experiences/entities/experience-purchase.entity.ts`
- `src/modules/experiences/dto/create-experience-purchase.dto.ts`
- `src/modules/experiences/experience-purchases.controller.ts`
- `src/modules/experiences/experience-purchases.service.ts`
- `src/modules/products/entities/product.entity.ts`
- `src/modules/products/products.controller.ts`
- `src/modules/products/products.service.ts`
- `src/modules/auth/auth.service.ts`

**A Eliminar:**
- El módulo completo `src/modules/rewards/becoin-code` (ya que fue creado exclusivamente para la iteración anterior del evento).
- `src/modules/products/entities/product-like.entity.ts`

---

## 20. Riesgos Financieros
- **Doble Acreditación:** Si el usuario hace login múltiples veces simultáneas, el sistema de acreditación posterior podría dispararse en paralelo. **Mitigación:** Uso estricto de bloqueos de base de datos (`lock: { mode: 'pessimistic_write' }`) al procesar los `ExperiencePurchase` pendientes.
- **Manipulación de Precios:** El frontend envía el `total_amount`. **Mitigación:** El backend recalcula el subtotal de cada ítem cruzando con la tabla de `products` en base de datos. Si difiere con el valor enviado por frontend, se rechaza la petición.

---

## 21. Estrategia ZERO-BREAK
- Las Experiences basadas en `is_experience = true` de `Product` y todo el ecosistema de AWS/imágenes permanece inalterado.
- El modelo `ExperiencePurchaseItem` no se toca.
- La migración de base de datos se hará considerando posibles filas existentes (estableciendo valores predeterminados seguros antes de aplicar constraints de NOT NULL).
- El sistema de recompensas `becoin-orange` central no se modifica, solo se consumirá mediante su UseCase estándar.
