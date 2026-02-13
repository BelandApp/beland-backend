import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Comentado para inhabilitar el módulo de Throttler
// import {
//   ThrottlerModule,
//   ThrottlerModuleOptions,
//   ThrottlerGuard,
// } from '@nestjs/throttler';
// Comentado para inhabilitar el guard de Throttler
// import { APP_GUARD } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { PrizeRedemptionsModule } from './modules/prize-redemptions/prize-redemptions.module';
import { PrizesModule } from './modules/prizes/prizes.module';
import { RecycledItemsModule } from './modules/recycled-items/recycled-items.module';
import { ActionsModule } from './modules/actions/actions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InventoryItemsModule } from './modules/inventory-items/inventory-items.module';
import { ProductsModule } from './modules/products/products.module';
import { GroupMembersModule } from './modules/group-members/group-members.module';
import { GroupsModule } from './modules/groups/groups.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { DatabaseModule } from './database/database.module';
import { DataSourceOptions } from 'typeorm';
//import typeormConfig from './config/typeorm'; // Asegúrate de que este archivo exista y exporte la configuración
import { RequestLoggerMiddleware } from './middlleware/request-logger.middleware'; // Asegúrate de que este archivo exista
import { TransactionsModule } from './modules/transactions/transactions.module';
import { RecyclePricesModule } from './modules/recycle_prices/recycle_prices.module';
import { TransactionTypeModule } from './modules/transaction-type/transaction-type.module';
import { TransactionStateModule } from './modules/transaction-state/transaction-state.module';
import { DatabaseInitModule } from './database/init/database-init.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from './modules/admins/admins.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { UserCardsModule } from './modules/user-cards/user-cards.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { PaymentTypesModule } from './modules/payment-types/payment-types.module';
import { CategoryModule } from './modules/category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupTypeModule } from './modules/group-type/group-type.module';
import { EmailModule } from './modules/email/email.module';
import { SuperadminModule } from './modules/superadmin-config/superadmin-config.module';
import { WithdrawAccountModule } from './modules/withdraw-account/withdraw-account.module';
import { WithdrawAccountTypeModule } from './modules/withdraw-account-type/withdraw-account-type.module';
import { UserWithdrawModule } from './modules/user-withdraw/user-withdraw.module';
import { AmountToPaymentModule } from './modules/amount-to-payment/amount-to-payment.module';
import { PresetAmountModule } from './modules/preset-amount/preset-amount.module';
import { NotificationsSocketModule } from './modules/notification-socket/notification-socket.module';
import { TestimoniesModule } from './modules/testimonies/testimonies.module';
import { UserFeedbackModule } from './modules/user-feedback/user-feedback.module';
import { UserRechargeModule } from './modules/user-recharge/user-recharge.module';
import { PaymentAccountModule } from './modules/payment-account/payment-account.module';
import { DeliveryStatusModule } from './modules/delivery-status/delivery-status.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EventPassModule } from './modules/event-pass/event-pass.module';
import { UserEventPassModule } from './modules/user-event-pass/user-event-pass.module';
import { TopupModule } from './modules/topup/topup.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { DriversModule } from './modules/profiles/drivers/drivers.module';
import { MerchantsModule } from './modules/profiles/merchants/merchants.module';
import { HubsModule } from './modules/profiles/hubs/hubs.module';
import { FoundationsModule } from './modules/profiles/foundations/foundations.module';
import { RecyclersModule } from './modules/profiles/recyclers/recyclers.module';
import { HubProductsModule } from './modules/hub-product/hub-product.module';
import { CreatorsModule } from './modules/profiles/creators/creators.module';
import { ServicesModule } from './modules/services/services.module';
import { GroupMembersConsumptionModule } from './modules/group-members-consumption/group-members-consumption.module';
import { GroupService } from './modules/group-services/entities/group-service.entity';
import { GroupServicesModule } from './modules/group-services/group-services.module';
const isTs = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [typeormConfig],
    }),
    // modulo para generar los token
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: { expiresIn: '12h' },
        };
      },
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
    //     throttlers: [
    //       {
    //         ttl: config.get<number>('THROTTLE_TTL', 60),
    //         limit: config.get<number>('THROTTLE_LIMIT', 10),
    //       },
    //     ],
    //   }),
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DataSourceOptions => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        logging: true,
        ssl: isTs ? false : { rejectUnauthorized: false },

        extra: {
          max: 5, 
        },
      }),
    }),

    //  hola agragar algo
    ScheduleModule.forRoot(),

    DatabaseModule,
    DatabaseInitModule,
    UsersModule,
    RolesModule,
    WalletsModule,
    GroupsModule,
    GroupMembersModule,
    ProductsModule,
    InventoryItemsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    ActionsModule,
    RecycledItemsModule,
    PrizesModule,
    PrizeRedemptionsModule,
    CouponsModule,
    AuthModule,
    CommonModule,
    TransactionsModule,
    RecyclePricesModule,
    TransactionTypeModule,
    TransactionStateModule,
    AdminsModule,
    CartModule,
    CartItemsModule,
    UserCardsModule,
    UserAddressModule,
    PaymentTypesModule,
    CategoryModule,
    GroupTypeModule,
    EmailModule,
    WithdrawAccountModule,
    WithdrawAccountTypeModule,
    UserWithdrawModule,
    AmountToPaymentModule,
    PresetAmountModule,
    NotificationsSocketModule,
    TestimoniesModule,
    SuperadminModule,
    UserFeedbackModule,
    UserRechargeModule,
    PaymentAccountModule,
    DeliveryStatusModule,
    PaymentAccountModule,
    CloudinaryModule, 
    EventPassModule,
    UserEventPassModule,
    TopupModule,
    DeliveryModule,
    DriversModule,
    MerchantsModule,
    HubsModule,
    FoundationsModule,
    RecyclersModule,
    HubProductsModule,
    CreatorsModule,
    ServicesModule,
    GroupMembersConsumptionModule,
    GroupServicesModule,
  ],
  controllers: [],
  providers: [
    // Comentado para inhabilitar el guard de Throttler. para deploy
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
