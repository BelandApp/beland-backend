# API Endpoints Map

## Tabla Resumen

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | /database-init/load-general | Sí | Crear carga de datos iniciar y parcial |
| POST | /database-init/load-superadmin-and-roles | Sí | Crear usuario SuperAdmin y todos los roles. |
| POST | /database-init/update-all-stock | Sí | Actualizar stock global manualmente |
| POST | /database-init/update-transaction-ux | Sí | Actualizar iconos y colores de transacciones |
| POST | /database-init/quemar-becoin-manual | Sí | Quema 4000 becoin a Richard Gomez |
| GET | /actions | Sí | Listar acciónes con paginación y filtrado |
| GET | /actions/:id | Sí | Obtener una acción por su ID |
| POST | /actions | Sí | Crear una nueva acción |
| PUT | /actions/:id | Sí | Actualizar una acción existente |
| DELETE | /actions/:id | Sí | Eliminar una acción por su ID |
| POST | /admins | Sí | Crear una nueva entrada de administrador |
| GET | /admins | Sí | Obtener la lista de todos los administradores |
| GET | /admins/:admin_id | Sí | Obtener un administrador por su ID |
| PATCH | /admins/:admin_id | Sí | Actualizar los permisos de un administrador |
| DELETE | /admins/:admin_id | Sí | Eliminar una entrada de administrador y resetear el rol del usuario |
| GET | /amount-to-payment | Sí | Listar montos a cobrar con paginación y filtrado por usuario |
| GET | /amount-to-payment/:id | Sí | Obtener un monto a cobrar por su ID |
| POST | /amount-to-payment | Sí | Crear un nuevo monto a cobrar |
| PUT | /amount-to-payment/:id | Sí | Actualizar un monto a cobrar existente |
| DELETE | /amount-to-payment/:id | Sí | Eliminar una monto a cobrar por su ID |
| GET | /auth/me | Sí | Obtener perfil del usuario autenticado |
| POST | /auth/login | Sí | Inicia sesión de usuario con email y contraseña |
| POST | /auth/signup-verification | Sí | Inicia el proceso de registro de un nuevo usuario con verificación por email |
| POST | /auth/signup-register | Sí | Finaliza el registro de usuarios con código de verificación |
| GET | /auth/tbe | Sí | identifica |
| POST | /auth/forgot-password-code/:email | Sí | Solicita un codigo enviado al email para restablecer la contraseña, solo si el email esta registrado |
| POST | /auth/forgot-password-verification-code | Sí | Verifica que el codigo sea correcto para proceder al cambio de clave |
| POST | /auth/forgot-password-change | Sí | Verifica que el codigo sea correcto para proceder al cambio de clave |
| POST | /auth/auth0-login | Sí | Ejecuta la operación auth0Login. |
| GET | /carts/user | Sí | Obtener un carrito por id de usuario |
| GET | /carts/:id | Sí | Obtener un carrito por su ID |
| POST | /carts | Sí | Crear un nuevo Carrito |
| PUT | /carts/group/:id | Sí | Actualizar el grupo de un carrito existente |
| PUT | /carts/address/:id | Sí | Actualizar la direccion de un carrito existente |
| PUT | /carts/payment-type/:id | Sí | Actualizar el tipo de pago de un carrito existente |
| PUT | /carts/delivery/:id | Sí | Actualizar Costo, tiempo y distancia de envio de un carrito existente |
| PUT | /carts/clean/:id | Sí | Vacia un carrito existente |
| PUT | /carts/:id | Sí | Actualizar un carrito existente |
| GET | /cart-items | Sí | Listar items de Carrito con paginación y filtrado por orden |
| GET | /cart-items/user | Sí | Listar items de Carrito con paginación y filtrado por orden y usuario |
| GET | /cart-items/:id | Sí | Obtener un item de carrito por su ID |
| POST | /cart-items | Sí | Crear un nuevo item de carrito |
| PUT | /cart-items/quantity/:id | Sí | Actualizar la cantidad de un item de carrito existente |
| PUT | /cart-items/quantity-by-product/:product_id | Sí | Actualizar la cantidad de un item de carrito existente |
| PUT | /cart-items/:id | Sí | Actualizar un item de carrito existente |
| DELETE | /cart-items/product/:product_id | Sí | Eliminar un item de carrito por su ID |
| DELETE | /cart-items/:id | Sí | Eliminar un item de carrito por su ID |
| GET | /category | Sí | Listar categorias con paginación y filtrado por usuario |
| GET | /category/:id | Sí | Obtener una categoria por su ID |
| POST | /category | Sí | Crear una nueva categoria |
| PUT | /category/:id | Sí | Actualizar una categoria existente |
| DELETE | /category/:id | Sí | Eliminar una categoria por su ID |
| POST | /cloudinary/upload-image | Sí | Subir una sola imagen |
| POST | /cloudinary/upload-images | Sí | Subir múltiples imágenes |
| GET | /coupons | Sí | Listar cupones. ADMIN lista todos. El resto ve los que ha creado. |
| GET | /coupons/available/:commerceId | Sí | Listar cupones disponibles para un comercio específico (público) |
| GET | /coupons/:id | Sí | Buscar un cupón por su ID |
| POST | /coupons | Sí | Crear un nuevo cupón (requiere perfil MERCHANT o rol ADMIN/SUPERADMIN) |
| PUT | /coupons/:id | Sí | Actualizar un cupón existente |
| DELETE | /coupons/:id | Sí | Eliminar un cupón por su ID |
| POST | /coupons/apply | Sí | Aplicar/Redimir un cupón a una compra. Realiza la validación y registra el uso. |
| POST | /delivery/cost | Sí | Ejecuta la operación getCost. |
| POST | /delivery-status | No | Sin descripción. |
| GET | /delivery-status | No | Sin descripción. |
| GET | /delivery-status/:id | No | Sin descripción. |
| PATCH | /delivery-status/:id | No | Sin descripción. |
| DELETE | /delivery-status/:id | No | Sin descripción. |
| GET | /email/test | No | Ejecuta la operación sendTestEmail. |
| GET | /event-pass | Sí | Listado con paginación y filtrado |
| GET | /event-pass/event-type | Sí | Listado de los tipos de eventos |
| GET | /event-pass/user | Sí | Listado con paginación y filtrado por usuario creador |
| GET | /event-pass/:id | Sí | Ejecuta la operación findOne. |
| POST | /event-pass | Sí | Ejecuta la operación create. |
| PUT | /event-pass/update-image/:id | Sí | Actualizar imagen de entrada para evento |
| PUT | /event-pass/active/:id | Sí | Actualizar una entrada a evento existente |
| PUT | /event-pass/disactive/:id | Sí | Actualizar una entrada a evento existente |
| PUT | /event-pass/:id | Sí | Actualizar una entrada a evento existente |
| DELETE | /event-pass/:id | Sí | Eliminar una entrada a evento por su ID |
| POST | /gift-cards | Sí | Create gift card template |
| GET | /gift-cards | Sí | Get paginated gift card templates |
| GET | /gift-cards/:id | Sí | Get gift card template by id |
| PATCH | /gift-cards/:id | Sí | Update gift card template |
| DELETE | /gift-cards/:id | Sí | Delete gift card template |
| PATCH | /gift-cards/:id/toggle-status | Sí | Toggle gift card active status |
| GET | /user-gift-cards/:id | No | Get user gift card by id |
| GET | /user-gift-cards/my/received | No | Get my received gift cards |
| GET | /user-gift-cards/my/sent | No | Get my sent gift cards |
| GET | /user-gift-cards | No | Get paginated user gift cards |
| PATCH | /user-gift-cards/:id/cancel | No | Cancel gift card |
| GET | /group-members/group/:groupId | Sí | Obtener todos los miembros de un grupo |
| GET | /group-members/user/:userId | Sí | Obtener todos los grupos de un usuario |
| GET | /group-members/group-and-user | Sí | Obtener todos los miembros de un grupo por ID de Grupo e ID de Usuario |
| GET | /group-members/:id | Sí | Obtener una membresía de grupo por ID |
| POST | /group-members | Sí | Agregar un miembro a un grupo |
| POST | /group-members/many | Sí | Agregar varios miembros a un grupo |
| DELETE | /group-members/group-and-user | Sí | Eliminar un miembro por ID de Grupo e ID de Usuario. Solo Creador o mismo miembro a eliminar pueden realizar esta acción. |
| DELETE | /group-members/:id | Sí | Eliminar un miembro del grupo por ID. Solo Creador o mismo miembro a eliminar pueden realizar esta acción. |
| GET | /group-member-consumptions | Sí | Obtener consumos con filtros y paginación |
| GET | /group-member-consumptions/summary-product/:group_id | Sí | Resumen de consumos por producto dentro de un grupo |
| GET | /group-member-consumptions/user/:group_id | Sí | Obtener los consumos el usuario por id del grupo |
| GET | /group-member-consumptions/:id | Sí | Obtener un consumo por ID |
| POST | /group-member-consumptions | Sí | Crear un consumo individual |
| POST | /group-member-consumptions/create-many | Sí | Crear múltiples consumos para el usuario autenticado |
| PATCH | /group-member-consumptions/:id | Sí | Actualizar un consumo |
| DELETE | /group-member-consumptions/:id | Sí | Eliminar un consumo |
| GET | /group-services | Sí | Listar servicios de grupos |
| GET | /group-services/group/:group_id | Sí | Listar servicios de u grupo individual |
| GET | /group-services/:id | Sí | Obtener servicio de grupo por ID |
| PUT | /group-services/:id | Sí | Actualizar servicio del grupo |
| DELETE | /group-services/:id | Sí | Eliminar servicio del grupo |
| POST | /group-services | Sí | Crear un servicio para un grupo |
| POST | /group-services/complete/:id | Sí | Completar servicio y liberar saldos (cobra al creador del grupo y paga al superadmin) |
| POST | /group-services/cancelled/:id | Sí | Cancelar servicio y liberar saldos (cobra al grupo y paga al superadmin) |
| GET | /group-type | Sí | Listar tipos de grupos con paginación |
| GET | /group-type/products/:groupTypeId | Sí | Listar todos los productos asociados a un tipo de grupo particular |
| GET | /group-type/:id | Sí | Obtener un tipo de grupo por su ID |
| POST | /group-type | Sí | Crear un nuevo tipo de grupo |
| PUT | /group-type/:id | Sí | Actualizar un tipo de grupo existente |
| DELETE | /group-type/:id | Sí | Eliminar un tipo de grupo por su ID |
| GET | /groups | Sí | Listar grupos con filtros, paginación y orden |
| GET | /groups/privacy-type | Sí | Obtener todos tipos de provacidad de grupo |
| GET | /groups/info-create | Sí | Todas las relaciones para crear un grupo |
| GET | /groups/by-user | Sí | Obtener todos los grupos a los que pertenece el usuario autenticado como miembro. |
| GET | /groups/user-created | Sí | Obtener todos los grupos creados por el usuario. |
| POST | /groups | Sí | Crear un nuevo grupo |
| GET | /groups/:groupId | Sí | Obtener grupo por ID (acceso autorizado) |
| PATCH | /groups/image/:id | Sí | Actualizar imagen del grupo |
| PUT | /groups/soft-delete/:groupId | Sí | Hace un softdelete de un grupo por ID |
| PUT | /groups/reverse-soft-delete/:groupId | Sí | Revierte un softdelete de un grupo por ID |
| PUT | /groups/reactive/:groupId | Sí | Reactiva un grupo por ID |
| PUT | /groups/disactive/:groupId | Sí | Cambia a inactivo un grupo por ID |
| PUT | /groups/:groupId | Sí | Actualizar un grupo por ID |
| DELETE | /groups/:groupId | Sí | Eliminar un grupo por ID |
| GET | /hub-products | Sí | Listar stock de centros de acopio con filtros por hub, producto y cantidad |
| GET | /hub-products/:id | Sí | Obtener detalle de un item de stock |
| POST | /hub-products | Sí | Crear un nuevo item de stock para un centro de acopio |
| PUT | /hub-products/:id | Sí | Actualizar datos de un item de stock |
| PUT | /hub-products/:id/add-stock | Sí | Agregar cantidad al stock de un producto en un hub |
| PUT | /hub-products/:id/discount-stock | Sí | Descontar cantidad del stock de un producto en un hub |
| DELETE | /hub-products/:id | Sí | Eliminar un item de stock |
| GET | /inventory-items | Sí | Listar items de inventario con paginación y filtrado por producto |
| GET | /inventory-items/:id | Sí | Obtener un item de inventario por su ID |
| POST | /inventory-items | Sí | Crear un nuevo item de inventario |
| PUT | /inventory-items/:id | Sí | Actualizar un item de inventario existente |
| DELETE | /inventory-items/:id | Sí | Eliminar un item de inventario por su ID |
| GET | /order-items | Sí | Listar items de Ordenes con paginación y filtrado por orden |
| GET | /order-items/:id | Sí | Obtener un item de Orden por su ID |
| POST | /order-items/consumption | Sí | Registrar consumo de productos en una orden grupal |
| POST | /order-items | Sí | Crear un nuevo item de Orden |
| PUT | /order-items/devolution/:id | Sí | Devolucion de un producto de una Orden existente |
| PUT | /order-items/:id | Sí | Actualizar un item de Orden existente |
| DELETE | /order-items/:id | Sí | Eliminar un item de Orden por su ID |
| GET | /orders | Sí | Listar ordenes con paginación y filtrado  |
| GET | /orders/pending | Sí | Listar ordenes con paginación y filtrado por estado  |
| GET | /orders/user | Sí | Listar ordenes con paginación y filtrado por usuario registrado |
| GET | /orders/:id | Sí | Obtener una orden por su ID |
| POST | /orders/returns/:id | Sí | Registrar devoluciones y recalcular pagos de la orden |
| POST | /orders/refunded-returns/:id | Sí | Registrar devoluciones y recalcular pagos de la orden |
| PUT | /orders/preparing | Sí | Cambiar el estado de la orden a En Preparacion |
| PUT | /orders/on-route | Sí | Cambiar el estado de la orden a En Camino |
| PUT | /orders/delivered | Sí | Confirma Entrega de la orden por admin |
| PUT | /orders/collected | Sí | Cambiar el estado de la orden a Recolectado. y Entregando las Becoin_Green. Retorna codigo de reciclaje |
| PUT | /orders/recycled | Sí | Registra el peso de la cantidad reciclada de una orden |
| PUT | /orders/cancelled | Sí | Cancelacion de la orden |
| POST | /orders/cart | Sí | Crear una nueva orden desde un carrito |
| GET | /payment-types | Sí | Listar formas de pagos |
| GET | /payment-types/services | Sí | Listar formas de pagos para servicios |
| GET | /payment-types/:id | Sí | Obtener una forma de pago por su ID |
| POST | /payment-types | Sí | Crear una nueva forma de pago |
| PUT | /payment-types/:id | Sí | Actualizar una forma de pago existente |
| DELETE | /payment-types/:id | Sí | Eliminar una forma de pago por su ID |
| GET | /payments | Sí | Listar pagos con paginación y filtro exclusivo |
| GET | /payments/order/:order_id | Sí | Listar pagos con paginación y filtro exclusivo de una orden |
| GET | /payments/:id | Sí | Obtener un pago por su ID |
| POST | /payments/pay-now/:payment_id | Sí | Crear un nuevo pago |
| POST | /payments/payphone/:payment_id | Sí | Realizar pago de orden mediante Payphone |
| POST | /payments/transfer/:payment_id | Sí | Realizar pago de orden mediante Transferencia Bancaria |
| POST | /payments | Sí | Crear un nuevo pago |
| PUT | /payments/:id | Sí | Actualizar un pago existente |
| DELETE | /payments/:id | Sí | Eliminar un pago por su ID |
| GET | /payment-account | Sí | Listar cuantas de pago con paginación y filtrado por usuario |
| GET | /payment-account/user | Sí | Listar cuantas de pago del usuario logueado con paginación y filtrado por usuario |
| GET | /payment-account/at-recharge | Sí | Listar cuantas de pago para recarga de saldo con paginación y filtrado por usuario |
| GET | /payment-account/user-active | Sí | Listar cuantas activas de pago del usuario logueado con paginación y filtrado por usuario |
| GET | /payment-account/:id | Sí | Obtener una cuenta de pago por su ID |
| POST | /payment-account | Sí | Crear una nueva cuenta de pago |
| PUT | /payment-account/activate/:id | Sí | Actualizar una cuenta de pago existente |
| PUT | /payment-account/deactivate/:id | Sí | Actualizar una cuenta de pago existente |
| PUT | /payment-account/:id | Sí | Actualizar una cuenta de pago existente |
| DELETE | /payment-account/:id | Sí | Eliminar una cuenta de pago por su ID |
| GET | /preset-amount | Sí | Listar montos preestablecidos con paginación y filtrado por usuario |
| GET | /preset-amount/:id | Sí | Obtener un monto preestablecido por su ID |
| POST | /preset-amount | Sí | Crear un nuevo monto preestablecido |
| PUT | /preset-amount/:id | Sí | Actualizar un monto preestablecido existente |
| DELETE | /preset-amount/:id | Sí | Eliminar una monto preestablecido por su ID |
| GET | /prize-redemptions | Sí | Listar canjes de premios con paginación y filtro exclusivo |
| GET | /prize-redemptions/:id | Sí | Obtener un canje de premio por su ID |
| POST | /prize-redemptions | Sí | Crear un nuevo canje de premio |
| PUT | /prize-redemptions/:id | Sí | Actualizar un canje de premio existente |
| DELETE | /prize-redemptions/:id | Sí | Eliminar un canje de premio por su ID |
| GET | /prizes | Sí | Listar premios con paginación |
| GET | /prizes/:id | Sí | Obtener un premio por su ID |
| POST | /prizes | Sí | Crear un nuevo premio |
| PUT | /prizes/:id | Sí | Actualizar un premio existente |
| DELETE | /prizes/:id | Sí | Eliminar un premio por su ID |
| POST | /products | Sí | Crear un nuevo producto (solo Admin/Superadmin). |
| POST | /products/group-types/:id | Sí | Asociar tipos de grupo a un producto (solo Admin/Superadmin). |
| PATCH | /products/:id | Sí | Actualizar un producto por ID (solo Admin/Superadmin). |
| DELETE | /products/:id | Sí | Eliminar un producto por ID (solo Admin/Superadmin). |
| DELETE | /products/hard-delete/all | Sí | Eliminar todos los productos de forma permanente. |
| GET | /products/soft-deleted | Sí | Obtener la lista de productos eliminados lógicamente (soft-delete). |
| GET | /products | Sí | Listar productos con paginación, ordenamiento y filtrado (accesible públicamente). |
| GET | /products/:id | Sí | Obtener un producto por ID (accesible públicamente). |
| GET | /creators | Sí | Listar creadores de contenido con filtros, paginación y orden |
| GET | /creators/:id | Sí | Obtener un creador de contenido por su ID |
| GET | /creators/me/profile | Sí | Obtener el perfil de creador del usuario autenticado |
| POST | /creators | Sí | Crear un nuevo perfil de creador de contenido |
| PUT | /creators/:id | Sí | Actualizar un perfil de creador de contenido |
| DELETE | /creators/:id | Sí | Eliminar un creador de contenido por su ID |
| GET | /drivers | Sí | Listar conductores con filtros dinámicos, paginación y orden |
| GET | /drivers/vehicle-types | Sí | Listar todos los tipos de vehiculos para deliverys |
| GET | /drivers/:id | Sí | Obtener un conductor por su ID |
| GET | /drivers/user | Sí | Obtener un conductor por su ID |
| POST | /drivers | Sí | Crear un nuevo perfil de conductor |
| PUT | /drivers/disactive/:id | Sí | Dar de Baja un conductor y volver rol a USER |
| PUT | /drivers/active/:id | Sí | Activar un conductor y asignar perfil DRIVER |
| PUT | /drivers/:id | Sí | Actualizar un perfil de conductor |
| DELETE | /drivers/:id | Sí | Eliminar un conductor por su ID |
| GET | /foundations | Sí | Listar fundaciones sin fines de lucro con filtros dinámicos, paginación y orden |
| GET | /foundations/user/:user_id | Sí | Obtener fundación asociada a un usuario |
| GET | /foundations/:id | Sí | Obtener una fundación sin fines de lucro por ID |
| POST | /foundations | Sí | Crear una nueva fundación sin fines de lucro |
| PUT | /foundations/activate/:id | Sí | Activar fundación sin fines de lucro y asignar perfil FOUNDATION |
| PUT | /foundations/disactive/:id | Sí | Desactivar fundación sin fines de lucro y remover perfil FOUNDATION |
| PUT | /foundations/:id | Sí | Actualizar una fundación sin fines de lucro existente |
| DELETE | /foundations/:id | Sí | Eliminar una fundación sin fines de lucro por ID |
| GET | /hubs | Sí | Listar centros de acopio con filtros dinámicos, paginación y orden |
| GET | /hubs/:id | Sí | Obtener un centro de acopio por su ID |
| GET | /hubs/user | Sí | Obtener centro de acopio asociado al usuario autenticado |
| POST | /hubs | Sí | Crear un nuevo centro de acopio |
| PUT | /hubs/disactive/:id | Sí | Dar de baja un centro de acopio y remover perfil HUB |
| PUT | /hubs/active/:id | Sí | Activar un centro de acopio y asignar perfil HUB |
| PUT | /hubs/:id | Sí | Actualizar un centro de acopio |
| DELETE | /hubs/:id | Sí | Eliminar un centro de acopio por su ID |
| GET | /merchants | Sí | Listar comercios con filtros dinámicos, paginación y orden |
| GET | /merchants/user/:user_id | Sí | Obtener comercio asociado a un usuario |
| GET | /merchants/:id | Sí | Obtener un comercio por ID |
| POST | /merchants | Sí | Crear un nuevo comercio |
| PUT | /merchants/activate/:id | Sí | Activar comercio y asignar perfil MERCHANT |
| PUT | /merchants/disactive/:id | Sí | Desactivar comercio y remover perfil MERCHANT |
| PUT | /merchants/:id | Sí | Actualizar un comercio existente |
| DELETE | /merchants/:id | Sí | Eliminar un comercio por ID |
| GET | /recyclers | Sí | Listar recicladores de base con filtros, paginación y orden |
| GET | /recyclers/user | Sí | Obtener reciclador de base asociado a un usuario |
| GET | /recyclers/:id | Sí | Obtener un reciclador de base por ID |
| POST | /recyclers | Sí | Crear un nuevo reciclador de base |
| PUT | /recyclers/activate/:id | Sí | Activar reciclador de base y asignar perfil RECYCLER_BASE |
| PUT | /recyclers/disactive/:id | Sí | Desactivar reciclador de base y remover perfil RECYCLER_BASE |
| PUT | /recyclers/:id | Sí | Actualizar un reciclador de base existente |
| DELETE | /recyclers/:id | Sí | Eliminar un reciclador de base por ID |
| GET | /recycled-items | Sí | Listar productos reciclados con paginación y filtro exclusivo para superadmin |
| GET | /recycled-items/user | Sí | Listar productos reciclados con paginación y filtro exclusivo para el usuario que llama |
| GET | /recycled-items/:id | Sí | Obtener un producto reciclado por su ID |
| POST | /recycled-items | Sí | Crear un nuevo producto reciclado |
| PUT | /recycled-items/:id | Sí | Actualizar un producto reciclado existente |
| DELETE | /recycled-items/:id | Sí | Eliminar un producto reciclado por su ID |
| POST | /roles | Sí | Crear un nuevo rol (Solo Superadmin). |
| GET | /roles | Sí | Obtener todos los roles (Solo Admin/Superadmin). |
| GET | /roles/:id | Sí | Obtener un rol por ID (Solo Admin/Superadmin). |
| GET | /roles/:id/users | Sí | Obtener usuarios por ID de rol (Solo Admin/Superadmin). |
| PATCH | /roles/:id | Sí | Actualizar un rol por ID (Solo Superadmin). |
| DELETE | /roles/:id | Sí | Eliminar un rol por ID (Solo Superadmin). |
| GET | /services | Sí | Listado de servicios con paginación y filtrado |
| GET | /services/:id | Sí | Obtener servicio por ID |
| POST | /services | Sí | Ejecuta la operación create. |
| PUT | /services/update-image/:id | Sí | Actualizar imagen del servicio |
| PUT | /services/active/:id | Sí | Activar servicio |
| PUT | /services/disactive/:id | Sí | Desactivar servicio |
| PUT | /services/enable/:id | Sí | Habilitar servicio |
| PUT | /services/disable/:id | Sí | Deshabilitar servicio |
| PUT | /services/:id | Sí | Actualizar servicio |
| DELETE | /services/:id | Sí | Eliminar servicio |
| POST | /stripe-topups/create-intent | Sí | Crea un PaymentIntent de Stripe para recargar la wallet del usuario autenticado |
| GET | /stripe-topups/:id/status | Sí | Consulta el estado de una recarga Stripe del usuario autenticado |
| POST | /webhooks/stripe | Sí | Webhook de Stripe para confirmar o fallar recargas de wallet |
| POST | /testimonies | Sí | Crea un nuevo testimonio. |
| GET | /testimonies | Sí | Obtiene todos los testimonios. Los usuarios no autenticados solo ven aprobados. |
| GET | /testimonies/:id | Sí | Obtiene un testimonio por su ID. Requiere permisos si no está aprobado. |
| PATCH | /testimonies/:id | Sí | Actualiza un testimonio por su ID (solo autor o ADMIN/SUPERADMIN). |
| PATCH | /testimonies/:id/approve | Sí | Aprueba un testimonio (solo ADMIN/SUPERADMIN). |
| DELETE | /testimonies/:id | Sí | Realiza un soft delete de un testimonio (solo autor o ADMIN/SUPERADMIN). |
| DELETE | /testimonies/:id/hard | Sí | ELIMINA PERMANENTEMENTE un testimonio por ID (solo SUPERADMIN). |
| GET | /transaction-state | Sí | Listar estados de transacciones con paginación |
| GET | /transaction-state/:id | Sí | Obtener un estado de transacción por su ID |
| POST | /transaction-state | Sí | Crear un nuevo estado de transacción |
| PUT | /transaction-state/:id | Sí | Actualizar un estado de transacción existente |
| DELETE | /transaction-state/:id | Sí | Eliminar un estado de transacción por su ID |
| GET | /transaction-type | Sí | Listar tipos de transacciones de transacciones con paginación |
| GET | /transaction-type/:id | Sí | Obtener un tipo de transacción de transacción por su ID |
| POST | /transaction-type | Sí | Crear un nuevo tipo de transacción |
| PUT | /transaction-type/:id | Sí | Actualizar un tipo de transacción existente |
| DELETE | /transaction-type/:id | Sí | Eliminar un tipo de transacción por su ID |
| GET | /transactions | Sí | Listar transacciones con paginación y filtrado por usuario |
| GET | /transactions/recent-recipients | Sí | lista de los ultimos contactos a los que se transfirio. |
| GET | /transactions/:id | Sí | Obtener una transacción por su ID |
| POST | /transactions | Sí | Crear una nueva transacción |
| PUT | /transactions/:id | Sí | Actualizar una transacción existente |
| DELETE | /transactions/:id | Sí | Eliminar una transacción por su ID |
| GET | /user-address | Sí | Listar direcciones con paginación y filtrado por usuario |
| GET | /user-address/:id | Sí | Obtener una dirección por su ID |
| POST | /user-address | Sí | Crear una nueva dirección |
| PUT | /user-address/default-address/:id | Sí | Actualizar una dirección poniendola como Default |
| PUT | /user-address/:id | Sí | Actualizar una dirección existente |
| DELETE | /user-address/:id | Sí | Eliminar una dirección por su ID |
| GET | /user-cards | Sí | Listar tarjetas con paginación y filtrado por usuario |
| GET | /user-cards/:id | Sí | Obtener una tarjeta por su ID |
| GET | /user-cards/data-payment/:card_id | Sí | Obtener los datos de Tarjeta para Comprar en un click |
| POST | /user-cards | Sí | Crear una nueva tarjeta |
| PUT | /user-cards/:id | Sí | Actualizar una tarjeta existente |
| DELETE | /user-cards/:id | Sí | Eliminar una tarjeta por su ID |
| GET | /user-event-passes | Sí | Listado global con paginación y filtros |
| GET | /user-event-passes/user | Sí | Listado de entradas del usuario autenticado |
| GET | /user-event-passes/:id | Sí | Obtener entrada por ID |
| POST | /user-event-passes/purchase | Sí | Comprar un EventPass |
| POST | /user-event-passes/purchase-recharge | Sí | Comprar un EventPass con recarga de saldo payphone |
| POST | /user-event-passes/purchase-transfer | Sí | Comprar un EventPass con Transferencia Bancaria |
| POST | /user-event-passes/refund/:id | Sí | Solicitar reembolso de un EventPass |
| POST | /user-event-passes/consume | Sí | Marcar entrada como consumida |
| GET | /user-feedback/user | Sí | Listar feedbacks con paginación |
| GET | /user-feedback/feedback-review | Sí | Listar feedbacks con filtros y paginación |
| GET | /user-feedback/:id | Sí | Obtener un feedbacks por su ID |
| POST | /user-feedback | Sí | Crear un nuevo feedbacks |
| PUT | /user-feedback/:id | Sí | Actualizar un feedbacks existente |
| DELETE | /user-feedback/:id | Sí | Eliminar un feedbacks por su ID |
| GET | /user-recharge | Sí | Listar recargas de usuario con paginación y filtrado por estado |
| GET | /user-recharge/:id | Sí | Obtener una recarga de usuario por su ID |
| POST | /user-recharge | Sí | Crear una nueva recarga de usuario |
| PUT | /user-recharge/completed/:id | Sí | Actualizar una recarga de usuario existente |
| PUT | /user-recharge/failed/:id | Sí | Actualizar una recarga de usuario existente |
| DELETE | /user-recharge/:id | Sí | Eliminar una recarga de usuario por su ID |
| GET | /user-withdraw | Sí | Listar retiros con paginación y filtrado por usuario |
| GET | /user-withdraw/user | Sí | Listar retiros con paginación y filtrado por usuario |
| GET | /user-withdraw/:id | Sí | Obtener una extracción por su ID |
| POST | /user-withdraw/withdraw | Sí | Crear una Solicitud de Retiro |
| POST | /user-withdraw/withdraw-failed | Sí | Completa el Flujo de retiro para una transaccion fallida en la cuenta del usuario |
| POST | /user-withdraw/withdraw-completed | Sí | Completa el Flujo de retiro para una transaccion exitosa en la cuenta del usuario |
| POST | /users/auth0-login | Sí | Login o registro de usuario a través de Auth0 (público). |
| POST | /users | Sí | Registrar un nuevo usuario (público). |
| GET | /users/user-event-beland | Sí | Ejecuta la operación getUsersEventBeland. |
| GET | /users/me | Sí | Obtener información del usuario autenticado. |
| PATCH | /users/me | Sí | Actualizar información del usuario autenticado. |
| GET | /users/by-email | Sí | Buscar usuario por dirección de email (Solo Admin/Superadmin). |
| GET | /users | Sí | Obtener lista de usuarios con paginación, filtrado y ordenación (Solo Admin/Superadmin). |
| GET | /users/deactivated | Sí | Obtener usuarios desactivados (Solo Admin/Superadmin). |
| GET | /users/:id | Sí | Obtener un usuario por ID (Propietario o Admin/Superadmin). |
| PUT | /users/imgProfile/:id | Sí | Subir imagen de perfil de usuario |
| PATCH | /users/changeRoleToCommerce | Sí | Endpoint obsoleto. Las funciones de comercio ahora se manejan con profiles. |
| PATCH | /users/change-role | Sí | Cambia el rol del usuario al que se pase por parametro. |
| PATCH | /users/change-password | Sí | Cambiar la contraseña del usuario autenticado |
| PATCH | /users/:id | Sí | Actualizar un usuario por ID (Solo para Admins/Superadmins). |
| DELETE | /users/finally/:id | Sí | Elimina definitivamente Solo Superadmin |
| DELETE | /users/:id | Sí | Desactivar (soft-delete) un usuario por ID (Solo Admin/Superadmin). |
| PATCH | /users/:id/reactivate | Sí | Reactivar un usuario por ID (Solo Admin/Superadmin). |
| PATCH | /users/:id/block-status | Sí | Bloquear o desbloquear un usuario por ID (Solo Admin/Superadmin). |
| GET | /wallets | Sí | Listar billeteras Virtuales con paginación |
| GET | /wallets/user | Sí | Obtener una billetera por su Usuario |
| GET | /wallets/qr | Sí | Obtener una billetera por su Usuario |
| GET | /wallets/alias/:alias | Sí | Obtener una billetera por su Alias |
| GET | /wallets/data-Payment/:wallet_id | Sí | Obtener información para generar el pago |
| GET | /wallets/:id | Sí | Obtener una billetera por su ID |
| POST | /wallets | Sí | Crear una nueva billetera |
| PUT | /wallets/alias-qr | Sí | Genera alias y qr si no lo tiene |
| PUT | /wallets/alias/:id | Sí | Actualiza el alias por uno personalizado |
| PUT | /wallets/admin/fix-missing-qr | Sí | Generar QR faltantes en todas las wallets (solo superadmin) |
| PUT | /wallets/:id | Sí | Actualizar una billetera existente |
| DELETE | /wallets/:id | Sí | Eliminar una billetera por su ID |
| POST | /wallets/recharge | Sí | Crear una nueva recarga o compra de Beicon |
| POST | /wallets/transfer | Sí | Crear una nueva transferencia |
| POST | /wallets/purchase-becoin | Sí | Crear una nueva compra a una entidad con becoin. Por medio de QR (debe desencriptarse u enviar el uuid de la wallet del vendedor contenido) |
| POST | /wallets/purchase-recharge/:to_wallet_id | Sí | Crear una nueva compra a una entidad. Por medio de QR (debe desencriptarse y enviar el uuid de la wallet contenido de la entidad) |
| POST | /wallets/purchase-giftcard | Sí | Comprar una Gift Card mediante Payphone |
| POST | /wallets/purchase-giftcard/transfer | Sí | Comprar una Gift Card mediante Transferencia Bancaria |
| GET | /withdraw-account | Sí | Listar cuentas de retiro con paginación y filtrado por usuario |
| GET | /withdraw-account/enums | Sí | Retorna los enums para las opciones de las cuentas |
| GET | /withdraw-account/:id | Sí | Obtener una cuenta de retiro por su ID |
| POST | /withdraw-account | Sí | Crear una nueva cuenta de retiro |
| PUT | /withdraw-account/active/:id | Sí | Activa una cuenta desactivada |
| PUT | /withdraw-account/disactive/:id | Sí | Desactiva una cuenta existente |
| PUT | /withdraw-account/:id | Sí | Actualizar una cuenta de retiro existente |
| DELETE | /withdraw-account/:id | Sí | Eliminar una cuenta de retiro por su ID |
| GET | /withdraw-account-type | Sí | Listar tipos de cuentas con paginación |
| GET | /withdraw-account-type/:id | Sí | Obtener un tipo de cuenta por su ID |
| POST | /withdraw-account-type | Sí | Crear un nuevo tipo de cuenta |
| PUT | /withdraw-account-type/:id | Sí | Actualizar un tipo de cuenta existente |
| DELETE | /withdraw-account-type/:id | Sí | Eliminar un tipo de cuenta por su ID |

