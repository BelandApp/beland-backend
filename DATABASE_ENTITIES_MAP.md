# Mapa de Entidades y Relaciones (TypeORM)

## 1. Entidades (Agrupadas por módulo)

### Módulo: WITHDRAW-ACCOUNT-TYPE

#### Entidad: `WithdrawAccountType`
- **Tabla:** `withdraw_account_types`
- **Archivo:** `src/modules/withdraw-account-type/entities/withdraw-account-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: WITHDRAW-ACCOUNT

#### Entidad: `WithdrawAccount`
- **Tabla:** `withdraw_accounts`
- **Archivo:** `src/modules/withdraw-account/entities/withdraw-account.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `country` | `enum` | `nullable`, enum |
| `currency` | `enum` | `nullable`, enum |
| `bankName` | `String` | `nullable` |
| `withdraw_account_type_id` | `uuid` | `nullable` |
| `accountNumber` | `String` | `nullable` |
| `cbu` | `String` | `nullable` |
| `alias` | `String` | `nullable` |
| `holderName` | `String` | `nullable` |
| `holderDocument` | `String` | `nullable` |
| `holderDocumentType` | `enum` | `nullable`, enum |
| `user_id` | `uuid` |  |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updatedAt` | `timestamptz` | `UpdateDateColumn` |

### Módulo: WALLETS

#### Entidad: `Wallet`
- **Tabla:** `wallets`
- **Archivo:** `src/modules/wallets/entities/wallet.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `address` | `text` | `nullable` |
| `alias` | `varchar` | `nullable` |
| `qr` | `text` | `nullable` |
| `usd_balance` | `numeric` | default: `0` |
| `locked_balance` | `numeric` | default: `0` |
| `becoin_balance` | `numeric` | default: `0` |
| `becoin_green` | `numeric` | `nullable`, default: `0` |
| `becoin_orange` | `numeric` | `nullable`, default: `0` |
| `private_key_encrypted` | `text` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `user_id` | `uuid` |  |
| `withdraw_account_id` | `uuid` | `nullable` |

**Índices:**
- Columnas: `alias` 

### Módulo: GROUP-MEMBERS

#### Entidad: `GroupMember`
- **Tabla:** `group_members`
- **Archivo:** `src/modules/group-members/entities/group-member.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `role` | `enum` | default: `MEMBER`, enum |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |
| `group_id` | `uuid` |  |
| `user_id` | `uuid` |  |
| `pending_amount_group` | `decimal` | `nullable`, default: `0` |
| `pending_amount_personal` | `decimal` | `nullable`, default: `0` |
| `pendingAmount` | `decimal` | `nullable`, default: `0` |
| `paied` | `boolean` | `nullable`, default: `false` |

#### Entidad: `Group`
- **Tabla:** `groups`
- **Archivo:** `src/modules/group-members/entities/group-member.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `description` | `varchar` | `nullable` |
| `image_url` | `varchar` | `nullable` |
| `message_invitation` | `text` | `nullable` |
| `user_address_id` | `uuid` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `is_delete` | `boolean` | default: `false` |
| `deleted_at` | `timestamptz` | `nullable` |
| `event_at` | `timestamptz` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |
| `user_id` | `uuid` |  |
| `group_type_id` | `uuid` | `nullable` |
| `privacy_id` | `uuid` | `nullable` |
| `payment_type_id` | `uuid` | `nullable` |
| `event_pass_id` | `uuid` | `nullable` |

### Módulo: CATEGORY

#### Entidad: `Category`
- **Tabla:** `categories`
- **Archivo:** `src/modules/category/entities/category.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `created_at` | `inferred` | `CreateDateColumn` |

### Módulo: GROUP-TYPE

#### Entidad: `GroupType`
- **Tabla:** `groups-type`
- **Archivo:** `src/modules/group-type/entities/group-type.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `image_url` | `varchar` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |

### Módulo: INVENTORY-ITEMS

#### Entidad: `InventoryItem`
- **Tabla:** `inventory_items`
- **Archivo:** `src/modules/inventory-items/entities/inventory-item.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `quantity_available` | `int` | default: `0` |
| `offer_label` | `text` | `nullable` |
| `promotion_expires_at` | `timestamptz` | `nullable` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |
| `product_id` | `uuid` |  |

### Módulo: PRODUCTS

#### Entidad: `Product`
- **Tabla:** `products`
- **Archivo:** `src/modules/products/entities/product.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `text` |  |
| `description` | `text` | `nullable` |
| `codbar` | `text` | `nullable` |
| `weight` | `numeric` | `nullable`, default: `0` |
| `cost` | `numeric` | default: `0` |
| `price` | `numeric` | default: `0` |
| `quantity` | `int` | `nullable`, default: `0` |
| `is_circular` | `boolean` | `nullable`, default: `false` |
| `image_url` | `text` | `nullable` |
| `category_id` | `uuid` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `deleted_at` | `timestamptz` | `nullable`, `DeleteDateColumn` |

### Módulo: ORDER-ITEMS

#### Entidad: `OrderItem`
- **Tabla:** `order_items`
- **Archivo:** `src/modules/order-items/entities/order-item-consumptions.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `ordered_quantity` | `integer` | `nullable` |
| `returned_quantity` | `integer` | `nullable`, default: `0` |
| `quantity` | `integer` |  |
| `unit_price` | `numeric` |  |
| `total_price` | `numeric` |  |
| `unit_weight` | `numeric` | `nullable`, default: `0` |
| `total_weight` | `numeric` | `nullable`, default: `0` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `order_id` | `uuid` |  |
| `user_id` | `uuid` | `nullable` |
| `product_id` | `uuid` |  |

#### Entidad: `Order`
- **Tabla:** `orders`
- **Archivo:** `src/modules/order-items/entities/order-item-consumptions.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `order_number` | `bigint` | `unique` |
| `code` | `integer` | `nullable` |
| `paied` | `boolean` | `nullable`, default: `false` |
| `returned_paied` | `boolean` | `nullable`, default: `false` |
| `returned_split` | `boolean` | `nullable` |
| `subtotal_amount` | `numeric` | default: `0` |
| `total_amount` | `numeric` | default: `0` |
| `total_amount_paied` | `numeric` | `nullable`, default: `0` |
| `total_amount_returned` | `numeric` | `nullable`, default: `0` |
| `total_items` | `int` | default: `0` |
| `total_weight` | `numeric` | `nullable`, default: `0` |
| `delivery_cost` | `numeric` | `nullable`, default: `0` |
| `distance_km` | `numeric` | `nullable`, default: `0` |
| `duration_min` | `numeric` | `nullable`, default: `0` |
| `recycled_at` | `timestamptz` | `nullable` |
| `collected_at` | `timestamptz` | `nullable` |
| `recycled_code` | `varchar` | `nullable` |
| `observation` | `varchar` | `nullable` |
| `delivery_at` | `timestamptz` | `nullable` |
| `delivered_at` | `timestamptz` | `nullable` |
| `cancelled_at` | `timestamptz` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `group_id` | `uuid` | `nullable` |
| `status_id` | `uuid` | `nullable` |
| `address_id` | `uuid` | `nullable` |
| `user_id` | `uuid` | `nullable` |
| `payment_type_id` | `uuid` |  |

#### Entidad: `OrderItemConsumption`
- **Tabla:** `order_item_consumptions`
- **Archivo:** `src/modules/order-items/entities/order-item-consumptions.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `order_item_id` | `uuid` |  |
| `user_id` | `uuid` |  |
| `created_at` | `timestamptz` | `CreateDateColumn` |

### Módulo: PAYMENT-TYPES

#### Entidad: `PaymentType`
- **Tabla:** `payment_types`
- **Archivo:** `src/modules/payment-types/entities/payment-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `description` | `varchar` |  |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

#### Entidad: `Payment`
- **Tabla:** `payments`
- **Archivo:** `src/modules/payment-types/entities/payment-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `amount_paid` | `numeric` | default: `0` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `order_id` | `uuid` |  |
| `payment_type_id` | `uuid` |  |
| `transaction_id` | `uuid` | `nullable` |
| `user_id` | `uuid` |  |
| `status_id` | `uuid` |  |
| `gift_card_amount_used` | `numeric` | default: `0` |
| `user_gift_card_id` | `uuid` | `nullable` |

### Módulo: TRANSACTION-STATE

#### Entidad: `TransactionState`
- **Tabla:** `transaction_states`
- **Archivo:** `src/modules/transaction-state/entities/transaction-state.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `color` | `varchar` | `nullable` |
| `description` | `text` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

#### Entidad: `Transaction`
- **Tabla:** `transactions`
- **Archivo:** `src/modules/transaction-state/entities/transaction-state.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `wallet_id` | `uuid` |  |
| `type_id` | `uuid` |  |
| `status_id` | `uuid` |  |
| `amount_usd` | `numeric` | `nullable` |
| `post_balance` | `numeric` |  |
| `amount_orange` | `numeric` | `nullable` |
| `post_orange_balance` | `numeric` | `nullable` |
| `amount_green` | `numeric` | `nullable` |
| `post_green_balance` | `numeric` | `nullable` |
| `external_provider` | `enum` | `nullable`, enum |
| `external_reference_id` | `String` | `nullable` |
| `clientTransactionId` | `uuid` | `nullable` |
| `related_wallet_id` | `uuid` | `nullable` |
| `reference` | `text` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |

**Índices:**
- Columnas: `clientTransactionId` (Unique)

### Módulo: TRANSACTION-TYPE

#### Entidad: `TransactionType`
- **Tabla:** `transaction_types`
- **Archivo:** `src/modules/transaction-type/entities/transaction-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `color` | `varchar` | `nullable` |
| `icon` | `varchar` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: GIFT-CARD

#### Entidad: `GiftCard`
- **Tabla:** `gift_cards`
- **Archivo:** `src/modules/gift-card/entities/gift-card.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `image_url` | `varchar` | `nullable` |
| `amount` | `decimal` |  |
| `currency` | `varchar` | default: `USD` |
| `expiration_days` | `int` | `nullable` |
| `sold_quantity` | `int` | default: `0` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamp` | `CreateDateColumn` |
| `updated_at` | `timestamp` | `UpdateDateColumn` |
| `deleted_at` | `timestamp` | `nullable`, `DeleteDateColumn` |

**Índices:**
- Columnas: `is_active, created_at` 
- Columnas: `amount` 
- Columnas: `currency` 
- Columnas: `created_at` 
- Columnas: `is_active` 

