import { Module } from '@nestjs/common';
import { DatabaseInitService } from './database-init.service';
import { DefaultRolesSeeder } from './seeders/default-roles.seeder';
import { SuperAdminUserSeeder } from './seeders/superadmin-user.seeder';
import { RolesModule } from '../../modules/roles/roles.module'; // Ruta relativa ajustada
import { UsersModule } from '../../modules/users/users.module'; // Ruta relativa ajustada
import { ConfigModule } from '@nestjs/config'; // Necesario para ConfigService
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { GroupType } from 'src/modules/group-type/entities/group-type.entity';
import { ResourcesType } from 'src/modules/resources-types/entities/resources-type.entity';
import { WithdrawAccountType } from 'src/modules/withdraw-account-type/entities/withdraw-account-type.entity';
import { DatabaseIntiController } from './database-init.controller';

@Module({
  imports: [
    RolesModule,
    UsersModule,
    ConfigModule, // Asegúrate de que ConfigModule esté importado aquí o globalmente
    TypeOrmModule.forFeature([TransactionState, TransactionType, Product, PaymentType, Category, GroupType,
      ResourcesType, WithdrawAccountType
    ])
  ],
  controllers: [DatabaseIntiController],
  providers: [
    DatabaseInitService,
    DefaultRolesSeeder,
    SuperAdminUserSeeder,
    // Aquí puedes añadir otros servicios de inicialización general si los tuvieras
  ],
  exports: [DatabaseInitService],
})
export class DatabaseInitModule {}