---

## Actions

### GET /actions

**Qué hace:** Listar acciónes con paginación y filtrado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /actions/:id

**Qué hace:** Obtener una acción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /actions

**Qué hace:** Crear una nueva acción.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateActionDto

- user_id: string — obligatorio (@IsUUID())
- description: string — obligatorio (@IsString())
- required: false — obligatorio 
- transaction_hash: string — opcional (@IsString())
- required: false — obligatorio 
- block_number: number — opcional (@IsNumber())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /actions/:id

**Qué hace:** Actualizar una acción existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateActionDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /actions/:id

**Qué hace:** Eliminar una acción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Admins

### POST /admins

**Qué hace:** Crear una nueva entrada de administrador.

**Autenticación:** Requiere JWT

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateAdminDto

- user_id: string — obligatorio 
- content_permission: boolean — opcional 
- user_permission: boolean — opcional 
- moderation_permission: boolean — opcional 
- finance_permission: boolean — opcional 
- analytics_permission: boolean — opcional 
- settings_permission: boolean — opcional 
- leader_management_permission: boolean — opcional 
- company_management_permission: boolean — opcional 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `AdminDto`. Status esperado: 200/201 (si exitoso).

---

### GET /admins

**Qué hace:** Obtener la lista de todos los administradores.