#### Entidad: `UserGiftCard`
- **Tabla:** `user_gift_cards`
- **Archivo:** `src/modules/gift-card/entities/user-giftcard.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `gift_card_id` | `uuid` |  |
| `sender_user_id` | `uuid` |  |
| `recipient_wallet_id` | `uuid` |  |
| `message` | `text` | `nullable` |
| `original_balance` | `decimal` |  |
| `current_balance` | `decimal` |  |
| `reserved_balance` | `decimal` | default: `0` |
| `redeemed_at` | `timestamp` | `nullable` |
| `expires_at` | `timestamp` | `nullable` |
| `last_used_at` | `timestamp` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `status` | `enum` | default: `ACTIVE`, enum |
| `created_at` | `timestamp` | `CreateDateColumn` |
| `updated_at` | `timestamp` | `UpdateDateColumn` |

**Índices:**
- Columnas: `status, created_at` 
- Columnas: `recipient_wallet_id, is_active` 
- Columnas: `is_active, expires_at` 
- Columnas: `recipient_wallet_id, status` 
- Columnas: `gift_card_id` 
- Columnas: `recipient_wallet_id` 
- Columnas: `sender_user_id` 
- Columnas: `created_at` 
- Columnas: `expires_at` 
- Columnas: `is_active` 
- Columnas: `status` 

#### Entidad: `User`
- **Tabla:** `users`
- **Archivo:** `src/modules/gift-card/entities/user-giftcard.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `auth0_id` | `text` | `nullable` |
| `oauth_provider` | `text` | `nullable` |
| `email` | `text` | `unique` |
| `total_weight_recycled` | `numeric` | `nullable`, default: `0` |
| `username` | `text` | `nullable` |
| `full_name` | `text` | `nullable` |
| `profile_picture_url` | `text` | `nullable` |
| `current_balance` | `numeric` | `nullable`, default: `0` |
| `role_name` | `enum` | default: `USER`, enum |
| `address` | `text` | `nullable` |
| `phone` | `varchar` | `nullable` |
| `country` | `text` | `nullable` |
| `city` | `text` | `nullable` |
| `isBlocked` | `boolean` | default: `false` |
| `deleted_at` | `timestamptz` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |
| `password` | `text` | `nullable` |
| `role_id` | `uuid` |  |

### Módulo: USER-ADDRESS

#### Entidad: `UserAddress`
- **Tabla:** `user_addresses`
- **Archivo:** `src/modules/user-address/entities/user-address.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `String` |  |
| `addressLine1` | `String` |  |
| `addressLine2` | `String` | `nullable` |
| `city` | `String` |  |
| `state` | `String` | `nullable` |
| `country` | `String` |  |
| `postalCode` | `String` | `nullable` |
| `latitude` | `decimal` | `nullable` |
| `longitude` | `decimal` | `nullable` |
| `isDefault` | `Boolean` | default: `false` |
| `is_active` | `Boolean` | `nullable`, default: `true` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |
| `deleted_at` | `inferred` | `DeleteDateColumn` |

### Módulo: DELIVERY-STATUS

#### Entidad: `DeliveryStatus`
- **Tabla:** `delivery_status`
- **Archivo:** `src/modules/delivery-status/entities/delivery-status.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: GROUPS

#### Entidad: `GroupPrivacy`
- **Tabla:** `group_privacies`
- **Archivo:** `src/modules/groups/entities/group-privacy.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `description` | `varchar` | `nullable` |
| `is_visible` | `boolean` | default: `true` |
| `allow_free_join` | `boolean` | default: `false` |
| `is_active` | `boolean` | default: `true` |

### Módulo: EVENT-PASS

#### Entidad: `EventPassType`
- **Tabla:** `event_pass_type`
- **Archivo:** `src/modules/event-pass/entities/event-pass-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `created_at` | `inferred` | `CreateDateColumn` |

#### Entidad: `EventPass`
- **Tabla:** `event_pass`
- **Archivo:** `src/modules/event-pass/entities/event-pass-type.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` |  |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `message` | `text` | `nullable` |
| `image_url` | `varchar` | `nullable` |
| `images_urls` | `varchar` | `nullable` |
| `qr` | `text` | `nullable` |
| `event_place` | `varchar` | `nullable` |
| `event_city` | `varchar` | `nullable` |
| `address` | `String` | `nullable` |
| `latitude` | `decimal` | `nullable` |
| `longitude` | `decimal` | `nullable` |
| `event_date` | `timestamp` |  |
| `start_sale_date` | `timestamp` | `nullable` |
| `end_sale_date` | `timestamp` | `nullable` |
| `limit_tickets` | `int` | default: `0` |
| `sold_tickets` | `int` | default: `0` |
| `available` | `boolean` | default: `true` |
| `attended_count` | `int` | default: `0` |
| `price_usd` | `decimal` | `nullable` |
| `discount` | `decimal` | `nullable`, default: `0` |
| `total_usd` | `decimal` | `nullable` |
| `is_refundable` | `boolean` | default: `false` |
| `refund_days_limit` | `int` | `nullable`, default: `0` |
| `created_by_id` | `uuid` |  |
| `is_active` | `boolean` | default: `true` |
| `type_id` | `uuid` | `nullable` |
| `created_at` | `timestamp` | `CreateDateColumn` |
| `updated_at` | `timestamp` | `UpdateDateColumn` |

### Módulo: CART-ITEMS

#### Entidad: `CartItem`
- **Tabla:** `cart_items`
- **Archivo:** `src/modules/cart-items/entities/cart-item.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `cart_id` | `uuid` |  |
| `product_id` | `uuid` |  |
| `user_id` | `uuid` | `nullable` |
| `quantity` | `int` | default: `1` |
| `unit_price` | `decimal` |  |
| `total_price` | `decimal` |  |
| `unit_weight` | `numeric` | `nullable`, default: `0` |
| `total_weight` | `numeric` | `nullable`, default: `0` |
| `created_at` | `inferred` | `CreateDateColumn` |

### Módulo: CART

#### Entidad: `Cart`
- **Tabla:** `carts`
- **Archivo:** `src/modules/cart/entities/cart.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` | `nullable` |
| `address_id` | `uuid` | `nullable` |
| `group_id` | `uuid` | `nullable` |
| `payment_type_id` | `uuid` | `nullable` |
| `total_amount` | `numeric` | default: `0` |
| `total_weight` | `numeric` | `nullable`, default: `0` |
| `total_items` | `int` | default: `0` |
| `delivery_cost` | `numeric` | `nullable`, default: `0` |
| `distance_km` | `numeric` | `nullable`, default: `0` |
| `duration_min` | `numeric` | `nullable`, default: `0` |
| `delivery_at` | `timestamptz` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: RECYCLED-ITEMS

#### Entidad: `RecycledItem`
- **Tabla:** `recycled_items`
- **Archivo:** `src/modules/recycled-items/entities/recycled-item.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `weight` | `numeric` | `nullable`, default: `0` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `user_id` | `uuid` | `nullable` |

### Módulo: PRIZE-REDEMPTIONS

#### Entidad: `Prize`
- **Tabla:** `prizes`
- **Archivo:** `src/modules/prize-redemptions/entities/prize-redemption.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `text` |  |
| `description` | `text` | `nullable` |
| `cost` | `numeric` |  |
| `image_url` | `text` | `nullable` |
| `stock` | `integer` | default: `0` |
| `created_at` | `timestamptz` | `CreateDateColumn` |

#### Entidad: `PrizeRedemption`
- **Tabla:** `prize_redemptions`
- **Archivo:** `src/modules/prize-redemptions/entities/prize-redemption.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `status` | `text` |  |
| `redemption_date` | `timestamptz` | `CreateDateColumn` |
| `created_at` | `timestamptz` | `CreateDateColumn` |

### Módulo: COUPONS

#### Entidad: `CouponUsage`
- **Tabla:** `coupon_usages`
- **Archivo:** `src/modules/coupons/entities/coupon-usage.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `coupon_id` | `uuid` |  |
| `user_id` | `uuid` |  |
| `original_amount` | `numeric` |  |
| `discount_amount` | `numeric` |  |
| `order_id` | `uuid` | `nullable` |
| `used_at` | `timestamptz` | `CreateDateColumn` |

**Índices:**
- Columnas: `coupon_id, user_id` 

#### Entidad: `Coupon`
- **Tabla:** `coupons`
- **Archivo:** `src/modules/coupons/entities/coupon-usage.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `text` |  |
| `code` | `text` | `nullable`, `unique` |
| `type` | `enum` | enum |
| `value` | `numeric` |  |
| `max_discount_cap` | `numeric` | `nullable` |
| `min_spend_required` | `numeric` | `nullable` |
| `expires_at` | `timestamptz` | `nullable` |
| `max_usage_count` | `integer` | `nullable` |
| `usage_limit_per_user` | `integer` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |
| `created_by_user_id` | `uuid` |  |

### Módulo: ROLES

#### Entidad: `Role`
- **Tabla:** `roles`
- **Archivo:** `src/modules/roles/entities/role.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `role_id` | `uuid` | `primary` |
| `name` | `text` | `unique` |
| `description` | `text` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: ADMINS

#### Entidad: `Admin`
- **Tabla:** `admins`
- **Archivo:** `src/modules/admins/entities/admin.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `admin_id` | `uuid` | `primary` |
| `user_id` | `uuid` | `unique` |
| `assigned_at` | `timestamptz` | `nullable`, default: `() => 'NOW()'` |
| `content_permission` | `boolean` | default: `true` |
| `user_permission` | `boolean` | default: `true` |
| `moderation_permission` | `boolean` | default: `true` |
| `finance_permission` | `boolean` | default: `true` |
| `analytics_permission` | `boolean` | default: `true` |
| `settings_permission` | `boolean` | default: `true` |
| `leader_management_permission` | `boolean` | default: `true` |
| `company_management_permission` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: USER-CARDS

#### Entidad: `UserCard`
- **Tabla:** `user_cards`
- **Archivo:** `src/modules/user-cards/entities/user-card.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `email` | `String` |  |
| `phoneNumber` | `String` |  |
| `documentId` | `String` |  |
| `cardBrand` | `String` |  |
| `cardHolder` | `String` |  |
| `cardType` | `String` |  |
| `lastDigits` | `int` |  |
| `cardToken` | `String` |  |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: TESTIMONIES

#### Entidad: `Testimony`
- **Tabla:** `testimonies`
- **Archivo:** `src/modules/testimonies/entities/testimony.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `content` | `text` |  |
| `rating` | `int` | `nullable` |
| `is_approved` | `boolean` | default: `false` |
| `user_id` | `uuid` |  |
| `created_at` | `timestamp` | `CreateDateColumn` |
| `updated_at` | `timestamp` | `UpdateDateColumn` |
| `deleted_at` | `timestamp` | `nullable`, `DeleteDateColumn` |

### Módulo: USERS

#### Entidad: `Profile`
- **Tabla:** `profiles`
- **Archivo:** `src/modules/users/entities/profile.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` | `unique` |
| `description` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

#### Entidad: `UserProfile`
- **Tabla:** `users-profiles`
- **Archivo:** `src/modules/users/entities/profile-user.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `profile_id` | `uuid` |  |
| `created_at` | `inferred` | `CreateDateColumn` |

#### Entidad: `UserEventBeland`
- **Tabla:** `users-event-beland`
- **Archivo:** `src/modules/users/entities/users-event-beland.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_payment_id` | `uuid` |  |
| `user_sale_id` | `uuid` |  |
| `isRecycled` | `boolean` |  |
| `amount` | `numeric` | default: `0` |
| `created_at` | `inferred` | `CreateDateColumn` |

### Módulo: ACTIONS

#### Entidad: `Action`
- **Tabla:** `actions`
- **Archivo:** `src/modules/actions/entities/action.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `description` | `text` | `nullable` |
| `transaction_hash` | `text` | `nullable` |
| `block_number` | `integer` | `nullable` |
| `timestamp` | `timestamptz` | `CreateDateColumn` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `user_id` | `uuid` |  |

