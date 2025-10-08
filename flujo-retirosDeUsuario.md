# Flujo de Retiros

Este documento describe el flujo de retiros dentro de la aplicación.  
**Nota:** Los detalles de los datos solicitados y las respuestas pueden consultarse en la documentación de **Swagger**.

---

## 1. Gestión de Cuentas de Retiro por el Usuario

- **Agregar cuenta de retiro:**  
  `POST /withdraw-account`

- **Obtener todas las cuentas del usuario:**  
  `GET /withdraw-account`

- **Ver los datos de una cuenta específica:**  
  `GET /withdraw-account/:id`

- **Actualizar una cuenta existente:**  
  `PUT /withdraw-account/:id`

- **Desactivar una cuenta:**  
  `PUT /withdraw-account/disactive/:id`

- **Reactivar una cuenta desactivada:**  
  `PUT /withdraw-account/active/:id`

---

## 2. Flujo de Retiro para el Usuario

1. Desde el **Home**, el usuario puede ver sus cuentas de retiro (`GET /withdraw-account`).
2. Selecciona una de sus cuentas y solicita un retiro indicando el monto:  
   `POST /user-withdraw/withdraw`
3. Luego de solicitar el retiro:
   - Se descuenta el saldo disponible del usuario.
   - El sistema muestra el **saldo retenido**.
   - El retiro queda en estado **pendiente**.

---

## 3. Gestión de Retiros por el Superadmin

- **Listar todas las solicitudes de retiro pendientes:**  
  `GET /user-withdraw`  
  (permite filtrar por estado, usuario, cuenta de destino y monto).

- **Completar un retiro:**  
  Una vez realizada la transferencia bancaria, el superadmin actualiza el estado a **completada**:  
  `PUT /user-withdraw/withdraw-completed`  
  > Se debe ingresar:  
  > - Identificador de la transferencia del banco.  
  > - Observación (opcional).  
  > El sistema:  
  > - Elimina los Becoins retenidos.  
  > - Marca el retiro y la transacción como **COMPLETED**.

- **Fallar un retiro:**  
  En caso de que el banco rechace la transferencia:  
  `PUT /user-withdraw/withdraw-failed`  
  > Se debe ingresar:  
  > - Motivo del fallo en `observation`.  
  > - Identificador de transferencia fallida (si existe) en `reference`.  
  > El sistema:  
  > - Devuelve el saldo en Becoin al usuario.  
  > - Marca el retiro y la transacción como **FAILED**.

---