**Autenticación:** Requiere JWT

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /admins/:admin_id

**Qué hace:** Obtener un administrador por su ID.

**Autenticación:** Requiere JWT

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
- `admin_id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `AdminDto`. Status esperado: 200/201 (si exitoso).

---

### PATCH /admins/:admin_id

**Qué hace:** Actualizar los permisos de un administrador.

**Autenticación:** Requiere JWT

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `admin_id`: string/UUID

**Query Params:**
Ninguno

**Body:**
UpdateAdminDto

- user_id: string — opcional (@IsOptional())
- content_permission: boolean — opcional 
- user_permission: boolean — opcional 
- moderation_permission: boolean — opcional 
- finance_permission: boolean — opcional 
- analytics_permission: boolean — opcional 
- settings_permission: boolean — opcional 
- leader_management_permission: boolean — opcional 
- company_management_permission: boolean — opcional 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `AdminDto`. Status esperado: 200/201 (si exitoso).

---

### DELETE /admins/:admin_id

**Qué hace:** Eliminar una entrada de administrador y resetear el rol del usuario.

**Autenticación:** Requiere JWT

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `admin_id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## AmountToPayment

### GET /amount-to-payment

**Qué hace:** Listar montos a cobrar con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /amount-to-payment/:id

**Qué hace:** Obtener un monto a cobrar por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /amount-to-payment

**Qué hace:** Crear un nuevo monto a cobrar.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateAmountToPaymentDto

- amount: number — obligatorio (@Min(0, { message: 'El monto debe ser mayor o igual a 0' }))
- message: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /amount-to-payment/:id