### Módulo: AMOUNT-TO-PAYMENT

#### Entidad: `AmountToPayment`
- **Tabla:** `amount_to_payment`
- **Archivo:** `src/modules/amount-to-payment/entities/amount-to-payment.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_commerce_id` | `uuid` |  |
| `amount` | `numeric` |  |
| `message` | `varchar` | `nullable` |
| `created_at` | `timestamp with time zone` | `CreateDateColumn` |

### Módulo: AUTH

#### Entidad: `AuthVerification`
- **Tabla:** `auth_verifications`
- **Archivo:** `src/modules/auth/entities/auth.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `String` |  |
| `email` | `String` | `unique` |
| `username` | `varchar` | `nullable` |
| `full_name` | `varchar` | `nullable` |
| `profile_picture_url` | `varchar` | `nullable` |
| `role_id` | `uuid` | `nullable` |
| `role_name` | `varchar` | `nullable` |
| `passwordHashed` | `String` |  |
| `address` | `String` | `nullable` |
| `phone` | `varchar` | `nullable` |
| `country` | `String` | `nullable` |
| `city` | `String` | `nullable` |
| `is_verified` | `boolean` | default: `false` |
| `expires_at` | `timestamp` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

#### Entidad: `ForgotPasswordCode`
- **Tabla:** `forgot_password_codes`
- **Archivo:** `src/modules/auth/entities/auth.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `code` | `varchar` |  |
| `count` | `int` | default: `0` |
| `is_verified` | `boolean` | default: `false` |
| `expires_at` | `timestamp` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `update_at` | `inferred` | `UpdateDateColumn` |

### Módulo: GROUP-MEMBERS-CONSUMPTION

#### Entidad: `GroupMemberConsumption`
- **Tabla:** `group_member_consumptions`
- **Archivo:** `src/modules/group-members-consumption/entities/group-members-consumption.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `group_id` | `uuid` |  |
| `group_member_id` | `uuid` |  |
| `product_id` | `uuid` |  |
| `notes` | `varchar` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: SERVICES

#### Entidad: `Service`
- **Tabla:** `services`
- **Archivo:** `src/modules/services/entities/service.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `description` | `varchar` | `nullable` |
| `cost` | `decimal` | `nullable` |
| `price` | `decimal` | `nullable` |
| `day_limit_cancelled` | `int` | `nullable` |
| `porcent_cancelled` | `int` | `nullable` |
| `image_url` | `varchar` | `nullable` |
| `is_available` | `boolean` | default: `true` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: GROUP-SERVICES

#### Entidad: `GroupService`
- **Tabla:** `group_services`
- **Archivo:** `src/modules/group-services/entities/group-service.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `group_id` | `uuid` |  |
| `service_id` | `uuid` |  |
| `payment_type_id` | `uuid` |  |
| `total_amount` | `decimal` |  |
| `is_completed` | `boolean` | default: `false` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: HUB-PRODUCT

#### Entidad: `Hub`
- **Tabla:** `hubs`
- **Archivo:** `src/modules/hub-product/entities/hub-product.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `legal_name` | `varchar` | `nullable` |
| `ruc` | `varchar` | `nullable` |
| `description` | `text` | `nullable` |
| `phone` | `varchar` | `nullable` |
| `email` | `varchar` | `nullable` |
| `address_id` | `uuid` |  |
| `website` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `user_id` | `uuid` |  |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

#### Entidad: `HubProduct`
- **Tabla:** `hub_products`
- **Archivo:** `src/modules/hub-product/entities/hub-product.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `hub_id` | `uuid` |  |
| `product_id` | `uuid` |  |
| `quantity` | `int` | default: `0` |
| `stock_min` | `int` | default: `0` |

### Módulo: PAYOUT-ACCOUNT

#### Entidad: `PaymentAccount`
- **Tabla:** `payment_accounts`
- **Archivo:** `src/modules/payout-account/entities/payment-account.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `accountHolder` | `varchar` |  |
| `bank` | `varchar` |  |
| `email` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `ruc` | `varchar` | `nullable`, `unique` |
| `nro_account` | `varchar` | `nullable`, `unique` |
| `cbu` | `varchar` | `nullable`, `unique` |
| `alias` | `varchar` | `nullable`, `unique` |
| `user_id` | `uuid` |  |
| `type_account` | `enum` | `nullable`, enum |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: PRESET-AMOUNT

#### Entidad: `PresetAmount`
- **Tabla:** `preset_amounts`
- **Archivo:** `src/modules/preset-amount/entities/preset-amount.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `String` |  |
| `amount` | `decimal` |  |
| `message` | `text` | `nullable` |
| `created_at` | `timestamp with time zone` | `CreateDateColumn` |
| `user_commerce_id` | `uuid` |  |

### Módulo: PROFILES

#### Entidad: `ContentCategory`
- **Tabla:** `content_categories`
- **Archivo:** `src/modules/profiles/creators/entities/content-category.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` |  |
| `name` | `varchar` |  |
| `description` | `varchar` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |

#### Entidad: `SocialNetwork`
- **Tabla:** `social_networks`
- **Archivo:** `src/modules/profiles/creators/entities/social-network.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` |  |
| `name` | `varchar` |  |
| `description` | `varchar` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |

#### Entidad: `Creator`
- **Tabla:** `creators`
- **Archivo:** `src/modules/profiles/creators/entities/creator.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `category_id` | `uuid` |  |
| `main_social_network_id` | `uuid` |  |
| `bio` | `varchar` | `nullable` |
| `main_link` | `varchar` | `nullable` |
| `followers_count` | `int` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

#### Entidad: `Vehicle`
- **Tabla:** `vehicles`
- **Archivo:** `src/modules/profiles/drivers/entities/vehicle.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `code` | `varchar` | `unique` |
| `name` | `varchar` |  |
| `description` | `text` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

#### Entidad: `Driver`
- **Tabla:** `drivers`
- **Archivo:** `src/modules/profiles/drivers/entities/driver.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `motivation_bio` | `text` | `nullable` |
| `profile_tagline` | `text` | `nullable` |
| `face_image_url` | `text` | `nullable` |
| `vehicle_type_id` | `uuid` |  |
| `vehicle_description` | `text` | `nullable` |
| `vehicle_plate` | `text` | `nullable` |
| `vehicle_image_url` | `text` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `work_address_id` | `uuid` | `nullable` |
| `license_number` | `text` | `nullable` |
| `rating` | `float` | default: `0` |
| `total_deliveries` | `int` | default: `0` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

#### Entidad: `Foundation`
- **Tabla:** `foundations`
- **Archivo:** `src/modules/profiles/foundations/entities/foundation.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `legal_name` | `varchar` | `nullable` |
| `ruc` | `varchar` | `nullable` |
| `description` | `text` | `nullable` |
| `phone` | `varchar` | `nullable` |
| `email` | `varchar` | `nullable` |
| `address_id` | `uuid` |  |
| `website` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `user_id` | `uuid` |  |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

#### Entidad: `Merchant`
- **Tabla:** `merchants`
- **Archivo:** `src/modules/profiles/merchants/entities/merchant.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `name` | `varchar` |  |
| `legal_name` | `varchar` | `nullable` |
| `ruc` | `varchar` | `nullable` |
| `description` | `text` | `nullable` |
| `phone` | `varchar` | `nullable` |
| `email` | `varchar` | `nullable` |
| `address_id` | `uuid` |  |
| `website` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `user_id` | `uuid` |  |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

#### Entidad: `RecyclerBase`
- **Tabla:** `recyclers`
- **Archivo:** `src/modules/profiles/recyclers/entities/recycler.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` | `unique` |
| `address_id` | `uuid` |  |
| `national_id` | `varchar` | `unique` |
| `belongs_to_association` | `boolean` | default: `false` |
| `association_name` | `varchar` | `nullable` |
| `has_collection_center` | `boolean` | default: `false` |
| `has_mobility` | `boolean` | default: `false` |
| `mobility_description` | `varchar` | `nullable` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

### Módulo: STRIPE-TOPUPS

#### Entidad: `StripeTopup`
- **Tabla:** `stripe_topups`
- **Archivo:** `src/modules/stripe-topups/entities/stripe-topup.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `wallet_id` | `uuid` |  |
| `recipient_wallet_id` | `uuid` | `nullable` |
| `user_id` | `uuid` |  |
| `client_transaction_id` | `uuid` |  |
| `payment_intent_id` | `text` | `nullable` |
| `stripe_event_id` | `text` | `nullable` |
| `amount_usd` | `numeric` |  |
| `currency` | `text` | default: `usd` |
| `status` | `text` | default: `PENDING` |
| `failure_code` | `text` | `nullable` |
| `failure_message` | `text` | `nullable` |
| `stripe_signature` | `text` | `nullable` |
| `raw_webhook_payload` | `text` | `nullable` |
| `completed_at` | `timestamptz` | `nullable` |
| `failed_at` | `timestamptz` | `nullable` |
| `owner` | `enum` | `nullable`, enum |
| `owner_id` | `uuid` | `nullable` |
| `user_gift_card_id` | `uuid` | `nullable` |
| `gift_card_reserved_amount` | `numeric` | `nullable` |
| `holder_name` | `varchar` | `nullable` |
| `holder_instagram_tiktok` | `varchar` | `nullable` |
| `holder_phone` | `varchar` | `nullable` |
| `holder_email` | `varchar` | `nullable` |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

**Índices:**
- Columnas: `wallet_id, status, created_at` 
- Columnas: `stripe_event_id` (Unique)
- Columnas: `payment_intent_id` (Unique)
- Columnas: `client_transaction_id` (Unique)

### Módulo: USER-EVENT-PASS

#### Entidad: `UserEventPass`
- **Tabla:** `user_event_passes`
- **Archivo:** `src/modules/user-event-pass/entities/user-event-pass.entity.ts`

> **[Entidad Financiera]**
> Esta entidad está relacionada con transacciones financieras, recargas o balances (BeCoins/USD). Es crucial para el core del negocio y cálculos de saldo.

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `event_pass_id` | `uuid` |  |
| `holder_name` | `String` |  |
| `holder_instagram_tiktok` | `String` |  |
| `holder_phone` | `String` | `nullable` |
| `holder_email` | `String` | `nullable` |
| `purchase_date` | `inferred` | `CreateDateColumn` |
| `redemption_date` | `timestamp` | `nullable` |
| `is_consumed` | `Boolean` | default: `false` |
| `purchase_price` | `decimal` | `nullable` |
| `is_refunded` | `Boolean` | default: `false` |
| `refunded_at` | `timestamp` | `nullable` |
| `is_active` | `Boolean` | default: `true` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: USER-FEEDBACK

#### Entidad: `UserFeedback`
- **Tabla:** `user_feedback`
- **Archivo:** `src/modules/user-feedback/entities/user-feedback.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `user_id` | `uuid` |  |
| `rating` | `int` |  |
| `comment` | `text` | `nullable` |
| `section` | `enum` | `nullable`, enum |
| `platform` | `varchar` | `nullable` |
| `app_version` | `varchar` | `nullable` |
| `reviewed` | `boolean` | default: `false` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: USER-RECHARGE

