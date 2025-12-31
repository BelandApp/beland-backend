import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

// Seeders
import { DefaultRolesSeeder } from './seeders/default-roles.seeder';
import { SuperAdminUserSeeder } from './seeders/superadmin-user.seeder';
// JSON
import preloadTT from './json/transactionsType.json';
import preloadTS from './json/transactionState.json';
import preloadProduct from './json/products.json';
import preloadPaymentType from './json/paymentType.json';
import preloadGroupType from './json/groupType.json';
import preloadWithdrawAccountType from './json/withdrawAccountType.json';
import preloadDelivery from './json/deliveryStatus.json'
import preloadTypeEvent from './json/eventType.json'
import preloadProfiles from './json/profiles.json'
import preloadVehicleType from './json/vehicleType.json'
import preloadSocialNetwork from './json/socialNetwork.json'
import preloadContentCategoty from './json/contentCategories.json'
import preloadGroupPrivacy from './json/groupPrivacy.json'
import preloadService from './json/servivice.json'

// Entidades
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { GroupType } from 'src/modules/group-type/entities/group-type.entity';
import { WithdrawAccountType } from 'src/modules/withdraw-account-type/entities/withdraw-account-type.entity';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { DeliveryStatus } from 'src/modules/delivery-status/entities/delivery-status.entity';
import { EventPassType } from 'src/modules/event-pass/entities/event-pass-type.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { Vehicle } from 'src/modules/profiles/drivers/entities/vehicle.entity';
import { ContentCategory } from 'src/modules/profiles/creators/entities/content-category.entity';
import { SocialNetwork } from 'src/modules/profiles/creators/entities/social-network.entity';
import { GroupPrivacy } from 'src/modules/groups/entities/group-privacy.entity';
import { Service } from 'src/modules/services/entities/service.entity';

@Injectable()
export class DatabaseInitService {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
    private readonly defaultRolesSeeder: DefaultRolesSeeder,
    private readonly superAdminUserSeeder: SuperAdminUserSeeder,
  ) {}

  private getRepo<T>(entity: any): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  private async preload<T>(
    dataArray: Partial<T>[],
    entity: any,
    compareKey: keyof T,
    logLabel: string,
  ): Promise<void> {
    try {
      const repository = this.getRepo<T>(entity);
      let count = 0;

      for (const item of dataArray) {
        const where = { [compareKey]: item[compareKey] } as any;
        const existing = await repository.findOne({ where });
        if (!existing) {
          await repository.save(item as T);
          count++;
        }
      }

      console.log(`Se agregaron ${count} ${logLabel}`);
    } catch (error) {
      console.error(
        `Error al cargar ${logLabel}: ${JSON.stringify(error)}`,
      );
    }
  }

  private async preloadProd(): Promise<void> {
    try {
      const productRepo = this.getRepo<Product>(Product);
      const catRepo = this.getRepo<Category>(Category);

      let count = 0;
      let countCat = 0;

      for (const product of preloadProduct) {
        const prod = await productRepo.findOneBy({ name: product.name });
        if (!prod) {
          let cat = await catRepo.findOneBy({ name: product.category });
          if (!cat) {
            cat = await catRepo.save({ name: product.category });
            countCat++;
          }
          const { category, ...saveProduct } = product;
          await productRepo.save({ ...saveProduct, category_id: cat.id });
          count++;
        }
      }

      console.log(`Se agregaron ${countCat} Categorias`);
      console.log(`Se agregaron ${count} Productos`);
    } catch (error) {
      console.error(
        `Error al cargar Productos: ${JSON.stringify(error)}`,
      );
    }
  }

  async addBecoinProd(): Promise<void> {
    try {
      const productRepo = this.getRepo<Product>(Product);
      const products = await productRepo.find();
      let count = 0;

      for (const product of products) {
          product.price_becoin = +product.price / +this.superadminConfig.getPriceOneBecoin();
          await productRepo.save(product);
          count++;
        }
      console.log(`Se actualizaron ${count} Productos`);
    } catch (error) {
      console.error(
        `Error al cargar Productos: ${JSON.stringify(error)}`,
      );
    }
  }

  async loadUser(): Promise<void> {

  }

  async dataInitEntryUpdate () {
    this.logger.log('🚀 Iniciando procesos de carga de datos...');

    try {

      await this.preload<TransactionType>(
        preloadTT,
        TransactionType,
        'code',
        'Tipos de Transacciones',
      );
      await this.preload<TransactionState>(
        preloadTS,
        TransactionState,
        'code',
        'Estados de Transacciones',
      );
      await this.preload<GroupPrivacy>(
        preloadGroupPrivacy,
        GroupPrivacy,
        'code',
        'Tipos de privacidad de Grupos',
      );
      await this.preload<Service>(
        preloadService,
        Service,
        'name',
        'Servicios',
      );
      await this.preload<Profile>(
        preloadProfiles,
        Profile,
        'name',
        'Perfiles de Usuario',
      );
      await this.preloadProd();
      await this.preload<PaymentType>(
        preloadPaymentType,
        PaymentType,
        'code',
        'Formas de Pago',
      );
      await this.preload<GroupType>(
        preloadGroupType,
        GroupType,
        'name',
        'Tipos de Grupos',
      );
      await this.preload<Vehicle>(
        preloadVehicleType,
        Vehicle,
        'code',
        'Tipos de Vehiculos',
      );
      await this.preload<ContentCategory>(
        preloadContentCategoty,
        ContentCategory,
        'code',
        'Categorias de Contenido',
      );
      await this.preload<SocialNetwork>(
        preloadSocialNetwork,
        SocialNetwork,
        'code',
        'Redes Sociales',
      );
      await this.preload<EventPassType>(
        preloadTypeEvent,
        EventPassType,
        'name',
        'Tipos de Eventos',
      );
      await this.preload<WithdrawAccountType>(
        preloadWithdrawAccountType,
        WithdrawAccountType,
        'code',
        'Tipos de Cuentas para Retiros',
      );
      await this.preload<DeliveryStatus>(
        preloadDelivery,
        DeliveryStatus,
        'code',
        'Tipos de Estados de delivery de Ordenes',
      );
      this.logger.log('✅ Inicialización completada exitosamente.');
    } catch (error: any) {
      this.logger.error(
        `❌ Error durante la inicialización: ${error.message}`,
        error.stack,
      );
    }
  }

  async loadSuperAdminAndRole () {
     this.logger.log('🚀 Iniciando procesos de carga del superadmin...');

    try {
    
      await this.defaultRolesSeeder.seed();
      await this.superAdminUserSeeder.seed();

      this.logger.log('✅ Inicialización completada exitosamente.');
    } catch (error: any) {
      this.logger.error(
        `❌ Error durante la inicialización: ${error.message}`,
        error.stack,
      );
    }
  }

}