**Qué hace:** Actualizar un monto a cobrar existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateAmountToPaymentDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /amount-to-payment/:id

**Qué hace:** Eliminar una monto a cobrar por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Auth

### GET /auth/me

**Qué hace:** Obtener perfil del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/login

**Qué hace:** Inicia sesión de usuario con email y contraseña.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
LoginAuthDto

- email: string — obligatorio 
- password: string — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `LoginAuthDto`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/signup-verification

**Qué hace:** Inicia el proceso de registro de un nuevo usuario con verificación por email.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
RegisterAuthDto

- username: string — opcional (@MinLength(3, { message: 'username debe tener al menos 3 caracteres' }))
- required: false — obligatorio 
- full_name: string — opcional (@IsString({ message: 'full_name debe ser una cadena de texto' }))
- nullable: true — obligatorio 
- required: false — obligatorio 
- profile_picture_url: string — opcional (@IsString({ message: 'profile_picture_url debe ser una cadena de texto' }))
- required: false — obligatorio 
- address: string — opcional (@IsString({ message: 'address debe ser una cadena de texto' }))
- example: 123456789 — obligatorio 
- required: false — obligatorio 
- phone: string — opcional (@IsPhoneNumber())
- required: false — obligatorio 
- country: string — opcional (@IsString({ message: 'country debe ser una cadena de texto' }))
- required: false — obligatorio 
- city: string — opcional (@IsString({ message: 'city debe ser una cadena de texto' }))
- code: string — obligatorio (@IsNotEmpty({ message: 'El código no puede estar vacío.' }))
- email: string — obligatorio (@IsNotEmpty({ message: 'El email no puede estar vacío.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/signup-register

**Qué hace:** Finaliza el registro de usuarios con código de verificación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
ConfirmAuthDto

- username: string — opcional (@MinLength(3, { message: 'username debe tener al menos 3 caracteres' }))
- required: false — obligatorio 
- full_name: string — opcional (@IsString({ message: 'full_name debe ser una cadena de texto' }))
- nullable: true — obligatorio 
- required: false — obligatorio 
- profile_picture_url: string — opcional (@IsString({ message: 'profile_picture_url debe ser una cadena de texto' }))
- required: false — obligatorio 
- address: string — opcional (@IsString({ message: 'address debe ser una cadena de texto' }))
- example: 123456789 — obligatorio 
- required: false — obligatorio 
- phone: string — opcional (@IsPhoneNumber())
- required: false — obligatorio 
- country: string — opcional (@IsString({ message: 'country debe ser una cadena de texto' }))
- required: false — obligatorio 
- city: string — opcional (@IsString({ message: 'city debe ser una cadena de texto' }))
- code: string — obligatorio (@IsNotEmpty({ message: 'El código no puede estar vacío.' }))
- email: string — obligatorio (@IsNotEmpty({ message: 'El email no puede estar vacío.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /auth/tbe

**Qué hace:** identifica.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `identificador`: (opcional)
- `clave`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/forgot-password-code/:email

**Qué hace:** Solicita un codigo enviado al email para restablecer la contraseña, solo si el email esta registrado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `email`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/forgot-password-verification-code

**Qué hace:** Verifica que el codigo sea correcto para proceder al cambio de clave.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `email`: (opcional)
- `code`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/forgot-password-change

**Qué hace:** Verifica que el codigo sea correcto para proceder al cambio de clave.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
ChangePasswordDto

- email: string — obligatorio (@IsNotEmpty({ message: 'El email es obligatorio' }))
- password: string — obligatorio 
- confirmPassword: string — obligatorio (@IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /auth/auth0-login

**Qué hace:** Ejecuta la operación auth0Login.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Cart

### GET /carts/user

**Qué hace:** Obtener un carrito por id de usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /carts/:id

**Qué hace:** Obtener un carrito por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /carts

**Qué hace:** Crear un nuevo Carrito.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateCartDto

- user_id: string — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/group/:id

**Qué hace:** Actualizar el grupo de un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/address/:id

**Qué hace:** Actualizar la direccion de un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/payment-type/:id

**Qué hace:** Actualizar el tipo de pago de un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/delivery/:id

**Qué hace:** Actualizar Costo, tiempo y distancia de envio de un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
DeliveryCartDto

- maxDecimalPlaces: 2 — obligatorio 
- duration_min: number — obligatorio 
- maxDecimalPlaces: 2 — obligatorio 
- distance_km: number — obligatorio 
- maxDecimalPlaces: 2 — obligatorio 
- delivery_cost: number — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/clean/:id

**Qué hace:** Vacia un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /carts/:id

**Qué hace:** Actualizar un carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateCartDto

- address_id: string — opcional (@IsOptional())
- payment_type_id: string — opcional (@IsOptional())
- group_id: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## CartItems

### GET /cart-items

**Qué hace:** Listar items de Carrito con paginación y filtrado por orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `cart_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /cart-items/user

**Qué hace:** Listar items de Carrito con paginación y filtrado por orden y usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `cart_id`: (opcional)
- `user_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /cart-items/:id

**Qué hace:** Obtener un item de carrito por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /cart-items

**Qué hace:** Crear un nuevo item de carrito.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `is_general`: (opcional)

**Body:**
CreateCartItemDto

- cart_id: string — obligatorio (@IsUUID())
- product_id: string — obligatorio (@IsUUID())
- example: 2 — obligatorio 
- minimum: 1 — obligatorio 
- type: Number — obligatorio 
- quantity: number — obligatorio 
- example: 19 — obligatorio 
- type: Number — obligatorio 
- maxDecimalPlaces: 2 — obligatorio 
- unit_price: number — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /cart-items/quantity/:id

**Qué hace:** Actualizar la cantidad de un item de carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `quantity`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /cart-items/quantity-by-product/:product_id

**Qué hace:** Actualizar la cantidad de un item de carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `quantity`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /cart-items/:id

**Qué hace:** Actualizar un item de carrito existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateCartItemDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /cart-items/product/:product_id

**Qué hace:** Eliminar un item de carrito por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /cart-items/:id

**Qué hace:** Eliminar un item de carrito por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Category

### GET /category

**Qué hace:** Listar categorias con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /category/:id

**Qué hace:** Obtener una categoria por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /category

**Qué hace:** Crear una nueva categoria.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateCategoryDto

- name: string — obligatorio (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /category/:id

**Qué hace:** Actualizar una categoria existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateCategoryDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /category/:id

**Qué hace:** Eliminar una categoria por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Cloudinary

### POST /cloudinary/upload-image

**Qué hace:** Subir una sola imagen.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /cloudinary/upload-images

**Qué hace:** Subir múltiples imágenes.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Controllers

### POST /gift-cards

**Qué hace:** Create gift card template.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGiftCardDto

- name: string — obligatorio (@Length(2, 150))
- description: string — opcional (@Length(0, 5000))
- image_url: string — opcional (@Length(0, 500))
- amount: number — obligatorio (@IsPositive())
- currency: string — opcional (@Length(1, 10))
- expiration_days: number — opcional (@Max(3650))
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /gift-cards

**Qué hace:** Get paginated gift card templates.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /gift-cards/:id

**Qué hace:** Get gift card template by id.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /gift-cards/:id

**Qué hace:** Update gift card template.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
UpdateGiftCardDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /gift-cards/:id

**Qué hace:** Delete gift card template.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /gift-cards/:id/toggle-status

**Qué hace:** Toggle gift card active status.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-gift-cards/:id

**Qué hace:** Get user gift card by id.

**Autenticación:** Público

**Roles/Permisos:** RoleEnum.SUPERADMIN

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-gift-cards/my/received

**Qué hace:** Get my received gift cards.

**Autenticación:** Público

**Roles/Permisos:** RoleEnum.SUPERADMIN

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-gift-cards/my/sent

**Qué hace:** Get my sent gift cards.

**Autenticación:** Público

**Roles/Permisos:** RoleEnum.SUPERADMIN

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-gift-cards

**Qué hace:** Get paginated user gift cards.

**Autenticación:** Público

**Roles/Permisos:** RoleEnum.SUPERADMIN

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /user-gift-cards/:id/cancel

**Qué hace:** Cancel gift card.

**Autenticación:** Público

**Roles/Permisos:** RoleEnum.SUPERADMIN

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Coupons

### GET /coupons

**Qué hace:** Listar cupones.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /coupons/available/:commerceId

**Qué hace:** Listar cupones disponibles para un comercio específico (público).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /coupons/:id

**Qué hace:** Buscar un cupón por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Coupon`. Status esperado: 200/201 (si exitoso).

---

### POST /coupons

**Qué hace:** Crear un nuevo cupón (requiere perfil MERCHANT o rol ADMIN/SUPERADMIN).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateCouponDto

- name: string — obligatorio (@IsString())
- nullable: true — obligatorio 
- code: string — obligatorio (@IsString())
- type: CouponType — obligatorio (@IsEnum(CouponType))
- value: number — obligatorio (@Min(0.01))
- nullable: true — obligatorio 
- max_discount_cap: number — obligatorio (@Min(0))
- nullable: true — obligatorio 
- min_spend_required: number — obligatorio (@Min(0))
- nullable: true — obligatorio 
- expires_at: Date — obligatorio (@IsDate())
- nullable: true — obligatorio 
- max_usage_count: number — obligatorio (@Min(0))
- nullable: true — obligatorio 
- usage_limit_per_user: number — obligatorio (@Min(0))
- defecto: true — obligatorio 
- nullable: true — obligatorio 
- is_active: boolean — obligatorio (@IsBoolean())
- REMOVED: created_by_user_id — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /coupons/:id

**Qué hace:** Actualizar un cupón existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateCouponDto

- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /coupons/:id

**Qué hace:** Eliminar un cupón por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /coupons/apply

**Qué hace:** Aplicar/Redimir un cupón a una compra.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
ApplyCouponDto

- coupon_id: string — obligatorio (@IsUUID())
- user_id: string — obligatorio (@IsUUID())
- purchase_total: number — obligatorio (@Min(0.01))
- commerce_id: string — obligatorio (@IsUUID())
- required: false — obligatorio 
- order_id: string — opcional (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Object`. Status esperado: 200/201 (si exitoso).

---

## Creators

### GET /creators

**Qué hace:** Listar creadores de contenido con filtros, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /creators/:id

**Qué hace:** Obtener un creador de contenido por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /creators/me/profile

**Qué hace:** Obtener el perfil de creador del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /creators

**Qué hace:** Crear un nuevo perfil de creador de contenido.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateCreatorDto

- category_id: string — obligatorio (@IsUUID())
- main_social_network_id: string — obligatorio (@IsUUID())
- bio: string — opcional (@IsString())
- main_link: string — opcional (@IsString())
- followers_count: number — opcional (@Min(0))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /creators/:id

**Qué hace:** Actualizar un perfil de creador de contenido.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateCreatorDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /creators/:id

**Qué hace:** Eliminar un creador de contenido por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Delivery

### POST /delivery/cost

**Qué hace:** Ejecuta la operación getCost.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
DeliveryInfoDto

- driverLat: number — obligatorio (@IsNumber())
- driverLon: number — obligatorio (@IsNumber())
- customerLat: number — obligatorio (@IsNumber())
- customerLon: number — obligatorio (@IsNumber())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## DeliveryStatus

### POST /delivery-status

**Qué hace:** Sin descripción.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateDeliveryStatusDto

(Estructura no detallada)

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /delivery-status

**Qué hace:** Sin descripción.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /delivery-status/:id

**Qué hace:** Sin descripción.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /delivery-status/:id

**Qué hace:** Sin descripción.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
UpdateDeliveryStatusDto

(Estructura no detallada)

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /delivery-status/:id

**Qué hace:** Sin descripción.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Drivers

### GET /drivers

**Qué hace:** Listar conductores con filtros dinámicos, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /drivers/vehicle-types

**Qué hace:** Listar todos los tipos de vehiculos para deliverys.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /drivers/:id

**Qué hace:** Obtener un conductor por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /drivers/user

**Qué hace:** Obtener un conductor por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /drivers

**Qué hace:** Crear un nuevo perfil de conductor.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateDriverDto

- user_id: string — obligatorio (@IsUUID())
- motivation_bio: string — opcional (@IsString())
- profile_tagline: string — opcional (@IsString())
- face_image_url: string — opcional (@IsUrl())
- vehicle_type_id: string — opcional (@IsUUID())
- vehicle_description: string — opcional (@IsString())
- vehicle_plate: string — opcional (@IsString())
- vehicle_image_url: string — opcional (@IsUrl())
- is_active: boolean — opcional (@IsBoolean())
- work_address_id: string — opcional (@IsUUID())
- license_number: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /drivers/disactive/:id

**Qué hace:** Dar de Baja un conductor y volver rol a USER.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /drivers/active/:id

**Qué hace:** Activar un conductor y asignar perfil DRIVER.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /drivers/:id

**Qué hace:** Actualizar un perfil de conductor.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateDriverDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /drivers/:id

**Qué hace:** Eliminar un conductor por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Email

### GET /email/test

**Qué hace:** Ejecuta la operación sendTestEmail.

**Autenticación:** Público

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Ninguno

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## EventPass

### GET /event-pass

**Qué hace:** Listado con paginación y filtrado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /event-pass/event-type

**Qué hace:** Listado de los tipos de eventos.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /event-pass/user

**Qué hace:** Listado con paginación y filtrado por usuario creador.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /event-pass/:id

**Qué hace:** Ejecuta la operación findOne.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /event-pass

**Qué hace:** Ejecuta la operación create.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateEventPassDto

- code: string — obligatorio (@MaxLength(100))
- name: string — obligatorio (@MaxLength(200))
- image_url: any — opcional (@IsOptional())
- images_urls: any[] — opcional (@IsOptional())
- description: string — opcional (@IsString())
- message: string — opcional (@IsString())
- type_id: string — obligatorio (@IsUUID())
- event_place: string — opcional (@IsString())
- event_city: string — opcional (@IsString())
- address: string — obligatorio (@MaxLength(200))
- latitude: number — opcional (@IsLatitude())
- longitude: number — opcional (@IsLongitude())
- 15T20: 00 — obligatorio 
- event_date: Date — obligatorio (@IsDate())
- 01T00: 00 — obligatorio 
- required: false — obligatorio 
- start_sale_date: Date — opcional (@IsDate())
- 10T23: 59 — obligatorio 
- required: false — obligatorio 
- end_sale_date: Date — opcional (@IsDate())
- limit_tickets: number — obligatorio (@IsNumber())
- price_usd: number — obligatorio (@IsNumber())
- discount: number — opcional (@IsNumber())
- is_refundable: boolean — opcional (@IsBoolean())
- refund_days_limit: number — opcional (@IsNumber())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /event-pass/update-image/:id

**Qué hace:** Actualizar imagen de entrada para evento.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /event-pass/active/:id

**Qué hace:** Actualizar una entrada a evento existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /event-pass/disactive/:id

**Qué hace:** Actualizar una entrada a evento existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /event-pass/:id

**Qué hace:** Actualizar una entrada a evento existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateEventPassDto

- image_url: string — opcional (@IsUrl({}, { message: 'La URL de la imagen principal no es válida.' }))
- images_urls: string[] — opcional (@IsUrl({}, { each: true, message: 'Cada URL adicional debe tener un formato válido.' }))
- total_becoin: number — opcional (@IsNumber())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /event-pass/:id

**Qué hace:** Eliminar una entrada a evento por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Foundations

### GET /foundations

**Qué hace:** Listar fundaciones sin fines de lucro con filtros dinámicos, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /foundations/user/:user_id

**Qué hace:** Obtener fundación asociada a un usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /foundations/:id

**Qué hace:** Obtener una fundación sin fines de lucro por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /foundations

**Qué hace:** Crear una nueva fundación sin fines de lucro.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateFoundationDto

- name: string — obligatorio (@Length(2, 150))
- legal_name: string — opcional (@Length(2, 150))
- ruc: string — opcional (@Length(5, 20))
- description: string — opcional (@IsString())
- phone: string — opcional (@Length(5, 20))
- email: string — opcional (@IsEmail())
- address_id: string — obligatorio (@IsUUID())
- logo_url: string — opcional (@IsUrl())
- website: string — opcional (@IsUrl())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /foundations/activate/:id

**Qué hace:** Activar fundación sin fines de lucro y asignar perfil FOUNDATION.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /foundations/disactive/:id

**Qué hace:** Desactivar fundación sin fines de lucro y remover perfil FOUNDATION.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /foundations/:id

**Qué hace:** Actualizar una fundación sin fines de lucro existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateFoundationDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /foundations/:id

**Qué hace:** Eliminar una fundación sin fines de lucro por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## GroupMembers

### GET /group-members/group/:groupId

**Qué hace:** Obtener todos los miembros de un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `groupId`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-members/user/:userId

**Qué hace:** Obtener todos los grupos de un usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `userId`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-members/group-and-user

**Qué hace:** Obtener todos los miembros de un grupo por ID de Grupo e ID de Usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `groupId`: (opcional)
- `userId`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-members/:id

**Qué hace:** Obtener una membresía de grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-members

**Qué hace:** Agregar un miembro a un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGroupMemberDto

- group_id: string — obligatorio (@IsNotEmpty())
- user_id: string — obligatorio (@IsNotEmpty())
- group_id: string — obligatorio (@IsNotEmpty())
- users: string[] — obligatorio (@IsUUID('4', { each: true }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-members/many

**Qué hace:** Agregar varios miembros a un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateManyGroupMemberDto

- group_id: string — obligatorio (@IsNotEmpty())
- user_id: string — obligatorio (@IsNotEmpty())
- group_id: string — obligatorio (@IsNotEmpty())
- users: string[] — obligatorio (@IsUUID('4', { each: true }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /group-members/group-and-user

**Qué hace:** Eliminar un miembro por ID de Grupo e ID de Usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `groupId`: (opcional)
- `userId`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /group-members/:id

**Qué hace:** Eliminar un miembro del grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## GroupMembersConsumption

### GET /group-member-consumptions

**Qué hace:** Obtener consumos con filtros y paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-member-consumptions/summary-product/:group_id

**Qué hace:** Resumen de consumos por producto dentro de un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-member-consumptions/user/:group_id

**Qué hace:** Obtener los consumos el usuario por id del grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-member-consumptions/:id

**Qué hace:** Obtener un consumo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-member-consumptions

**Qué hace:** Crear un consumo individual.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGroupMemberConsumptionDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-member-consumptions/create-many

**Qué hace:** Crear múltiples consumos para el usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateManyGroupMemberConsumptionDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /group-member-consumptions/:id

**Qué hace:** Actualizar un consumo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateGroupMemberConsumptionDto

- notes: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /group-member-consumptions/:id

**Qué hace:** Eliminar un consumo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## GroupServices

### GET /group-services

**Qué hace:** Listar servicios de grupos.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-services/group/:group_id

**Qué hace:** Listar servicios de u grupo individual.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-services/:id

**Qué hace:** Obtener servicio de grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /group-services/:id

**Qué hace:** Actualizar servicio del grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateGroupServiceDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /group-services/:id

**Qué hace:** Eliminar servicio del grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-services

**Qué hace:** Crear un servicio para un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGroupServiceDto

- group_id: string — obligatorio (@IsUUID())
- ej: Musicalizaci — obligatorio 
- service_id: string — obligatorio (@IsUUID())
- payment_type_id: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `GroupService`. Status esperado: 200/201 (si exitoso).

---

### POST /group-services/complete/:id

**Qué hace:** Completar servicio y liberar saldos (cobra al creador del grupo y paga al superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-services/cancelled/:id

**Qué hace:** Cancelar servicio y liberar saldos (cobra al grupo y paga al superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## GroupType

### GET /group-type

**Qué hace:** Listar tipos de grupos con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-type/products/:groupTypeId

**Qué hace:** Listar todos los productos asociados a un tipo de grupo particular.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /group-type/:id

**Qué hace:** Obtener un tipo de grupo por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /group-type

**Qué hace:** Crear un nuevo tipo de grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGroupTypeDto

- name: string — obligatorio (@MaxLength(255))
- image_url: string — obligatorio (@IsNotEmpty())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /group-type/:id

**Qué hace:** Actualizar un tipo de grupo existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateGroupTypeDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /group-type/:id

**Qué hace:** Eliminar un tipo de grupo por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Groups

### GET /groups

**Qué hace:** Listar grupos con filtros, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /groups/privacy-type

**Qué hace:** Obtener todos tipos de provacidad de grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /groups/info-create

**Qué hace:** Todas las relaciones para crear un grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /groups/by-user

**Qué hace:** Obtener todos los grupos a los que pertenece el usuario autenticado como miembro.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `is_active`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Boolean`. Status esperado: 200/201 (si exitoso).

---

### GET /groups/user-created

**Qué hace:** Obtener todos los grupos creados por el usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `is_active`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Boolean`. Status esperado: 200/201 (si exitoso).

---

### POST /groups

**Qué hace:** Crear un nuevo grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateGroupDto

- name: string — obligatorio (@Length(3, 255))
- image_url: string — obligatorio (@Length(3, 255))
- description: string — opcional (@Length(3, 255))
- message_invitation: string — opcional (@Length(3, 1000))
- user_address_id: string — opcional (@IsUUID())
- group_type_id: string — opcional (@IsUUID())
- privacy_id: string — opcional (@IsUUID())
- payment_type_id: string — opcional (@IsUUID())
- 15T22: 00 — obligatorio 
- 03: 00 — obligatorio 
- event_at: Date — obligatorio (@IsDate({ message: 'event_at must be a valid date-time' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /groups/:groupId

**Qué hace:** Obtener grupo por ID (acceso autorizado).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Group`. Status esperado: 200/201 (si exitoso).

---

### PATCH /groups/image/:id

**Qué hace:** Actualizar imagen del grupo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /groups/soft-delete/:groupId

**Qué hace:** Hace un softdelete de un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /groups/reverse-soft-delete/:groupId

**Qué hace:** Revierte un softdelete de un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /groups/reactive/:groupId

**Qué hace:** Reactiva un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /groups/disactive/:groupId

**Qué hace:** Cambia a inactivo un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /groups/:groupId

**Qué hace:** Actualizar un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateGroupDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Group`. Status esperado: 200/201 (si exitoso).

---

### DELETE /groups/:groupId

**Qué hace:** Eliminar un grupo por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## HubProduct

### GET /hub-products

**Qué hace:** Listar stock de centros de acopio con filtros por hub, producto y cantidad.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /hub-products/:id

**Qué hace:** Obtener detalle de un item de stock.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /hub-products

**Qué hace:** Crear un nuevo item de stock para un centro de acopio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateHubProductDto

- hub_id: string — obligatorio (@IsUUID())
- product_id: string — obligatorio (@IsUUID())
- quantity: number — obligatorio (@Min(0))
- stock_min: number — obligatorio (@Min(0))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hub-products/:id

**Qué hace:** Actualizar datos de un item de stock.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateHubProductDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hub-products/:id/add-stock

**Qué hace:** Agregar cantidad al stock de un producto en un hub.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
AddStockDto

- quantity: number — obligatorio (@Min(1))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hub-products/:id/discount-stock

**Qué hace:** Descontar cantidad del stock de un producto en un hub.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
DiscountStockDto

- quantity: number — obligatorio (@Min(1))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /hub-products/:id

**Qué hace:** Eliminar un item de stock.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Hubs

### GET /hubs

**Qué hace:** Listar centros de acopio con filtros dinámicos, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /hubs/:id

**Qué hace:** Obtener un centro de acopio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /hubs/user

**Qué hace:** Obtener centro de acopio asociado al usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /hubs

**Qué hace:** Crear un nuevo centro de acopio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateHubDto

- name: string — obligatorio (@Length(2, 150))
- legal_name: string — opcional (@Length(2, 150))
- ruc: string — opcional (@Length(5, 20))
- description: string — opcional (@IsString())
- phone: string — opcional (@Length(5, 20))
- email: string — opcional (@IsEmail())
- address_id: string — obligatorio (@IsUUID())
- website: string — opcional (@IsUrl())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hubs/disactive/:id

**Qué hace:** Dar de baja un centro de acopio y remover perfil HUB.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hubs/active/:id

**Qué hace:** Activar un centro de acopio y asignar perfil HUB.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /hubs/:id

**Qué hace:** Actualizar un centro de acopio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateHubDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /hubs/:id

**Qué hace:** Eliminar un centro de acopio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Init

### POST /database-init/load-general

**Qué hace:** Crear carga de datos iniciar y parcial.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /database-init/load-superadmin-and-roles

**Qué hace:** Crear usuario SuperAdmin y todos los roles.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /database-init/update-all-stock

**Qué hace:** Actualizar stock global manualmente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `quantity`: (opcional)
- `secret`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /database-init/update-transaction-ux

**Qué hace:** Actualizar iconos y colores de transacciones.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /database-init/quemar-becoin-manual

**Qué hace:** Quema 4000 becoin a Richard Gomez.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## InventoryItems

### GET /inventory-items

**Qué hace:** Listar items de inventario con paginación y filtrado por producto.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `product_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /inventory-items/:id

**Qué hace:** Obtener un item de inventario por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /inventory-items

**Qué hace:** Crear un nuevo item de inventario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateInventoryItemDto

- product_id: string — obligatorio (@IsUUID())
- quantity_available: number — obligatorio (@IsNumber())
- offer_label: string — opcional (@IsString())
- required: false — obligatorio 
- promotion_expires_at: Date — opcional 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /inventory-items/:id

**Qué hace:** Actualizar un item de inventario existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateInventoryItemDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /inventory-items/:id

**Qué hace:** Eliminar un item de inventario por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Merchants

### GET /merchants

**Qué hace:** Listar comercios con filtros dinámicos, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /merchants/user/:user_id

**Qué hace:** Obtener comercio asociado a un usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /merchants/:id

**Qué hace:** Obtener un comercio por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /merchants

**Qué hace:** Crear un nuevo comercio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateMerchantDto

- name: string — obligatorio (@Length(2, 150))
- legal_name: string — opcional (@Length(2, 150))
- ruc: string — opcional (@Length(5, 20))
- description: string — opcional (@IsString())
- phone: string — opcional (@Length(5, 20))
- email: string — opcional (@IsEmail())
- address_id: string — obligatorio (@IsUUID())
- logo_url: string — opcional (@IsUrl())
- website: string — opcional (@IsUrl())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /merchants/activate/:id

**Qué hace:** Activar comercio y asignar perfil MERCHANT.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /merchants/disactive/:id

**Qué hace:** Desactivar comercio y remover perfil MERCHANT.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /merchants/:id

**Qué hace:** Actualizar un comercio existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateMerchantDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /merchants/:id

**Qué hace:** Eliminar un comercio por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## OrderItems

### GET /order-items

**Qué hace:** Listar items de Ordenes con paginación y filtrado por orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `order_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /order-items/:id

**Qué hace:** Obtener un item de Orden por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /order-items/consumption

**Qué hace:** Registrar consumo de productos en una orden grupal.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
MarkConsumedDto

- order_item_ids: string[] — obligatorio (@IsUUID('4', { each: true }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /order-items

**Qué hace:** Crear un nuevo item de Orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateOrderItemDto

- order_id: string — obligatorio (@IsUUID())
- product_id: string — obligatorio (@IsUUID())
- quantity: number — obligatorio (@IsNumber())
- unit_price: number — obligatorio (@IsNumber())
- total_price: number — obligatorio (@IsNumber())
- unit_becoin: number — obligatorio (@IsNumber())
- total_becoin: number — obligatorio (@IsNumber())
- delivery_at: Date — obligatorio (@IsNumber())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /order-items/devolution/:id

**Qué hace:** Devolucion de un producto de una Orden existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `returned_quantity`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /order-items/:id

**Qué hace:** Actualizar un item de Orden existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateOrderItemDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /order-items/:id

**Qué hace:** Eliminar un item de Orden por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Orders

### GET /orders

**Qué hace:** Listar ordenes con paginación y filtrado .

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /orders/pending

**Qué hace:** Listar ordenes con paginación y filtrado por estado .

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /orders/user

**Qué hace:** Listar ordenes con paginación y filtrado por usuario registrado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /orders/:id

**Qué hace:** Obtener una orden por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /orders/returns/:id

**Qué hace:** Registrar devoluciones y recalcular pagos de la orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
Ninguno

**Body:**
RegisterReturnsDto

- type: [OrderItemReturnDto] — obligatorio 
- example: [ — obligatorio 
- returned_quantity: 1 — obligatorio 
- returned_quantity: 0 — obligatorio 
- each: true — obligatorio 
- returns: OrderItemReturnDto[] — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /orders/refunded-returns/:id

**Qué hace:** Registrar devoluciones y recalcular pagos de la orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `id`: string/UUID

**Query Params:**
- `is_split`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/preparing

**Qué hace:** Cambiar el estado de la orden a En Preparacion.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/on-route

**Qué hace:** Cambiar el estado de la orden a En Camino.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/delivered

**Qué hace:** Confirma Entrega de la orden por admin.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `code`: (opcional)
- `weight`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/collected

**Qué hace:** Cambiar el estado de la orden a Recolectado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/recycled

**Qué hace:** Registra el peso de la cantidad reciclada de una orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `code`: (opcional)
- `weight`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /orders/cancelled

**Qué hace:** Cancelacion de la orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `observation`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /orders/cart

**Qué hace:** Crear una nueva orden desde un carrito.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## PaymentTypes

### GET /payment-types

**Qué hace:** Listar formas de pagos.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-types/services

**Qué hace:** Listar formas de pagos para servicios.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-types/:id

**Qué hace:** Obtener una forma de pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payment-types

**Qué hace:** Crear una nueva forma de pago.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePaymentTypeDto

- code: string — obligatorio (@MaxLength(50))
- description: string — obligatorio (@MaxLength(255))
- is_active: boolean — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /payment-types/:id

**Qué hace:** Actualizar una forma de pago existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePaymentTypeDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /payment-types/:id

**Qué hace:** Eliminar una forma de pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Payments

### GET /payments

**Qué hace:** Listar pagos con paginación y filtro exclusivo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `order_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payments/order/:order_id

**Qué hace:** Listar pagos con paginación y filtro exclusivo de una orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
- `order_id`: string/UUID

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `uncompleted`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payments/:id

**Qué hace:** Obtener un pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payments/pay-now/:payment_id

**Qué hace:** Crear un nuevo pago.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payments/payphone/:payment_id

**Qué hace:** Realizar pago de orden mediante Payphone.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
PayphoneOrderDto

- paymentReferenceId: string — obligatorio (@IsString())
- referenceCode: string — opcional (@IsString())
- userGiftCardId: string — opcional (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payments/transfer/:payment_id

**Qué hace:** Realizar pago de orden mediante Transferencia Bancaria.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
TransferOrderDto

- paymentReferenceId: string — obligatorio (@IsString())
- referenceCode: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payments

**Qué hace:** Crear un nuevo pago.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePaymentDto

- order_id: string — obligatorio (@IsUUID())
- user_id: string — obligatorio (@IsUUID())
- amount_paid: number — obligatorio (@IsNumber())
- payment_type_id: string — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /payments/:id

**Qué hace:** Actualizar un pago existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePaymentDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /payments/:id

**Qué hace:** Eliminar un pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## PayoutAccount

### GET /payment-account

**Qué hace:** Listar cuantas de pago con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-account/user

**Qué hace:** Listar cuantas de pago del usuario logueado con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-account/at-recharge

**Qué hace:** Listar cuantas de pago para recarga de saldo con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-account/user-active

**Qué hace:** Listar cuantas activas de pago del usuario logueado con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /payment-account/:id

**Qué hace:** Obtener una cuenta de pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /payment-account

**Qué hace:** Crear una nueva cuenta de pago.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePaymentAccountDto

- name: string — obligatorio (@Length(1, 100))
- accountHolder: string — obligatorio (@Length(1, 150))
- bank: string — obligatorio (@Length(1, 50))
- email: string — opcional (@IsEmail())
- is_active: boolean — opcional (@IsBoolean())
- ruc: string — opcional (@IsString())
- nro_account: string — opcional (@IsString())
- cbu: string — opcional (@Length(22, 22))
- alias: string — opcional (@Length(3, 50))
- type_account: TypeAccountEnum — obligatorio (@IsEnum(TypeAccountEnum))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /payment-account/activate/:id

**Qué hace:** Actualizar una cuenta de pago existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /payment-account/deactivate/:id

**Qué hace:** Actualizar una cuenta de pago existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /payment-account/:id

**Qué hace:** Actualizar una cuenta de pago existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePaymentAccountDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /payment-account/:id

**Qué hace:** Eliminar una cuenta de pago por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## PresetAmount

### GET /preset-amount

**Qué hace:** Listar montos preestablecidos con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /preset-amount/:id

**Qué hace:** Obtener un monto preestablecido por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /preset-amount

**Qué hace:** Crear un nuevo monto preestablecido.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePresetAmountDto

- name: string — obligatorio (@MaxLength(50, { message: 'El nombre no puede superar 50 caracteres' }))
- amount: number — obligatorio (@Min(0, { message: 'El monto debe ser mayor o igual a 0' }))
- message: string — opcional (@MaxLength(255, { message: 'El mensaje no puede superar 255 caracteres' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /preset-amount/:id

**Qué hace:** Actualizar un monto preestablecido existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePresetAmountDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /preset-amount/:id

**Qué hace:** Eliminar una monto preestablecido por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## PrizeRedemptions

### GET /prize-redemptions

**Qué hace:** Listar canjes de premios con paginación y filtro exclusivo.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `user_id`: (opcional)
- `prize_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /prize-redemptions/:id

**Qué hace:** Obtener un canje de premio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /prize-redemptions

**Qué hace:** Crear un nuevo canje de premio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePrizeRedemptionDto

- user_id: string — obligatorio (@IsUUID())
- prize_id: string — obligatorio (@IsUUID())
- enum: [ — obligatorio 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /prize-redemptions/:id

**Qué hace:** Actualizar un canje de premio existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePrizeRedemptionDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /prize-redemptions/:id

**Qué hace:** Eliminar un canje de premio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Prizes

### GET /prizes

**Qué hace:** Listar premios con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /prizes/:id

**Qué hace:** Obtener un premio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /prizes

**Qué hace:** Crear un nuevo premio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreatePrizeDto

- name: string — obligatorio (@IsString())
- description: string — obligatorio (@IsString())
- cost: number — obligatorio (@IsNumber())
- image_url: string — obligatorio (@IsString())
- stock: number — obligatorio (@IsNumber())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /prizes/:id

**Qué hace:** Actualizar un premio existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdatePrizeDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /prizes/:id

**Qué hace:** Eliminar un premio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Products

### POST /products

**Qué hace:** Crear un nuevo producto (solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateProductDto

- name: string — obligatorio (@IsNotEmpty())
- description: string — opcional (@IsString())
- codbar: string — opcional (@IsString())
- weight: number — opcional (@IsOptional())
- cost: number — obligatorio (@IsNumber())
- quantity: number — obligatorio (@IsNumber())
- is_circular: boolean — obligatorio (@IsNotEmpty())
- price: number — obligatorio (@IsNumber())
- image_url: string — opcional (@IsString())
- category_id: string — opcional (@IsUUID())
- groupTypeIds: string[] — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Product`. Status esperado: 200/201 (si exitoso).

---

### POST /products/group-types/:id

**Qué hace:** Asociar tipos de grupo a un producto (solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
AddGroupTypesDto

- name: string — obligatorio (@IsNotEmpty())
- description: string — opcional (@IsString())
- codbar: string — opcional (@IsString())
- weight: number — opcional (@IsOptional())
- cost: number — obligatorio (@IsNumber())
- quantity: number — obligatorio (@IsNumber())
- is_circular: boolean — obligatorio (@IsNotEmpty())
- price: number — obligatorio (@IsNumber())
- image_url: string — opcional (@IsString())
- category_id: string — opcional (@IsUUID())
- groupTypeIds: string[] — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Product`. Status esperado: 200/201 (si exitoso).

---

### PATCH /products/:id

**Qué hace:** Actualizar un producto por ID (solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateProductDto

- name: string — opcional (@MaxLength(70, { message: 'El nombre no puede tener más de 70 caracteres' }))
- description: string — opcional (@MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  }))
- price: number — opcional (@Min(0, { message: 'El precio debe ser mayor o igual a cero' }))
- image_url: string — opcional (@IsString())
- category: string — opcional (@MaxLength(30, {
    message: 'La categoría no puede tener más de 30 caracteres',
  }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Product`. Status esperado: 200/201 (si exitoso).

---

### DELETE /products/:id

**Qué hace:** Eliminar un producto por ID (solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /products/hard-delete/all

**Qué hace:** Eliminar todos los productos de forma permanente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /products/soft-deleted

**Qué hace:** Obtener la lista de productos eliminados lógicamente (soft-delete).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /products

**Qué hace:** Listar productos con paginación, ordenamiento y filtrado (accesible públicamente).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /products/:id

**Qué hace:** Obtener un producto por ID (accesible públicamente).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `Product`. Status esperado: 200/201 (si exitoso).

---

## RecycledItems

### GET /recycled-items

**Qué hace:** Listar productos reciclados con paginación y filtro exclusivo para superadmin.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `user_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /recycled-items/user

**Qué hace:** Listar productos reciclados con paginación y filtro exclusivo para el usuario que llama.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /recycled-items/:id

**Qué hace:** Obtener un producto reciclado por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /recycled-items

**Qué hace:** Crear un nuevo producto reciclado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateRecycledItemDto

- weight: number — obligatorio (@IsNumber())
- user_id: string — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /recycled-items/:id

**Qué hace:** Actualizar un producto reciclado existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateRecycledItemDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /recycled-items/:id

**Qué hace:** Eliminar un producto reciclado por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Recyclers

### GET /recyclers

**Qué hace:** Listar recicladores de base con filtros, paginación y orden.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /recyclers/user

**Qué hace:** Obtener reciclador de base asociado a un usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /recyclers/:id

**Qué hace:** Obtener un reciclador de base por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /recyclers

**Qué hace:** Crear un nuevo reciclador de base.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateRecyclerBaseDto

- minLength: 5 — obligatorio 
- maxLength: 20 — obligatorio 
- national_id: string — obligatorio (@Length(5, 20))
- belongs_to_association: boolean — opcional (@IsBoolean())
- association_name: string — opcional (@Length(2, 150))
- has_collection_center: boolean — opcional (@IsBoolean())
- has_mobility: boolean — opcional (@IsBoolean())
- mobility_description: string — opcional (@Length(2, 100))
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /recyclers/activate/:id

**Qué hace:** Activar reciclador de base y asignar perfil RECYCLER_BASE.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /recyclers/disactive/:id

**Qué hace:** Desactivar reciclador de base y remover perfil RECYCLER_BASE.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /recyclers/:id

**Qué hace:** Actualizar un reciclador de base existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateRecyclerBaseDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /recyclers/:id

**Qué hace:** Eliminar un reciclador de base por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Roles

### POST /roles

**Qué hace:** Crear un nuevo rol (Solo Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateRoleDto

- name: ValidRoleNames — obligatorio (@IsEnum(RoleEnum))
- description: string — opcional (@IsString())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `RoleDto`. Status esperado: 200/201 (si exitoso).

---

### GET /roles

**Qué hace:** Obtener todos los roles (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /roles/:id

**Qué hace:** Obtener un rol por ID (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `RoleDto`. Status esperado: 200/201 (si exitoso).

---

### GET /roles/:id/users

**Qué hace:** Obtener usuarios por ID de rol (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /roles/:id

**Qué hace:** Actualizar un rol por ID (Solo Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateRoleDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `RoleDto`. Status esperado: 200/201 (si exitoso).

---

### DELETE /roles/:id

**Qué hace:** Eliminar un rol por ID (Solo Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Services

### GET /services

**Qué hace:** Listado de servicios con paginación y filtrado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /services/:id

**Qué hace:** Obtener servicio por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /services

**Qué hace:** Ejecuta la operación create.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateServiceDto

- name: string — obligatorio (@MaxLength(150))
- description: string — opcional (@MaxLength(500))
- cost: number — opcional (@Min(0))
- day_limit_cancelled: number — opcional (@Min(0))
- porcent_cancelled: number — opcional (@Max(100))
- price: number — opcional (@Min(0))
- image_url: any — opcional (@IsOptional())
- is_available: boolean — opcional (@IsBoolean())
- is_active: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/update-image/:id

**Qué hace:** Actualizar imagen del servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/active/:id

**Qué hace:** Activar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/disactive/:id

**Qué hace:** Desactivar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/enable/:id

**Qué hace:** Habilitar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/disable/:id

**Qué hace:** Deshabilitar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /services/:id

**Qué hace:** Actualizar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateServiceDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /services/:id

**Qué hace:** Eliminar servicio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## StripeTopups

### POST /stripe-topups/create-intent

**Qué hace:** Crea un PaymentIntent de Stripe para recargar la wallet del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateStripeTopupDto

- example: 25 — obligatorio 
- amountUsd: number — obligatorio (@Max(10000))
- owner: OwnerTopupEnum — obligatorio (@IsNotEmpty())
- owner_id: string — opcional (@IsUUID())
- recipient_wallet_id: string — opcional (@IsUUID())
- user_gift_card_id: string — opcional (@IsUUID())
- holder_name: string — opcional (@IsString())
- holder_instagram_tiktok: string — opcional (@IsString())
- holder_phone: string — opcional (@IsString())
- holder_email: string — opcional (@IsEmail())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `StripeTopupResponseDto`. Status esperado: 200/201 (si exitoso).

---

### GET /stripe-topups/:id/status

**Qué hace:** Consulta el estado de una recarga Stripe del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `StripeTopupStatusDto`. Status esperado: 200/201 (si exitoso).

---

### POST /webhooks/stripe

**Qué hace:** Webhook de Stripe para confirmar o fallar recargas de wallet.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Testimonies

### POST /testimonies

**Qué hace:** Crea un nuevo testimonio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateTestimonyDto

- minLength: 10 — obligatorio 
- maxLength: 500 — obligatorio 
- content: string — obligatorio 
- nullable: true — obligatorio 
- rating: number — opcional (@Max(5, { message: 'La calificación máxima es 5.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `TestimonyDto`. Status esperado: 200/201 (si exitoso).

---

### GET /testimonies

**Qué hace:** Obtiene todos los testimonios.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /testimonies/:id

**Qué hace:** Obtiene un testimonio por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `TestimonyDto`. Status esperado: 200/201 (si exitoso).

---

### PATCH /testimonies/:id

**Qué hace:** Actualiza un testimonio por su ID (solo autor o ADMIN/SUPERADMIN).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateTestimonyDto

- is_approved: boolean — opcional (@IsBoolean({ message: 'is_approved debe ser un valor booleano.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `TestimonyDto`. Status esperado: 200/201 (si exitoso).

---

### PATCH /testimonies/:id/approve

**Qué hace:** Aprueba un testimonio (solo ADMIN/SUPERADMIN).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `TestimonyDto`. Status esperado: 200/201 (si exitoso).

---

### DELETE /testimonies/:id

**Qué hace:** Realiza un soft delete de un testimonio (solo autor o ADMIN/SUPERADMIN).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /testimonies/:id/hard

**Qué hace:** ELIMINA PERMANENTEMENTE un testimonio por ID (solo SUPERADMIN).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## TransactionState

### GET /transaction-state

**Qué hace:** Listar estados de transacciones con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /transaction-state/:id

**Qué hace:** Obtener un estado de transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /transaction-state

**Qué hace:** Crear un nuevo estado de transacción.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateTransactionStateDto

- ejemplo: PENDING — obligatorio 
- minLength: 2 — obligatorio 
- maxLength: 100 — obligatorio 
- code: string — obligatorio (@Length(2, 100))
- name: string — obligatorio (@Length(2, 100))
- description: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /transaction-state/:id

**Qué hace:** Actualizar un estado de transacción existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateTransactionStateDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /transaction-state/:id

**Qué hace:** Eliminar un estado de transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## TransactionType

### GET /transaction-type

**Qué hace:** Listar tipos de transacciones de transacciones con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /transaction-type/:id

**Qué hace:** Obtener un tipo de transacción de transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /transaction-type

**Qué hace:** Crear un nuevo tipo de transacción.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateTransactionTypeDto

- ejemplo: RECHARGE — obligatorio 
- minLength: 2 — obligatorio 
- maxLength: 100 — obligatorio 
- code: string — obligatorio (@Length(2, 100))
- name: string — obligatorio (@Length(2, 100))
- description: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /transaction-type/:id

**Qué hace:** Actualizar un tipo de transacción existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateTransactionTypeDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /transaction-type/:id

**Qué hace:** Eliminar un tipo de transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Transactions

### GET /transactions

**Qué hace:** Listar transacciones con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `wallet_id`: (opcional)
- `state_id`: (opcional)
- `type_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /transactions/recent-recipients

**Qué hace:** lista de los ultimos contactos a los que se transfirio.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /transactions/:id

**Qué hace:** Obtener una transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /transactions

**Qué hace:** Crear una nueva transacción.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateTransactionDto

- wallet_id: string — obligatorio (@IsUUID())
- type_id: string — obligatorio (@IsUUID())
- example: 150 — obligatorio 
- amount: number — obligatorio (@IsNumber({ maxDecimalPlaces: 2 }))
- payohone_transactionId: string — opcional (@IsUUID())
- related_wallet_id: string — opcional (@IsUUID())
- reference: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /transactions/:id

**Qué hace:** Actualizar una transacción existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateTransactionDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /transactions/:id

**Qué hace:** Eliminar una transacción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserAddress

### GET /user-address

**Qué hace:** Listar direcciones con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-address/:id

**Qué hace:** Obtener una dirección por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-address

**Qué hace:** Crear una nueva dirección.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateUserAddressDto

- addressLine1: string — obligatorio (@MaxLength(150))
- addressLine2: string — opcional (@MaxLength(150))
- city: string — obligatorio (@MaxLength(100))
- state: string — opcional (@MaxLength(100))
- country: string — obligatorio (@MaxLength(100))
- postalCode: string — opcional (@MaxLength(20))
- latitude: number — opcional (@IsLatitude())
- longitude: number — opcional (@IsLongitude())
- example: true — obligatorio 
- default: false — obligatorio 
- isDefault: boolean — opcional (@IsBoolean())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-address/default-address/:id

**Qué hace:** Actualizar una dirección poniendola como Default.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-address/:id

**Qué hace:** Actualizar una dirección existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateUserAddressDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /user-address/:id

**Qué hace:** Eliminar una dirección por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserCards

### GET /user-cards

**Qué hace:** Listar tarjetas con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-cards/:id

**Qué hace:** Obtener una tarjeta por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-cards/data-payment/:card_id

**Qué hace:** Obtener los datos de Tarjeta para Comprar en un click.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-cards

**Qué hace:** Crear una nueva tarjeta.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateUserCardDto

- user_id: string — obligatorio (@IsUUID())
- email: string — obligatorio (@IsEmail())
- phoneNumber: string — obligatorio (@IsString())
- documentId: string — obligatorio (@IsString())
- optionalParameter4: string — obligatorio (@IsString())
- cardBrand: string — obligatorio (@IsString())
- lastDigits: number — obligatorio (@IsNumber())
- cardToken: string — obligatorio (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-cards/:id

**Qué hace:** Actualizar una tarjeta existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateUserCardDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /user-cards/:id

**Qué hace:** Eliminar una tarjeta por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserEventPass

### GET /user-event-passes

**Qué hace:** Listado global con paginación y filtros.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-event-passes/user

**Qué hace:** Listado de entradas del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-event-passes/:id

**Qué hace:** Obtener entrada por ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-event-passes/purchase

**Qué hace:** Comprar un EventPass.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateUserEventPassDto

- event_pass_id: string — obligatorio (@IsNotEmpty())
- holder_name: string — obligatorio (@IsNotEmpty())
- holder_instagram_tiktok: string — obligatorio (@IsNotEmpty())
- holder_phone: string — opcional (@IsOptional())
- holder_email: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-event-passes/purchase-recharge

**Qué hace:** Comprar un EventPass con recarga de saldo payphone.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
PurchaseWhitRechargeDto

- event_pass_id: string — obligatorio (@IsNotEmpty())
- holder_name: string — obligatorio (@IsNotEmpty())
- holder_instagram_tiktok: string — obligatorio (@IsNotEmpty())
- holder_phone: string — opcional (@IsOptional())
- holder_email: string — opcional (@IsOptional())
- example: 50 — obligatorio 
- amountUsd: number — obligatorio 
- referenceCode: string — obligatorio (@IsString())
- payphone_transactionId: number — obligatorio (@IsNumber())
- clientTransactionId: string — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-event-passes/purchase-transfer

**Qué hace:** Comprar un EventPass con Transferencia Bancaria.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
TransferEventPassDto

- event_pass_id: string — obligatorio (@IsNotEmpty())
- holder_name: string — obligatorio (@IsNotEmpty())
- holder_instagram_tiktok: string — obligatorio (@IsNotEmpty())
- holder_phone: string — opcional (@IsOptional())
- holder_email: string — opcional (@IsOptional())
- referenceCode: string — opcional (@IsOptional())
- transferReferenceId: string — obligatorio (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-event-passes/refund/:id

**Qué hace:** Solicitar reembolso de un EventPass.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-event-passes/consume

**Qué hace:** Marcar entrada como consumida.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `user_eventpass_id`: (opcional)
- `eventpass_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserFeedback

### GET /user-feedback/user

**Qué hace:** Listar feedbacks con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-feedback/feedback-review

**Qué hace:** Listar feedbacks con filtros y paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `user_id`: (opcional)
- `section`: (opcional)
- `rating`: (opcional)
- `platform`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-feedback/:id

**Qué hace:** Obtener un feedbacks por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-feedback

**Qué hace:** Crear un nuevo feedbacks.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateUserFeedbackDto

- user_id: string — obligatorio (@IsUUID())
- example: 5 — obligatorio 
- minimum: 1 — obligatorio 
- maximum: 5 — obligatorio 
- rating: number — obligatorio (@Max(5))
- comment: string — opcional (@IsString())
- section: SectionCode — opcional (@IsEnum(SectionCode))
- platform: string — opcional (@Length(1, 50))
- app_version: string — opcional (@Length(1, 50))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-feedback/:id

**Qué hace:** Actualizar un feedbacks existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateUserFeedbackDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /user-feedback/:id

**Qué hace:** Eliminar un feedbacks por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserRecharge

### GET /user-recharge

**Qué hace:** Listar recargas de usuario con paginación y filtrado por estado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `status_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-recharge/:id

**Qué hace:** Obtener una recarga de usuario por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-recharge

**Qué hace:** Crear una nueva recarga de usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateRechargeTransferDto

- payment_account_id: string — obligatorio (@IsNotEmpty())
- amount_usd: number — obligatorio (@IsPositive({ message: 'El monto debe ser mayor que 0' }))
- transfer_id: string — obligatorio (@Length(1, 100))
- ticket_image_url: string — obligatorio (@IsNotEmpty())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-recharge/completed/:id

**Qué hace:** Actualizar una recarga de usuario existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /user-recharge/failed/:id

**Qué hace:** Actualizar una recarga de usuario existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /user-recharge/:id

**Qué hace:** Eliminar una recarga de usuario por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## UserWithdraw

### GET /user-withdraw

**Qué hace:** Listar retiros con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `status_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-withdraw/user

**Qué hace:** Listar retiros con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `status_id`: (opcional)
- `account_id`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /user-withdraw/:id

**Qué hace:** Obtener una extracción por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-withdraw/withdraw

**Qué hace:** Crear una Solicitud de Retiro.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
WithdrawDto

- amount_usd: number — obligatorio (@IsNumber())
- withdraw_account_id: string — obligatorio (@IsUUID())
- user_withdraw_id: string — obligatorio (@IsUUID())
- observation: string — opcional (@IsOptional())
- reference: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-withdraw/withdraw-failed

**Qué hace:** Completa el Flujo de retiro para una transaccion fallida en la cuenta del usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
WithdrawResponseDto

- amount_usd: number — obligatorio (@IsNumber())
- withdraw_account_id: string — obligatorio (@IsUUID())
- user_withdraw_id: string — obligatorio (@IsUUID())
- observation: string — opcional (@IsOptional())
- reference: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /user-withdraw/withdraw-completed

**Qué hace:** Completa el Flujo de retiro para una transaccion exitosa en la cuenta del usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
WithdrawResponseDto

- amount_usd: number — obligatorio (@IsNumber())
- withdraw_account_id: string — obligatorio (@IsUUID())
- user_withdraw_id: string — obligatorio (@IsUUID())
- observation: string — opcional (@IsOptional())
- reference: string — opcional (@IsOptional())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## Users

### POST /users/auth0-login

**Qué hace:** Login o registro de usuario a través de Auth0 (público).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Auth0LoginDto

- required: false — obligatorio 
- nullable: true — obligatorio 
- auth0_id: string — opcional (@IsNotEmpty({ message: 'auth0_id no debe estar vacío si se proporciona.' }))
- required: true — obligatorio 
- email: string — obligatorio (@IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' }))
- required: false — obligatorio 
- nullable: true — obligatorio 
- full_name: string — opcional (@IsString({ message: 'full_name debe ser una cadena de texto.' }))
- required: false — obligatorio 
- nullable: true — obligatorio 
- profile_picture_url: string — opcional (@IsString({ message: 'profile_picture_url debe ser una cadena de texto.' }))
- required: false — obligatorio 
- nullable: true — obligatorio 
- oauth_provider: string — opcional (@IsString({ message: 'oauth_provider debe ser una cadena de texto.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /users

**Qué hace:** Registrar un nuevo usuario (público).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateUserDto

- required: false — obligatorio 
- oauth_provider: string — opcional (@IsString())
- email: string — obligatorio (@IsNotEmpty())
- required: false — obligatorio 
- username: string — opcional (@IsString())
- full_name: string — opcional (@IsString())
- profile_picture_url: string — opcional (@IsString())
- password: string — obligatorio (@IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
    },
  ))
- confirmPassword: string — obligatorio (@IsString())
- address: string — obligatorio (@MaxLength(80))
- phone: string — obligatorio (@IsString())
- country: string — obligatorio (@MaxLength(50))
- city: string — obligatorio (@MaxLength(50))
- example: false — obligatorio 
- required: false — obligatorio 
- is_admin_seeder: boolean — opcional (@IsBoolean())
- required: false — obligatorio 
- nullable: true — obligatorio 
- auth0_id: string — opcional (@IsString())
- role_name: ValidRoleNames — opcional (@IsEnum(RoleEnum))
- isBlocked: boolean — opcional (@IsBoolean())
- 01T00: 00 — obligatorio 
- nullable: true — obligatorio 
- required: false — obligatorio 
- deleted_at: Date — opcional (@IsDate())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### GET /users/user-event-beland

**Qué hace:** Ejecuta la operación getUsersEventBeland.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /users/me

**Qué hace:** Obtener información del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/me

**Qué hace:** Actualizar información del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateUserDto

- role: ValidRoleNames — opcional (@IsEnum(RoleEnum))
- isBlocked: boolean — opcional (@IsBoolean())
- 01T00: 00 — obligatorio 
- required: false — obligatorio 
- nullable: true — obligatorio 
- deleted_at: Date — opcional (@IsDate())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### GET /users/by-email

**Qué hace:** Buscar usuario por dirección de email (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `email`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### GET /users

**Qué hace:** Obtener lista de usuarios con paginación, filtrado y ordenación (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /users/deactivated

**Qué hace:** Obtener usuarios desactivados (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /users/:id

**Qué hace:** Obtener un usuario por ID (Propietario o Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### PUT /users/imgProfile/:id

**Qué hace:** Subir imagen de perfil de usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/changeRoleToCommerce

**Qué hace:** Endpoint obsoleto.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/change-role

**Qué hace:** Cambia el rol del usuario al que se pase por parametro.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `role_name`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/change-password

**Qué hace:** Cambiar la contraseña del usuario autenticado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
ChangePasswordUserDto

- currentPassword: string — obligatorio (@IsNotEmpty({ message: 'La contraseña actual es obligatoria.' }))
- newPassword: string — obligatorio 
- confirmPassword: string — obligatorio (@IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria.' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/:id

**Qué hace:** Actualizar un usuario por ID (Solo para Admins/Superadmins).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateUserDto

- role: ValidRoleNames — opcional (@IsEnum(RoleEnum))
- isBlocked: boolean — opcional (@IsBoolean())
- 01T00: 00 — obligatorio 
- required: false — obligatorio 
- nullable: true — obligatorio 
- deleted_at: Date — opcional (@IsDate())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### DELETE /users/finally/:id

**Qué hace:** Elimina definitivamente Solo Superadmin.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /users/:id

**Qué hace:** Desactivar (soft-delete) un usuario por ID (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/:id/reactivate

**Qué hace:** Reactivar un usuario por ID (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

### PATCH /users/:id/block-status

**Qué hace:** Bloquear o desbloquear un usuario por ID (Solo Admin/Superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'ADMIN', 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
BlockUserDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `UserDto`. Status esperado: 200/201 (si exitoso).

---

## Wallets

### GET /wallets

**Qué hace:** Listar billeteras Virtuales con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /wallets/user

**Qué hace:** Obtener una billetera por su Usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /wallets/qr

**Qué hace:** Obtener una billetera por su Usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /wallets/alias/:alias

**Qué hace:** Obtener una billetera por su Alias.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `alias`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /wallets/data-Payment/:wallet_id

**Qué hace:** Obtener información para generar el pago.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
- `wallet_id`: string/UUID

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /wallets/:id

**Qué hace:** Obtener una billetera por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets

**Qué hace:** Crear una nueva billetera.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateWalletDto

- address: string — opcional (@IsString())
- alias: string — opcional (@IsString())
- qr: string — opcional (@IsString())
- private_key_encrypted: string — opcional (@IsString())
- userId: string — obligatorio (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /wallets/alias-qr

**Qué hace:** Genera alias y qr si no lo tiene.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /wallets/alias/:id

**Qué hace:** Actualiza el alias por uno personalizado.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
- `alias`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /wallets/admin/fix-missing-qr

**Qué hace:** Generar QR faltantes en todas las wallets (solo superadmin).

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /wallets/:id

**Qué hace:** Actualizar una billetera existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateWalletDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /wallets/:id

**Qué hace:** Eliminar una billetera por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/recharge

**Qué hace:** Crear una nueva recarga o compra de Beicon.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
RechargeDto

- walletId: string — opcional (@IsUUID())
- example: 50 — obligatorio 
- amountUsd: number — obligatorio 
- referenceCode: string — obligatorio (@IsString())
- paymentProvider: PaymentProviderEnum — obligatorio (@IsEnum(PaymentProviderEnum))
- paymentReferenceId: string — obligatorio (@IsString())
- walletId: string — obligatorio 
- amountUsd: number — obligatorio 
- usdBalance: number — obligatorio 
- becoinOrangeBalance: number — obligatorio 
- rechargeTransactionId: string — obligatorio 
- orangeTransactionId: string — opcional 

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/transfer

**Qué hace:** Crear una nueva transferencia.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
TransferDto

- toWalletId: string — obligatorio (@IsUUID())
- amountUsd: number — obligatorio (@IsNumber())
- amount_payment_id: string — opcional (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/purchase-becoin

**Qué hace:** Crear una nueva compra a una entidad con becoin.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
TransferDto

- toWalletId: string — obligatorio (@IsUUID())
- amountUsd: number — obligatorio (@IsNumber())
- amount_payment_id: string — opcional (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/purchase-recharge/:to_wallet_id

**Qué hace:** Crear una nueva compra a una entidad.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
PaymentWithRechargeDto

- amountUsd: number — obligatorio (@IsNotEmpty())
- referenceCode: string — obligatorio (@IsString())
- paymentReferenceId: string — obligatorio (@IsNumber())
- wallet_id: string — obligatorio (@IsUUID())
- amount_payment_id: string — opcional (@IsUUID())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/purchase-giftcard

**Qué hace:** Comprar una Gift Card mediante Payphone.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
PurchaseGiftCardDto

- giftCardId: string — obligatorio (@IsUUID())
- recipientWalletId: string — obligatorio (@IsUUID())
- paymentReferenceId: string — obligatorio (@IsString())
- referenceCode: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /wallets/purchase-giftcard/transfer

**Qué hace:** Comprar una Gift Card mediante Transferencia Bancaria.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** 'SUPERADMIN'

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
TransferGiftCardDto

- giftCardId: string — obligatorio (@IsUUID())
- recipientWalletId: string — obligatorio (@IsUUID())
- paymentReferenceId: string — obligatorio (@IsString())
- referenceCode: string — opcional (@IsString())

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## WithdrawAccount

### GET /withdraw-account

**Qué hace:** Listar cuentas de retiro con paginación y filtrado por usuario.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)
- `is_active`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /withdraw-account/enums

**Qué hace:** Retorna los enums para las opciones de las cuentas.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /withdraw-account/:id

**Qué hace:** Obtener una cuenta de retiro por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /withdraw-account

**Qué hace:** Crear una nueva cuenta de retiro.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateWithdrawAccountDto

- country: CountryEnum — obligatorio (@IsEnum(CountryEnum))
- currency: Currency — obligatorio (@IsEnum(Currency))
- bankName: string — obligatorio (@Length(1, 150))
- withdraw_account_type_id: string — obligatorio (@IsUUID())
- accountNumber: string — opcional (@Length(4, 34))
- cbu: string — opcional (@Length(22, 22))
- alias: string — opcional (@Length(3, 50))
- holderName: string — obligatorio (@Length(3, 150))
- holderDocument: string — obligatorio (@Length(5, 30))
- holderDocumentType: HolderDocumentType — obligatorio (@IsEnum(HolderDocumentType))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /withdraw-account/active/:id

**Qué hace:** Activa una cuenta desactivada.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /withdraw-account/disactive/:id

**Qué hace:** Desactiva una cuenta existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /withdraw-account/:id

**Qué hace:** Actualizar una cuenta de retiro existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateWithdrawAccountDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /withdraw-account/:id

**Qué hace:** Eliminar una cuenta de retiro por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

## WithdrawAccountType

### GET /withdraw-account-type

**Qué hace:** Listar tipos de cuentas con paginación.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
- `page`: (opcional)
- `limit`: (opcional)

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### GET /withdraw-account-type/:id

**Qué hace:** Obtener un tipo de cuenta por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### POST /withdraw-account-type

**Qué hace:** Crear un nuevo tipo de cuenta.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
CreateWithdrawAccountTypeDto

- code: string — obligatorio (@MaxLength(50, { message: 'El código no puede superar 50 caracteres' }))
- name: string — obligatorio (@MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' }))

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### PUT /withdraw-account-type/:id

**Qué hace:** Actualizar un tipo de cuenta existente.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
UpdateWithdrawAccountTypeDto

(Estructura no detallada)

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

### DELETE /withdraw-account-type/:id

**Qué hace:** Eliminar un tipo de cuenta por su ID.

**Autenticación:** FlexibleAuthGuard (Opcional/JWT)

**Roles/Permisos:** Usuario autenticado (por defecto si hay JWT)

**Path Params:**
Ninguno

**Query Params:**
Ninguno

**Body:**
Ninguno

**Headers relevantes:**
Authorization: Bearer JWT

**Respuesta:**
Devuelve `No especificado (probablemente JSON con data)`. Status esperado: 200/201 (si exitoso).

---