#### Entidad: `RechargeTransfer`
- **Tabla:** `recharge_transfers`
- **Archivo:** `src/modules/user-recharge/entities/user-recharge.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `payment_account_id` | `uuid` |  |
| `amount_usd` | `decimal` |  |
| `transfer_id` | `varchar` |  |
| `ticket_image_url` | `varchar` |  |
| `user_id` | `uuid` |  |
| `status_id` | `uuid` |  |
| `transaction_id` | `uuid` | `nullable` |
| `refunded_amount` | `decimal` | `nullable` |
| `created_at` | `inferred` | `CreateDateColumn` |
| `updated_at` | `inferred` | `UpdateDateColumn` |

### Módulo: USER-WITHDRAW

#### Entidad: `UserWithdraw`
- **Tabla:** `user_withdraws`
- **Archivo:** `src/modules/user-withdraw/entities/user-withdraw.entity.ts`

**Propiedades/Columnas:**
| Propiedad | Tipo TS / DB | Atributos |
|-----------|--------------|-----------|
| `id` | `uuid` | `primary` |
| `observation` | `text` | `nullable` |
| `transaction_banck_id` | `varchar` | `nullable` |
| `user_id` | `uuid` |  |
| `wallet_id` | `uuid` |  |
| `withdraw_account_id` | `uuid` |  |
| `amount_usd` | `decimal` |  |
| `status_id` | `uuid` |  |
| `transaction_id` | `uuid` |  |
| `created_at` | `timestamptz` | `CreateDateColumn` |
| `updated_at` | `timestamptz` | `UpdateDateColumn` |

## 2. Relaciones

### `WithdrawAccount` -> `WithdrawAccountType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `withdraw_account_type`
- **JoinColumn / FK:** `withdraw_account_type_id`
- **Atributos:** eager

```text
WithdrawAccount
  └── N:1 → WithdrawAccountType
         FK: withdraw_account_type_id → WithdrawAccountType.id
```

### `WithdrawAccount` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
WithdrawAccount
  └── N:1 → User
         FK: user_id → User.id
```

### `WithdrawAccount` -> `Wallet` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `wallet`
- **JoinColumn / FK:** (implícito) `walletId`
- **Atributos:** onDelete: CASCADE

```text
WithdrawAccount
  └── 1:1 → Wallet
         FK: walletId → Wallet.id
```

### `Wallet` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
Wallet
  └── 1:1 → User
         FK: user_id → User.id
```

### `Wallet` -> `WithdrawAccount` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `withdraw_account`
- **JoinColumn / FK:** `withdraw_account_id`
- **Atributos:** cascade, nullable

```text
Wallet
  └── 1:1 → WithdrawAccount
         FK: withdraw_account_id → WithdrawAccount.id
```

### `GroupMember` -> `Group` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** `group_id`
- **Atributos:** onDelete: CASCADE

```text
GroupMember
  └── N:1 → Group
         FK: group_id → Group.id
```

### `GroupMember` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
GroupMember
  └── N:1 → User
         FK: user_id → User.id
```

### `Category` -> `Product` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `products`
- **JoinColumn / FK:** Definido en entidad destino

```text
Category
  └── 1:N → Product
```

### `GroupType` -> `Product` (many-to-many)
- **Tipo:** `@many-to-many`
- **Propiedad:** `products`
- **JoinColumn / FK:** Definido en entidad destino

```text
GroupType
  └── N:M → Product
```

### `InventoryItem` -> `Product` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `product`
- **JoinColumn / FK:** `product_id`
- **Atributos:** onDelete: CASCADE

```text
InventoryItem
  └── N:1 → Product
         FK: product_id → Product.id
```

### `Product` -> `Category` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `category`
- **JoinColumn / FK:** `category_id`

```text
Product
  └── N:1 → Category
         FK: category_id → Category.id
```

### `Product` -> `GroupType` (many-to-many)
- **Tipo:** `@many-to-many`
- **Propiedad:** `group_types`
- **JoinColumn / FK:** Definido en entidad destino

```text
Product
  └── N:M → GroupType
```

### `Product` -> `InventoryItem` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `inventory_items`
- **JoinColumn / FK:** Definido en entidad destino

```text
Product
  └── 1:N → InventoryItem
```

### `Product` -> `OrderItem` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `order_items`
- **JoinColumn / FK:** Definido en entidad destino

```text
Product
  └── 1:N → OrderItem
```

### `OrderItem` -> `Order` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `order`
- **JoinColumn / FK:** `order_id`
- **Atributos:** onDelete: CASCADE

```text
OrderItem
  └── N:1 → Order
         FK: order_id → Order.id
```

### `OrderItem` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
OrderItem
  └── N:1 → User
         FK: user_id → User.id
```

### `OrderItem` -> `Product` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `product`
- **JoinColumn / FK:** `product_id`

```text
OrderItem
  └── N:1 → Product
         FK: product_id → Product.id
```

### `PaymentType` -> `Order` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `orders`
- **JoinColumn / FK:** Definido en entidad destino

```text
PaymentType
  └── 1:N → Order
```

### `PaymentType` -> `Order` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `carts`
- **JoinColumn / FK:** Definido en entidad destino

```text
PaymentType
  └── 1:N → Order
```

### `TransactionState` -> `Transaction` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `transactions`
- **JoinColumn / FK:** Definido en entidad destino

```text
TransactionState
  └── 1:N → Transaction
```

### `TransactionType` -> `Transaction` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `transactions`
- **JoinColumn / FK:** Definido en entidad destino

```text
TransactionType
  └── 1:N → Transaction
```

### `Transaction` -> `Wallet` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `wallet`
- **JoinColumn / FK:** `wallet_id`

```text
Transaction
  └── N:1 → Wallet
         FK: wallet_id → Wallet.id
```

### `Transaction` -> `TransactionType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `type`
- **JoinColumn / FK:** `type_id`

```text
Transaction
  └── N:1 → TransactionType
         FK: type_id → TransactionType.id
```

### `Transaction` -> `TransactionState` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `status`
- **JoinColumn / FK:** `status_id`

```text
Transaction
  └── N:1 → TransactionState
         FK: status_id → TransactionState.id
```

### `Transaction` -> `Wallet` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `related_wallet`
- **JoinColumn / FK:** `related_wallet_id`

```text
Transaction
  └── N:1 → Wallet
         FK: related_wallet_id → Wallet.id
```

### `UserGiftCard` -> `GiftCard` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `gift_card`
- **JoinColumn / FK:** `gift_card_id`
- **Atributos:** onDelete: RESTRICT

```text
UserGiftCard
  └── N:1 → GiftCard
         FK: gift_card_id → GiftCard.id
```

### `UserGiftCard` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `sender_user`
- **JoinColumn / FK:** `sender_user_id`
- **Atributos:** onDelete: RESTRICT

```text
UserGiftCard
  └── N:1 → User
         FK: sender_user_id → User.id
```

### `UserGiftCard` -> `Wallet` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `recipient_wallet`
- **JoinColumn / FK:** `recipient_wallet_id`
- **Atributos:** onDelete: RESTRICT

```text
UserGiftCard
  └── N:1 → Wallet
         FK: recipient_wallet_id → Wallet.id
```

### `Payment` -> `Order` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `order`
- **JoinColumn / FK:** `order_id`
- **Atributos:** onDelete: CASCADE

```text
Payment
  └── N:1 → Order
         FK: order_id → Order.id
```

### `Payment` -> `PaymentType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `payment_type`
- **JoinColumn / FK:** `payment_type_id`

```text
Payment
  └── N:1 → PaymentType
         FK: payment_type_id → PaymentType.id
```

### `Payment` -> `Transaction` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `transaction`
- **JoinColumn / FK:** `transaction_id`

```text
Payment
  └── N:1 → Transaction
         FK: transaction_id → Transaction.id
```

### `Payment` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
Payment
  └── N:1 → User
         FK: user_id → User.id
```

### `Payment` -> `TransactionState` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `status`
- **JoinColumn / FK:** `status_id`

```text
Payment
  └── N:1 → TransactionState
         FK: status_id → TransactionState.id
```

### `Payment` -> `UserGiftCard` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_gift_card`
- **JoinColumn / FK:** `user_gift_card_id`
- **Atributos:** nullable, onDelete: RESTRICT

```text
Payment
  └── N:1 → UserGiftCard
         FK: user_gift_card_id → UserGiftCard.id
```

### `UserAddress` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
UserAddress
  └── N:1 → User
         FK: user_id → User.id
```

### `UserAddress` -> `Order` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `orders`
- **JoinColumn / FK:** Definido en entidad destino

```text
UserAddress
  └── 1:N → Order
```

### `Order` -> `Group` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** `group_ip`
- **Atributos:** nullable, onDelete: SET NULL

```text
Order
  └── N:1 → Group
         FK: group_ip → Group.id
```

### `Order` -> `DeliveryStatus` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `status`
- **JoinColumn / FK:** `status_id`

```text
Order
  └── N:1 → DeliveryStatus
         FK: status_id → DeliveryStatus.id
```

### `Order` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`
- **Atributos:** nullable, onDelete: SET NULL

```text
Order
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `Order` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
Order
  └── N:1 → User
         FK: user_id → User.id
```

### `Order` -> `PaymentType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `payment_type`
- **JoinColumn / FK:** `payment_type_id`
- **Atributos:** eager

```text
Order
  └── N:1 → PaymentType
         FK: payment_type_id → PaymentType.id
```

### `Order` -> `OrderItem` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `items`
- **JoinColumn / FK:** Definido en entidad destino

```text
Order
  └── 1:N → OrderItem
```

### `Order` -> `Payment` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `payments`
- **JoinColumn / FK:** Definido en entidad destino

```text
Order
  └── 1:N → Payment
```

### `EventPass` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `created_by`
- **JoinColumn / FK:** `created_by_id`

```text
EventPass
  └── N:1 → User
         FK: created_by_id → User.id
```

### `EventPass` -> `EventPassType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `type`
- **JoinColumn / FK:** `type_id`

```text
EventPass
  └── N:1 → EventPassType
         FK: type_id → EventPassType.id
```

### `EventPass` -> `Group` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** (implícito) `groupId`

```text
EventPass
  └── 1:1 → Group
         FK: groupId → Group.id
```

### `CartItem` -> `Cart` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `cart`
- **JoinColumn / FK:** `cart_id`
- **Atributos:** onDelete: CASCADE

```text
CartItem
  └── N:1 → Cart
         FK: cart_id → Cart.id
```

### `CartItem` -> `Product` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `product`
- **JoinColumn / FK:** `product_id`

```text
CartItem
  └── N:1 → Product
         FK: product_id → Product.id
```

### `CartItem` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
CartItem
  └── N:1 → User
         FK: user_id → User.id
```

### `Cart` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** cascade, onDelete: CASCADE

```text
Cart
  └── 1:1 → User
         FK: user_id → User.id
```

### `Cart` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`
- **Atributos:** onDelete: CASCADE

```text
Cart
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `Cart` -> `Group` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** `group_id`
- **Atributos:** nullable, onDelete: SET NULL

```text
Cart
  └── 1:1 → Group
         FK: group_id → Group.id
```

### `Cart` -> `PaymentType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `payment_type`
- **JoinColumn / FK:** `payment_type_id`
- **Atributos:** eager

