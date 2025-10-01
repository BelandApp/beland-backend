# 📖 Flujo de Compra de Recursos (Transferencia Bancaria)

Este documento describe el flujo completo que deben implementar los programadores del **frontend** para la compra de recursos vía **transferencia bancaria**.  
> ℹ️ Para conocer los datos exactos que deben enviarse en los `body` y las respuestas de cada endpoint, revisar el **Swagger** en:  
> [https://beland-backend-266662044893.us-east1.run.app/api/docs#/](https://beland-backend-266662044893.us-east1.run.app/api/docs#/)

---

## 1. Creación y publicación de recursos por el comerciante
- El **comerciante** crea sus recursos en el sistema:  
POST /resources

- Los recursos creados quedan automáticamente publicados y disponibles en la app.

---

## 2. Configuración de cuentas para cobros (comerciante)
- El **comerciante** puede registrar sus cuentas bancarias donde recibirá los pagos:  
POST /payment-accounts


- Estas cuentas serán las que los usuarios compradores podrán ver al momento de elegir la transferencia bancaria como método de pago.

---

## 3. Catálogo de recursos
- El **usuario comprador** puede listar los recursos publicados por los comerciantes:  
GET /resources

---

## 4. Selección de recurso y método de pago
- El usuario elige un recurso para comprar.  
- Si selecciona el método de pago **Transferencia Bancaria**:  
- La app debe mostrar las cuentas bancarias cargadas por el comerciante:  
  ```
  GET /payment-account
  ```
- Si el comerciante no tiene cuentas registradas, se debe informar al usuario:  
  > "Este comerciante no tiene disponible el método de pago por transferencia bancaria."

---

## 5. Elección de cuenta y datos de transferencia
- El usuario selecciona la cuenta bancaria del comerciante.  
- La app muestra los datos de esa cuenta + 2 campos para completar:  
- **Identificador de la transferencia bancaria** (ej: número de operación).  
- **Titular de la cuenta emisora** (desde donde el usuario hace la transferencia).  

---

## 6. Confirmación de la compra
- El usuario realiza la transferencia desde su banco.  
- Luego confirma en la app:  
POST /user-resources/purchase-transfer

(enviando el identificador y el titular de la cuenta).  

---

## 7. Revisión del comerciante
- El **comerciante** recibe la compra en su dashboard:  
GET /user-resources/transfer-commerce-all


- Puede filtrar por estado: `PENDING`, `COMPLETED`, `FAILED`.  
- Estados disponibles:  
  ```
  GET /transaction-state
  ```
- El comerciante ingresa a su banco, valida los datos, y decide:  
- ✅ Si la transacción está OK:  
  ```
  PUT /user-resources/transfer-completed/:transfer_resource_id
  ```
  - El sistema cambia el estado a `COMPLETED` y asigna el recurso al usuario.  
- ❌ Si la transacción falló/no llegó:  
  ```
  PUT /user-resources/transfer-failed/:transfer_resource_id
  ```
  - El sistema cambia el estado a `FAILED` y **no** asigna el recurso.  

---

## 8. Seguimiento del usuario
- El **usuario comprador** puede ver todas sus compras vía transferencia:  
GET /user-resources/transfer-user-all


- Puede filtrar por `PENDING`, `COMPLETED`, `FAILED`.  
- También puede consultar sus recursos adquiridos:  
GET /user-resources



---

# 🔑 Recomendaciones
1. **Controlar estados:**  
 - En frontend siempre mostrar el estado actualizado de cada compra (`PENDING`, `COMPLETED`, `FAILED`).  
 - Refrescar la información en dashboard del usuario y comerciante.  

2. **Validaciones UX:**  
 - Antes de confirmar la compra (`POST /user-resources/purchase-transfer`), verificar que el usuario haya completado ambos campos: identificador + titular.  

3. **Errores comunes:**  
 - Si no hay cuentas cargadas, no permitir avanzar en la compra.  
 - Mostrar mensajes claros en caso de error o falta de datos.  

4. **Swagger:**  
 - Revisar en el **Swagger** los `body`, `params` y `responses` de cada endpoint.  
 - Link directo: [API Docs](https://beland-backend-266662044893.us-east1.run.app/api/docs#/).  