```text
Cart
  └── N:1 → PaymentType
         FK: payment_type_id → PaymentType.id
```

### `Cart` -> `CartItem` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `items`
- **JoinColumn / FK:** Definido en entidad destino
- **Atributos:** cascade, eager

```text
Cart
  └── 1:N → CartItem
```

### `Group` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_address`
- **JoinColumn / FK:** `user_address_id`
- **Atributos:** onDelete: SET NULL

```text
Group
  └── N:1 → UserAddress
         FK: user_address_id → UserAddress.id
```

### `Group` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** nullable, onDelete: SET NULL

```text
Group
  └── N:1 → User
         FK: user_id → User.id
```

### `Group` -> `GroupType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `group_type`
- **JoinColumn / FK:** `group_type_id`
- **Atributos:** onDelete: SET NULL

```text
Group
  └── N:1 → GroupType
         FK: group_type_id → GroupType.id
```

### `Group` -> `GroupPrivacy` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `privacy`
- **JoinColumn / FK:** `privacy_id`

```text
Group
  └── N:1 → GroupPrivacy
         FK: privacy_id → GroupPrivacy.id
```

### `Group` -> `PaymentType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `payment_type`
- **JoinColumn / FK:** `payment_type_id`
- **Atributos:** onDelete: SET NULL

```text
Group
  └── N:1 → PaymentType
         FK: payment_type_id → PaymentType.id
```

### `Group` -> `EventPass` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `event_pass`
- **JoinColumn / FK:** `event_pass_id`

```text
Group
  └── 1:1 → EventPass
         FK: event_pass_id → EventPass.id
```

### `Group` -> `GroupMember` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `members`
- **JoinColumn / FK:** Definido en entidad destino

```text
Group
  └── 1:N → GroupMember
```

### `Group` -> `Order` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `orders`
- **JoinColumn / FK:** Definido en entidad destino

```text
Group
  └── 1:N → Order
```

### `Group` -> `Cart` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `cart`
- **JoinColumn / FK:** (implícito) `cartId`

```text
Group
  └── 1:1 → Cart
         FK: cartId → Cart.id
```

### `RecycledItem` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** nullable

```text
RecycledItem
  └── N:1 → User
         FK: user_id → User.id
```

### `Prize` -> `PrizeRedemption` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `redemptions`
- **JoinColumn / FK:** Definido en entidad destino

```text
Prize
  └── 1:N → PrizeRedemption
```

### `PrizeRedemption` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** (implícito) `userId`

```text
PrizeRedemption
  └── N:1 → User
         FK: userId → User.id
```

### `PrizeRedemption` -> `Prize` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `prize`
- **JoinColumn / FK:** (implícito) `prizeId`

```text
PrizeRedemption
  └── N:1 → Prize
         FK: prizeId → Prize.id
```

### `CouponUsage` -> `Coupon` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `coupon`
- **JoinColumn / FK:** `coupon_id`
- **Atributos:** onDelete: CASCADE

```text
CouponUsage
  └── N:1 → Coupon
         FK: coupon_id → Coupon.id
```

### `CouponUsage` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
CouponUsage
  └── N:1 → User
         FK: user_id → User.id
```

### `Coupon` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `created_by_user`
- **JoinColumn / FK:** `created_by_user_id`

```text
Coupon
  └── N:1 → User
         FK: created_by_user_id → User.id
```

### `Coupon` -> `CouponUsage` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `usages`
- **JoinColumn / FK:** Definido en entidad destino

```text
Coupon
  └── 1:N → CouponUsage
```

### `Role` -> `User` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `users`
- **JoinColumn / FK:** Definido en entidad destino

```text
Role
  └── 1:N → User
```

### `Admin` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Admin
  └── 1:1 → User
         FK: user_id → User.id
```

### `UserCard` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
UserCard
  └── N:1 → User
         FK: user_id → User.id
```

### `Testimony` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Testimony
  └── N:1 → User
         FK: user_id → User.id
```

### `Profile` -> `UserProfile` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `users`
- **JoinColumn / FK:** Definido en entidad destino

```text
Profile
  └── 1:N → UserProfile
```

### `UserProfile` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
UserProfile
  └── N:1 → User
         FK: user_id → User.id
```

### `UserProfile` -> `Profile` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `profile`
- **JoinColumn / FK:** `profile_id`

```text
UserProfile
  └── N:1 → Profile
         FK: profile_id → Profile.id
```

### `User` -> `Role` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `role`
- **JoinColumn / FK:** `role_id`
- **Atributos:** eager

```text
User
  └── N:1 → Role
         FK: role_id → Role.id
```

### `User` -> `Admin` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `admin`
- **JoinColumn / FK:** (implícito) `adminId`

```text
User
  └── 1:1 → Admin
         FK: adminId → Admin.id
```

### `User` -> `Cart` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `cart`
- **JoinColumn / FK:** (implícito) `cartId`

```text
User
  └── 1:1 → Cart
         FK: cartId → Cart.id
```

### `User` -> `Wallet` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `wallet`
- **JoinColumn / FK:** (implícito) `walletId`
- **Atributos:** cascade

```text
User
  └── 1:1 → Wallet
         FK: walletId → Wallet.id
```

### `User` -> `Group` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `led_groups`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Group
```

### `User` -> `GroupMember` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `group_memberships`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → GroupMember
```

### `User` -> `Testimony` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `testimonies`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Testimony
```

### `User` -> `Order` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `orders`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Order
```

### `User` -> `Payment` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `payments`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Payment
```

### `User` -> `Action` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `actions`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Action
```

### `User` -> `RecycledItem` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `recycledItems`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → RecycledItem
```

### `User` -> `PrizeRedemption` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `prize_redemptions`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → PrizeRedemption
```

### `User` -> `Coupon` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `created_coupons`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → Coupon
```

### `User` -> `CouponUsage` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `coupon_usages`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → CouponUsage
```

### `User` -> `UserAddress` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `addresses`
- **JoinColumn / FK:** Definido en entidad destino
- **Atributos:** cascade

```text
User
  └── 1:N → UserAddress
```

### `User` -> `UserCard` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `cards`
- **JoinColumn / FK:** Definido en entidad destino
- **Atributos:** cascade

```text
User
  └── 1:N → UserCard
```

### `User` -> `WithdrawAccount` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `withdraw_accounts`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → WithdrawAccount
```

### `User` -> `UserProfile` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `profiles`
- **JoinColumn / FK:** Definido en entidad destino

```text
User
  └── 1:N → UserProfile
```

### `Action` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
Action
  └── N:1 → User
         FK: user_id → User.id
```

### `AmountToPayment` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_commerce`
- **JoinColumn / FK:** `user_commerce_id`
- **Atributos:** onDelete: CASCADE

```text
AmountToPayment
  └── N:1 → User
         FK: user_commerce_id → User.id
```

### `AuthVerification` -> `Role` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `role`
- **JoinColumn / FK:** `role_id`
- **Atributos:** nullable

```text
AuthVerification
  └── N:1 → Role
         FK: role_id → Role.id
```

### `ForgotPasswordCode` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
ForgotPasswordCode
  └── N:1 → User
         FK: user_id → User.id
```

### `GroupMemberConsumption` -> `Group` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** `group_id`

```text
GroupMemberConsumption
  └── N:1 → Group
         FK: group_id → Group.id
```

### `GroupMemberConsumption` -> `GroupMember` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `groupMember`
- **JoinColumn / FK:** `group_member_id`
- **Atributos:** onDelete: CASCADE

```text
GroupMemberConsumption
  └── N:1 → GroupMember
         FK: group_member_id → GroupMember.id
```

### `GroupMemberConsumption` -> `Product` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `product`
- **JoinColumn / FK:** `product_id`

```text
GroupMemberConsumption
  └── N:1 → Product
         FK: product_id → Product.id
```

### `GroupService` -> `Group` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `group`
- **JoinColumn / FK:** `group_id`
- **Atributos:** onDelete: CASCADE

```text
GroupService
  └── N:1 → Group
         FK: group_id → Group.id
```

### `GroupService` -> `Service` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `service`
- **JoinColumn / FK:** `service_id`

```text
GroupService
  └── N:1 → Service
         FK: service_id → Service.id
```

### `GroupService` -> `PaymentType` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `payment_type`
- **JoinColumn / FK:** `payment_type_id`

```text
GroupService
  └── N:1 → PaymentType
         FK: payment_type_id → PaymentType.id
```

### `Hub` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`

```text
Hub
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `Hub` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Hub
  └── 1:1 → User
         FK: user_id → User.id
```

### `Hub` -> `HubProduct` (one-to-many)
- **Tipo:** `@one-to-many`
- **Propiedad:** `products`
- **JoinColumn / FK:** Definido en entidad destino

```text
Hub
  └── 1:N → HubProduct
```

### `HubProduct` -> `Hub` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `hub`
- **JoinColumn / FK:** `hub_id`
- **Atributos:** onDelete: CASCADE

```text
HubProduct
  └── N:1 → Hub
         FK: hub_id → Hub.id
```

### `HubProduct` -> `Product` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `product`
- **JoinColumn / FK:** `product_id`
- **Atributos:** eager, onDelete: CASCADE

```text
HubProduct
  └── N:1 → Product
         FK: product_id → Product.id
```

### `OrderItemConsumption` -> `OrderItem` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `order_item`
- **JoinColumn / FK:** `order_item_id`
- **Atributos:** onDelete: CASCADE

```text
OrderItemConsumption
  └── N:1 → OrderItem
         FK: order_item_id → OrderItem.id
```

### `OrderItemConsumption` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
OrderItemConsumption
  └── N:1 → User
         FK: user_id → User.id
```

### `PaymentAccount` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
PaymentAccount
  └── N:1 → User
         FK: user_id → User.id
```

### `PresetAmount` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_commerce`
- **JoinColumn / FK:** `user_commerce_id`
- **Atributos:** onDelete: CASCADE

```text
PresetAmount
  └── N:1 → User
         FK: user_commerce_id → User.id
```

### `Creator` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Creator
  └── 1:1 → User
         FK: user_id → User.id
```

### `Creator` -> `ContentCategory` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `category`
- **JoinColumn / FK:** `category_id`

```text
Creator
  └── N:1 → ContentCategory
         FK: category_id → ContentCategory.id
```

### `Creator` -> `SocialNetwork` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `main_social_network`
- **JoinColumn / FK:** `main_social_network_id`

```text
Creator
  └── N:1 → SocialNetwork
         FK: main_social_network_id → SocialNetwork.id
```

### `Driver` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Driver
  └── 1:1 → User
         FK: user_id → User.id
```

### `Driver` -> `Vehicle` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `vehicle_type`
- **JoinColumn / FK:** `vehicle_type_id`

```text
Driver
  └── N:1 → Vehicle
         FK: vehicle_type_id → Vehicle.id
```

### `Driver` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `work_address`
- **JoinColumn / FK:** `work_address_id`
- **Atributos:** nullable

```text
Driver
  └── N:1 → UserAddress
         FK: work_address_id → UserAddress.id
```

### `Foundation` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`

```text
Foundation
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `Foundation` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Foundation
  └── 1:1 → User
         FK: user_id → User.id
```

### `Merchant` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`

```text
Merchant
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `Merchant` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
Merchant
  └── 1:1 → User
         FK: user_id → User.id
```

### `RecyclerBase` -> `User` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
RecyclerBase
  └── 1:1 → User
         FK: user_id → User.id
```

### `RecyclerBase` -> `UserAddress` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `address`
- **JoinColumn / FK:** `address_id`

```text
RecyclerBase
  └── N:1 → UserAddress
         FK: address_id → UserAddress.id
```

### `StripeTopup` -> `Wallet` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `wallet`
- **JoinColumn / FK:** `wallet_id`

```text
StripeTopup
  └── N:1 → Wallet
         FK: wallet_id → Wallet.id
```

### `StripeTopup` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`

```text
StripeTopup
  └── N:1 → User
         FK: user_id → User.id
```

### `UserEventPass` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** eager

```text
UserEventPass
  └── N:1 → User
         FK: user_id → User.id
```

### `UserEventPass` -> `EventPass` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `event_pass`
- **JoinColumn / FK:** `event_pass_id`
- **Atributos:** eager

```text
UserEventPass
  └── N:1 → EventPass
         FK: event_pass_id → EventPass.id
```

### `UserFeedback` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** (implícito) `userId`
- **Atributos:** onDelete: CASCADE

```text
UserFeedback
  └── N:1 → User
         FK: userId → User.id
```

### `RechargeTransfer` -> `PaymentAccount` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `paymentAccount`
- **JoinColumn / FK:** `payment_account_id`
- **Atributos:** eager, onDelete: RESTRICT

```text
RechargeTransfer
  └── N:1 → PaymentAccount
         FK: payment_account_id → PaymentAccount.id
```

### `RechargeTransfer` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** eager, onDelete: CASCADE

```text
RechargeTransfer
  └── N:1 → User
         FK: user_id → User.id
```

### `RechargeTransfer` -> `TransactionState` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `status`
- **JoinColumn / FK:** `status_id`
- **Atributos:** eager, onDelete: RESTRICT

```text
RechargeTransfer
  └── N:1 → TransactionState
         FK: status_id → TransactionState.id
```

### `RechargeTransfer` -> `Transaction` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `transaction`
- **JoinColumn / FK:** `transaction_id`
- **Atributos:** nullable

```text
RechargeTransfer
  └── N:1 → Transaction
         FK: transaction_id → Transaction.id
```

### `UserWithdraw` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user`
- **JoinColumn / FK:** `user_id`
- **Atributos:** onDelete: CASCADE

```text
UserWithdraw
  └── N:1 → User
         FK: user_id → User.id
```

### `UserWithdraw` -> `Wallet` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `wallet`
- **JoinColumn / FK:** `wallet_id`
- **Atributos:** onDelete: CASCADE

```text
UserWithdraw
  └── N:1 → Wallet
         FK: wallet_id → Wallet.id
```

### `UserWithdraw` -> `WithdrawAccount` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `withdraw_account`
- **JoinColumn / FK:** `withdraw_account_id`
- **Atributos:** onDelete: CASCADE

```text
UserWithdraw
  └── N:1 → WithdrawAccount
         FK: withdraw_account_id → WithdrawAccount.id
```

### `UserWithdraw` -> `TransactionState` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `status`
- **JoinColumn / FK:** `status_id`
- **Atributos:** onDelete: CASCADE

```text
UserWithdraw
  └── N:1 → TransactionState
         FK: status_id → TransactionState.id
```

### `UserWithdraw` -> `Transaction` (one-to-one)
- **Tipo:** `@one-to-one`
- **Propiedad:** `transaction`
- **JoinColumn / FK:** `transaction_id`
- **Atributos:** onDelete: CASCADE

```text
UserWithdraw
  └── 1:1 → Transaction
         FK: transaction_id → Transaction.id
```

### `UserEventBeland` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_payment`
- **JoinColumn / FK:** `user_payment_id`

```text
UserEventBeland
  └── N:1 → User
         FK: user_payment_id → User.id
```

### `UserEventBeland` -> `User` (many-to-one)
- **Tipo:** `@many-to-one`
- **Propiedad:** `user_sale`
- **JoinColumn / FK:** `user_sale_id`

```text
UserEventBeland
  └── N:1 → User
         FK: user_sale_id → User.id
```

## 3. Foreign Keys

- `WithdrawAccount.withdraw_account_type_id` → `WithdrawAccountType.id` [many-to-one]
- `WithdrawAccount.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `WithdrawAccount.walletId` → `Wallet.id` [one-to-one] (ON DELETE CASCADE)
- `Wallet.user_id` → `User.id` [one-to-one]
- `Wallet.withdraw_account_id` → `WithdrawAccount.id` [one-to-one]
- `GroupMember.group_id` → `Group.id` [many-to-one] (ON DELETE CASCADE)
- `GroupMember.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `InventoryItem.product_id` → `Product.id` [many-to-one] (ON DELETE CASCADE)
- `Product.category_id` → `Category.id` [many-to-one]
- `OrderItem.order_id` → `Order.id` [many-to-one] (ON DELETE CASCADE)
- `OrderItem.user_id` → `User.id` [many-to-one]
- `OrderItem.product_id` → `Product.id` [many-to-one]
- `Transaction.wallet_id` → `Wallet.id` [many-to-one]
- `Transaction.type_id` → `TransactionType.id` [many-to-one]
- `Transaction.status_id` → `TransactionState.id` [many-to-one]
- `Transaction.related_wallet_id` → `Wallet.id` [many-to-one]
- `UserGiftCard.gift_card_id` → `GiftCard.id` [many-to-one] (ON DELETE RESTRICT)
- `UserGiftCard.sender_user_id` → `User.id` [many-to-one] (ON DELETE RESTRICT)
- `UserGiftCard.recipient_wallet_id` → `Wallet.id` [many-to-one] (ON DELETE RESTRICT)
- `Payment.order_id` → `Order.id` [many-to-one] (ON DELETE CASCADE)
- `Payment.payment_type_id` → `PaymentType.id` [many-to-one]
- `Payment.transaction_id` → `Transaction.id` [many-to-one]
- `Payment.user_id` → `User.id` [many-to-one]
- `Payment.status_id` → `TransactionState.id` [many-to-one]
- `Payment.user_gift_card_id` → `UserGiftCard.id` [many-to-one] (ON DELETE RESTRICT)
- `UserAddress.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `Order.group_ip` → `Group.id` [many-to-one] (ON DELETE SET NULL)
- `Order.status_id` → `DeliveryStatus.id` [many-to-one]
- `Order.address_id` → `UserAddress.id` [many-to-one] (ON DELETE SET NULL)
- `Order.user_id` → `User.id` [many-to-one]
- `Order.payment_type_id` → `PaymentType.id` [many-to-one]
- `EventPass.created_by_id` → `User.id` [many-to-one]
- `EventPass.type_id` → `EventPassType.id` [many-to-one]
- `EventPass.groupId` → `Group.id` [one-to-one]
- `CartItem.cart_id` → `Cart.id` [many-to-one] (ON DELETE CASCADE)
- `CartItem.product_id` → `Product.id` [many-to-one]
- `CartItem.user_id` → `User.id` [many-to-one]
- `Cart.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `Cart.address_id` → `UserAddress.id` [many-to-one] (ON DELETE CASCADE)
- `Cart.group_id` → `Group.id` [one-to-one] (ON DELETE SET NULL)
- `Cart.payment_type_id` → `PaymentType.id` [many-to-one]
- `Group.user_address_id` → `UserAddress.id` [many-to-one] (ON DELETE SET NULL)
- `Group.user_id` → `User.id` [many-to-one] (ON DELETE SET NULL)
- `Group.group_type_id` → `GroupType.id` [many-to-one] (ON DELETE SET NULL)
- `Group.privacy_id` → `GroupPrivacy.id` [many-to-one]
- `Group.payment_type_id` → `PaymentType.id` [many-to-one] (ON DELETE SET NULL)
- `Group.event_pass_id` → `EventPass.id` [one-to-one]
- `Group.cartId` → `Cart.id` [one-to-one]
- `RecycledItem.user_id` → `User.id` [many-to-one]
- `PrizeRedemption.userId` → `User.id` [many-to-one]
- `PrizeRedemption.prizeId` → `Prize.id` [many-to-one]
- `CouponUsage.coupon_id` → `Coupon.id` [many-to-one] (ON DELETE CASCADE)
- `CouponUsage.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `Coupon.created_by_user_id` → `User.id` [many-to-one]
- `Admin.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `UserCard.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `Testimony.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `UserProfile.user_id` → `User.id` [many-to-one]
- `UserProfile.profile_id` → `Profile.id` [many-to-one]
- `User.role_id` → `Role.id` [many-to-one]
- `User.adminId` → `Admin.id` [one-to-one]
- `User.cartId` → `Cart.id` [one-to-one]
- `User.walletId` → `Wallet.id` [one-to-one]
- `Action.user_id` → `User.id` [many-to-one]
- `AmountToPayment.user_commerce_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `AuthVerification.role_id` → `Role.id` [many-to-one]
- `ForgotPasswordCode.user_id` → `User.id` [many-to-one]
- `GroupMemberConsumption.group_id` → `Group.id` [many-to-one]
- `GroupMemberConsumption.group_member_id` → `GroupMember.id` [many-to-one] (ON DELETE CASCADE)
- `GroupMemberConsumption.product_id` → `Product.id` [many-to-one]
- `GroupService.group_id` → `Group.id` [many-to-one] (ON DELETE CASCADE)
- `GroupService.service_id` → `Service.id` [many-to-one]
- `GroupService.payment_type_id` → `PaymentType.id` [many-to-one]
- `Hub.address_id` → `UserAddress.id` [many-to-one]
- `Hub.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `HubProduct.hub_id` → `Hub.id` [many-to-one] (ON DELETE CASCADE)
- `HubProduct.product_id` → `Product.id` [many-to-one] (ON DELETE CASCADE)
- `OrderItemConsumption.order_item_id` → `OrderItem.id` [many-to-one] (ON DELETE CASCADE)
- `OrderItemConsumption.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `PaymentAccount.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `PresetAmount.user_commerce_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `Creator.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `Creator.category_id` → `ContentCategory.id` [many-to-one]
- `Creator.main_social_network_id` → `SocialNetwork.id` [many-to-one]
- `Driver.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `Driver.vehicle_type_id` → `Vehicle.id` [many-to-one]
- `Driver.work_address_id` → `UserAddress.id` [many-to-one]
- `Foundation.address_id` → `UserAddress.id` [many-to-one]
- `Foundation.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `Merchant.address_id` → `UserAddress.id` [many-to-one]
- `Merchant.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `RecyclerBase.user_id` → `User.id` [one-to-one] (ON DELETE CASCADE)
- `RecyclerBase.address_id` → `UserAddress.id` [many-to-one]
- `StripeTopup.wallet_id` → `Wallet.id` [many-to-one]
- `StripeTopup.user_id` → `User.id` [many-to-one]
- `UserEventPass.user_id` → `User.id` [many-to-one]
- `UserEventPass.event_pass_id` → `EventPass.id` [many-to-one]
- `UserFeedback.userId` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `RechargeTransfer.payment_account_id` → `PaymentAccount.id` [many-to-one] (ON DELETE RESTRICT)
- `RechargeTransfer.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `RechargeTransfer.status_id` → `TransactionState.id` [many-to-one] (ON DELETE RESTRICT)
- `RechargeTransfer.transaction_id` → `Transaction.id` [many-to-one]
- `UserWithdraw.user_id` → `User.id` [many-to-one] (ON DELETE CASCADE)
- `UserWithdraw.wallet_id` → `Wallet.id` [many-to-one] (ON DELETE CASCADE)
- `UserWithdraw.withdraw_account_id` → `WithdrawAccount.id` [many-to-one] (ON DELETE CASCADE)
- `UserWithdraw.status_id` → `TransactionState.id` [many-to-one] (ON DELETE CASCADE)
- `UserWithdraw.transaction_id` → `Transaction.id` [one-to-one] (ON DELETE CASCADE)
- `UserEventBeland.user_payment_id` → `User.id` [many-to-one]
- `UserEventBeland.user_sale_id` → `User.id` [many-to-one]

## 4. Mapa Global (ER Diagram)

```mermaid
erDiagram
  WithdrawAccountType {
    uuid id
    varchar code
    varchar name
    text description
    timestamptz created_at
    timestamptz updated_at
  }
  WithdrawAccount {
    uuid id
    enum country
    enum currency
    String bankName
    uuid withdraw_account_type_id
    String accountNumber
    String cbu
    String alias
    String holderName
    String holderDocument
    enum holderDocumentType
    uuid user_id
    boolean is_active
    timestamptz created_at
    timestamptz updatedAt
  }
  Wallet {
    uuid id
    text address
    varchar alias
    text qr
    numeric usd_balance
    numeric locked_balance
    numeric becoin_balance
    numeric becoin_green
    numeric becoin_orange
    text private_key_encrypted
    timestamptz created_at
    uuid user_id
    uuid withdraw_account_id
  }
  GroupMember {
    uuid id
    enum role
    timestamptz created_at
    timestamptz updated_at
    uuid group_id
    uuid user_id
    decimal pending_amount_group
    decimal pending_amount_personal
    decimal pendingAmount
    boolean paied
  }
  Category {
    uuid id
    varchar name
    string created_at
  }
  GroupType {
    uuid id
    varchar name
    varchar image_url
    string created_at
  }
  InventoryItem {
    uuid id
    int quantity_available
    text offer_label
    timestamptz promotion_expires_at
    timestamptz updated_at
    uuid product_id
  }
  Product {
    uuid id
    text name
    text description
    text codbar
    numeric weight
    numeric cost
    numeric price
    int quantity
    boolean is_circular
    text image_url
    uuid category_id
    timestamptz created_at
    timestamptz deleted_at
  }
  OrderItem {
    uuid id
    integer ordered_quantity
    integer returned_quantity
    integer quantity
    numeric unit_price
    numeric total_price
    numeric unit_weight
    numeric total_weight
    timestamptz created_at
    uuid order_id
    uuid user_id
    uuid product_id
  }
  PaymentType {
    uuid id
    varchar code
    varchar description
    boolean is_active
    string created_at
    string updated_at
  }
  TransactionState {
    uuid id
    varchar code
    varchar name
    varchar color
    text description
    timestamptz created_at
    timestamptz updated_at
  }
  TransactionType {
    uuid id
    varchar code
    varchar name
    text description
    varchar color
    varchar icon
    timestamptz created_at
    timestamptz updated_at
  }
  Transaction {
    uuid id
    uuid wallet_id
    uuid type_id
    uuid status_id
    numeric amount_usd
    numeric post_balance
    numeric amount_orange
    numeric post_orange_balance
    numeric amount_green
    numeric post_green_balance
    enum external_provider
    String external_reference_id
    uuid clientTransactionId
    uuid related_wallet_id
    text reference
    timestamptz created_at
  }
  GiftCard {
    uuid id
    varchar name
    text description
    varchar image_url
    decimal amount
    varchar currency
    int expiration_days
    int sold_quantity
    boolean is_active
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
  }
  UserGiftCard {
    uuid id
    uuid gift_card_id
    uuid sender_user_id
    uuid recipient_wallet_id
    text message
    decimal original_balance
    decimal current_balance
    decimal reserved_balance
    timestamp redeemed_at
    timestamp expires_at
    timestamp last_used_at
    boolean is_active
    enum status
    timestamp created_at
    timestamp updated_at
  }
  Payment {
    uuid id
    numeric amount_paid
    timestamptz created_at
    uuid order_id
    uuid payment_type_id
    uuid transaction_id
    uuid user_id
    uuid status_id
    numeric gift_card_amount_used
    uuid user_gift_card_id
  }
  UserAddress {
    uuid id
    String user_id
    String addressLine1
    String addressLine2
    String city
    String state
    String country
    String postalCode
    decimal latitude
    decimal longitude
    Boolean isDefault
    Boolean is_active
    string created_at
    string updated_at
    string deleted_at
  }
  DeliveryStatus {
    uuid id
    varchar code
    varchar name
    text description
    timestamptz created_at
    timestamptz updated_at
  }
  Order {
    uuid id
    bigint order_number
    integer code
    boolean paied
    boolean returned_paied
    boolean returned_split
    numeric subtotal_amount
    numeric total_amount
    numeric total_amount_paied
    numeric total_amount_returned
    int total_items
    numeric total_weight
    numeric delivery_cost
    numeric distance_km
    numeric duration_min
    timestamptz recycled_at
    timestamptz collected_at
    varchar recycled_code
    varchar observation
    timestamptz delivery_at
    timestamptz delivered_at
    timestamptz cancelled_at
    timestamptz created_at
    uuid group_id
    uuid status_id
    uuid address_id
    uuid user_id
    uuid payment_type_id
  }
  GroupPrivacy {
    uuid id
    varchar code
    varchar name
    varchar description
    boolean is_visible
    boolean allow_free_join
    boolean is_active
  }
  EventPassType {
    uuid id
    varchar name
    string created_at
  }
  EventPass {
    uuid id
    varchar code
    varchar name
    text description
    text message
    varchar image_url
    varchar images_urls
    text qr
    varchar event_place
    varchar event_city
    String address
    decimal latitude
    decimal longitude
    timestamp event_date
    timestamp start_sale_date
    timestamp end_sale_date
    int limit_tickets
    int sold_tickets
    boolean available
    int attended_count
    decimal price_usd
    decimal discount
    decimal total_usd
    boolean is_refundable
    int refund_days_limit
    uuid created_by_id
    boolean is_active
    uuid type_id
    timestamp created_at
    timestamp updated_at
  }
  CartItem {
    uuid id
    uuid cart_id
    uuid product_id
    uuid user_id
    int quantity
    decimal unit_price
    decimal total_price
    numeric unit_weight
    numeric total_weight
    string created_at
  }
  Cart {
    uuid id
    uuid user_id
    uuid address_id
    uuid group_id
    uuid payment_type_id
    numeric total_amount
    numeric total_weight
    int total_items
    numeric delivery_cost
    numeric distance_km
    numeric duration_min
    timestamptz delivery_at
    string created_at
    string updated_at
  }
  Group {
    uuid id
    varchar name
    varchar description
    varchar image_url
    text message_invitation
    uuid user_address_id
    boolean is_active
    boolean is_delete
    timestamptz deleted_at
    timestamptz event_at
    timestamptz created_at
    timestamptz updated_at
    uuid user_id
    uuid group_type_id
    uuid privacy_id
    uuid payment_type_id
    uuid event_pass_id
  }
  RecycledItem {
    uuid id
    numeric weight
    timestamptz created_at
    uuid user_id
  }
  Prize {
    uuid id
    text name
    text description
    numeric cost
    text image_url
    integer stock
    timestamptz created_at
  }
  PrizeRedemption {
    uuid id
    text status
    timestamptz redemption_date
    timestamptz created_at
  }
  CouponUsage {
    uuid id
    uuid coupon_id
    uuid user_id
    numeric original_amount
    numeric discount_amount
    uuid order_id
    timestamptz used_at
  }
  Coupon {
    uuid id
    text name
    text code
    enum type
    numeric value
    numeric max_discount_cap
    numeric min_spend_required
    timestamptz expires_at
    integer max_usage_count
    integer usage_limit_per_user
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
    uuid created_by_user_id
  }
  Role {
    uuid role_id
    text name
    text description
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  Admin {
    uuid admin_id
    uuid user_id
    timestamptz assigned_at
    boolean content_permission
    boolean user_permission
    boolean moderation_permission
    boolean finance_permission
    boolean analytics_permission
    boolean settings_permission
    boolean leader_management_permission
    boolean company_management_permission
    timestamptz created_at
    timestamptz updated_at
  }
  UserCard {
    uuid id
    uuid user_id
    String email
    String phoneNumber
    String documentId
    String cardBrand
    String cardHolder
    String cardType
    int lastDigits
    String cardToken
    string created_at
    string updated_at
  }
  Testimony {
    uuid id
    text content
    int rating
    boolean is_approved
    uuid user_id
    timestamp created_at
    timestamp updated_at
    timestamp deleted_at
  }
  Profile {
    uuid id
    varchar name
    varchar description
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  UserProfile {
    uuid id
    uuid user_id
    uuid profile_id
    string created_at
  }
  User {
    uuid id
    text auth0_id
    text oauth_provider
    text email
    numeric total_weight_recycled
    text username
    text full_name
    text profile_picture_url
    numeric current_balance
    enum role_name
    text address
    varchar phone
    text country
    text city
    boolean isBlocked
    timestamptz deleted_at
    timestamptz created_at
    timestamptz updated_at
    text password
    uuid role_id
  }
  Action {
    uuid id
    text description
    text transaction_hash
    integer block_number
    timestamptz timestamp
    timestamptz created_at
    uuid user_id
  }
  AmountToPayment {
    uuid id
    uuid user_commerce_id
    numeric amount
    varchar message
    timestampwithtimezone created_at
  }
  AuthVerification {
    uuid id
    String code
    String email
    varchar username
    varchar full_name
    varchar profile_picture_url
    uuid role_id
    varchar role_name
    String passwordHashed
    String address
    varchar phone
    String country
    String city
    boolean is_verified
    timestamp expires_at
    string created_at
    string updated_at
  }
  ForgotPasswordCode {
    uuid id
    uuid user_id
    varchar code
    int count
    boolean is_verified
    timestamp expires_at
    string created_at
    string update_at
  }
  GroupMemberConsumption {
    uuid id
    uuid group_id
    uuid group_member_id
    uuid product_id
    varchar notes
    string created_at
    string updated_at
  }
  Service {
    uuid id
    varchar name
    varchar description
    decimal cost
    decimal price
    int day_limit_cancelled
    int porcent_cancelled
    varchar image_url
    boolean is_available
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  GroupService {
    uuid id
    uuid group_id
    uuid service_id
    uuid payment_type_id
    decimal total_amount
    boolean is_completed
    string created_at
    string updated_at
  }
  Hub {
    uuid id
    varchar name
    varchar legal_name
    varchar ruc
    text description
    varchar phone
    varchar email
    uuid address_id
    varchar website
    boolean is_active
    uuid user_id
    string created_at
    string updated_at
  }
  HubProduct {
    uuid id
    uuid hub_id
    uuid product_id
    int quantity
    int stock_min
  }
  OrderItemConsumption {
    uuid id
    uuid order_item_id
    uuid user_id
    timestamptz created_at
  }
  PaymentAccount {
    uuid id
    varchar name
    varchar accountHolder
    varchar bank
    varchar email
    boolean is_active
    varchar ruc
    varchar nro_account
    varchar cbu
    varchar alias
    uuid user_id
    enum type_account
    string created_at
    string updated_at
  }
  PresetAmount {
    uuid id
    String name
    decimal amount
    text message
    timestampwithtimezone created_at
    uuid user_commerce_id
  }
  ContentCategory {
    uuid id
    varchar code
    varchar name
    varchar description
    timestamptz created_at
  }
  SocialNetwork {
    uuid id
    varchar code
    varchar name
    varchar description
    timestamptz created_at
  }
  Creator {
    uuid id
    uuid user_id
    uuid category_id
    uuid main_social_network_id
    varchar bio
    varchar main_link
    int followers_count
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  Vehicle {
    uuid id
    varchar code
    varchar name
    text description
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  Driver {
    uuid id
    uuid user_id
    text motivation_bio
    text profile_tagline
    text face_image_url
    uuid vehicle_type_id
    text vehicle_description
    text vehicle_plate
    text vehicle_image_url
    boolean is_active
    uuid work_address_id
    text license_number
    float rating
    int total_deliveries
    timestamptz created_at
    timestamptz updated_at
  }
  Foundation {
    uuid id
    varchar name
    varchar legal_name
    varchar ruc
    text description
    varchar phone
    varchar email
    uuid address_id
    varchar website
    boolean is_active
    uuid user_id
    string created_at
    string updated_at
  }
  Merchant {
    uuid id
    varchar name
    varchar legal_name
    varchar ruc
    text description
    varchar phone
    varchar email
    uuid address_id
    varchar website
    boolean is_active
    uuid user_id
    string created_at
    string updated_at
  }
  RecyclerBase {
    uuid id
    uuid user_id
    uuid address_id
    varchar national_id
    boolean belongs_to_association
    varchar association_name
    boolean has_collection_center
    boolean has_mobility
    varchar mobility_description
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  StripeTopup {
    uuid id
    uuid wallet_id
    uuid recipient_wallet_id
    uuid user_id
    uuid client_transaction_id
    text payment_intent_id
    text stripe_event_id
    numeric amount_usd
    text currency
    text status
    text failure_code
    text failure_message
    text stripe_signature
    text raw_webhook_payload
    timestamptz completed_at
    timestamptz failed_at
    enum owner
    uuid owner_id
    uuid user_gift_card_id
    numeric gift_card_reserved_amount
    varchar holder_name
    varchar holder_instagram_tiktok
    varchar holder_phone
    varchar holder_email
    timestamptz created_at
    timestamptz updated_at
  }
  UserEventPass {
    uuid id
    uuid user_id
    uuid event_pass_id
    String holder_name
    String holder_instagram_tiktok
    String holder_phone
    String holder_email
    string purchase_date
    timestamp redemption_date
    Boolean is_consumed
    decimal purchase_price
    Boolean is_refunded
    timestamp refunded_at
    Boolean is_active
    string created_at
    string updated_at
  }
  UserFeedback {
    uuid id
    uuid user_id
    int rating
    text comment
    enum section
    varchar platform
    varchar app_version
    boolean reviewed
    string created_at
    string updated_at
  }
  RechargeTransfer {
    uuid id
    uuid payment_account_id
    decimal amount_usd
    varchar transfer_id
    varchar ticket_image_url
    uuid user_id
    uuid status_id
    uuid transaction_id
    decimal refunded_amount
    string created_at
    string updated_at
  }
  UserWithdraw {
    uuid id
    text observation
    varchar transaction_banck_id
    uuid user_id
    uuid wallet_id
    uuid withdraw_account_id
    decimal amount_usd
    uuid status_id
    uuid transaction_id
    timestamptz created_at
    timestamptz updated_at
  }
  UserEventBeland {
    uuid id
    uuid user_payment_id
    uuid user_sale_id
    boolean isRecycled
    numeric amount
    string created_at
  }
  WithdrawAccount }o--o| WithdrawAccountType : "withdraw_account_type"
  WithdrawAccount }o--o| User : "user"
  WithdrawAccount |o--o| Wallet : "wallet"
  Wallet |o--o| User : "user"
  Wallet |o--o| WithdrawAccount : "withdraw_account"
  GroupMember }o--o| Group : "group"
  GroupMember }o--o| User : "user"
  Category |o--o{ Product : "products"
  GroupType }o--o{ Product : "products"
  InventoryItem }o--o| Product : "product"
  Product }o--o| Category : "category"
  Product }o--o{ GroupType : "group_types"
  Product |o--o{ InventoryItem : "inventory_items"
  Product |o--o{ OrderItem : "order_items"
  OrderItem }o--o| Order : "order"
  OrderItem }o--o| User : "user"
  OrderItem }o--o| Product : "product"
  PaymentType |o--o{ Order : "orders"
  PaymentType |o--o{ Order : "carts"
  TransactionState |o--o{ Transaction : "transactions"
  TransactionType |o--o{ Transaction : "transactions"
  Transaction }o--o| Wallet : "wallet"
  Transaction }o--o| TransactionType : "type"
  Transaction }o--o| TransactionState : "status"
  Transaction }o--o| Wallet : "related_wallet"
  UserGiftCard }o--o| GiftCard : "gift_card"
  UserGiftCard }o--o| User : "sender_user"
  UserGiftCard }o--o| Wallet : "recipient_wallet"
  Payment }o--o| Order : "order"
  Payment }o--o| PaymentType : "payment_type"
  Payment }o--o| Transaction : "transaction"
  Payment }o--o| User : "user"
  Payment }o--o| TransactionState : "status"
  Payment }o--o| UserGiftCard : "user_gift_card"
  UserAddress }o--o| User : "user"
  UserAddress |o--o{ Order : "orders"
  Order }o--o| Group : "group"
  Order }o--o| DeliveryStatus : "status"
  Order }o--o| UserAddress : "address"
  Order }o--o| User : "user"
  Order }o--o| PaymentType : "payment_type"
  Order |o--o{ OrderItem : "items"
  Order |o--o{ Payment : "payments"
  EventPass }o--o| User : "created_by"
  EventPass }o--o| EventPassType : "type"
  EventPass |o--o| Group : "group"
  CartItem }o--o| Cart : "cart"
  CartItem }o--o| Product : "product"
  CartItem }o--o| User : "user"
  Cart |o--o| User : "user"
  Cart }o--o| UserAddress : "address"
  Cart |o--o| Group : "group"
  Cart }o--o| PaymentType : "payment_type"
  Cart |o--o{ CartItem : "items"
  Group }o--o| UserAddress : "user_address"
  Group }o--o| User : "user"
  Group }o--o| GroupType : "group_type"
  Group }o--o| GroupPrivacy : "privacy"
  Group }o--o| PaymentType : "payment_type"
  Group |o--o| EventPass : "event_pass"
  Group |o--o{ GroupMember : "members"
  Group |o--o{ Order : "orders"
  Group |o--o| Cart : "cart"
  RecycledItem }o--o| User : "user"
  Prize |o--o{ PrizeRedemption : "redemptions"
  PrizeRedemption }o--o| User : "user"
  PrizeRedemption }o--o| Prize : "prize"
  CouponUsage }o--o| Coupon : "coupon"
  CouponUsage }o--o| User : "user"
  Coupon }o--o| User : "created_by_user"
  Coupon |o--o{ CouponUsage : "usages"
  Role |o--o{ User : "users"
  Admin |o--o| User : "user"
  UserCard }o--o| User : "user"
  Testimony }o--o| User : "user"
  Profile |o--o{ UserProfile : "users"
  UserProfile }o--o| User : "user"
  UserProfile }o--o| Profile : "profile"
  User }o--o| Role : "role"
  User |o--o| Admin : "admin"
  User |o--o| Cart : "cart"
  User |o--o| Wallet : "wallet"
  User |o--o{ Group : "led_groups"
  User |o--o{ GroupMember : "group_memberships"
  User |o--o{ Testimony : "testimonies"
  User |o--o{ Order : "orders"
  User |o--o{ Payment : "payments"
  User |o--o{ Action : "actions"
  User |o--o{ RecycledItem : "recycledItems"
  User |o--o{ PrizeRedemption : "prize_redemptions"
  User |o--o{ Coupon : "created_coupons"
  User |o--o{ CouponUsage : "coupon_usages"
  User |o--o{ UserAddress : "addresses"
  User |o--o{ UserCard : "cards"
  User |o--o{ WithdrawAccount : "withdraw_accounts"
  User |o--o{ UserProfile : "profiles"
  Action }o--o| User : "user"
  AmountToPayment }o--o| User : "user_commerce"
  AuthVerification }o--o| Role : "role"
  ForgotPasswordCode }o--o| User : "user"
  GroupMemberConsumption }o--o| Group : "group"
  GroupMemberConsumption }o--o| GroupMember : "groupMember"
  GroupMemberConsumption }o--o| Product : "product"
  GroupService }o--o| Group : "group"
  GroupService }o--o| Service : "service"
  GroupService }o--o| PaymentType : "payment_type"
  Hub }o--o| UserAddress : "address"
  Hub |o--o| User : "user"
  Hub |o--o{ HubProduct : "products"
  HubProduct }o--o| Hub : "hub"
  HubProduct }o--o| Product : "product"
  OrderItemConsumption }o--o| OrderItem : "order_item"
  OrderItemConsumption }o--o| User : "user"
  PaymentAccount }o--o| User : "user"
  PresetAmount }o--o| User : "user_commerce"
  Creator |o--o| User : "user"
  Creator }o--o| ContentCategory : "category"
  Creator }o--o| SocialNetwork : "main_social_network"
  Driver |o--o| User : "user"
  Driver }o--o| Vehicle : "vehicle_type"
  Driver }o--o| UserAddress : "work_address"
  Foundation }o--o| UserAddress : "address"
  Foundation |o--o| User : "user"
  Merchant }o--o| UserAddress : "address"
  Merchant |o--o| User : "user"
  RecyclerBase |o--o| User : "user"
  RecyclerBase }o--o| UserAddress : "address"
  StripeTopup }o--o| Wallet : "wallet"
  StripeTopup }o--o| User : "user"
  UserEventPass }o--o| User : "user"
  UserEventPass }o--o| EventPass : "event_pass"
  UserFeedback }o--o| User : "user"
  RechargeTransfer }o--o| PaymentAccount : "paymentAccount"
  RechargeTransfer }o--o| User : "user"
  RechargeTransfer }o--o| TransactionState : "status"
  RechargeTransfer }o--o| Transaction : "transaction"
  UserWithdraw }o--o| User : "user"
  UserWithdraw }o--o| Wallet : "wallet"
  UserWithdraw }o--o| WithdrawAccount : "withdraw_account"
  UserWithdraw }o--o| TransactionState : "status"
  UserWithdraw |o--o| Transaction : "transaction"
  UserEventBeland }o--o| User : "user_payment"
  UserEventBeland }o--o| User : "user_sale"
```
