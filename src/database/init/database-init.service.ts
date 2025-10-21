import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

// Seeders
import { DefaultRolesSeeder } from './seeders/default-roles.seeder';
import { SuperAdminUserSeeder } from './seeders/superadmin-user.seeder';
import * as QRCode from 'qrcode';
// JSON
import preloadTT from './json/transactionsType.json';
import preloadTS from './json/transactionState.json';
import preloadProduct from './json/products.json';
import preloadPaymentType from './json/paymentType.json';
import preloadGroupType from './json/groupType.json';
import preloadResourceType from './json/resourceType.json';
import preloadWithdrawAccountType from './json/withdrawAccountType.json';
import preloadResource from './json/resource.json'
import preloadResourceSuperAdmin from './json/resourceSuperadmin.json'
import preloadDelivery from './json/deliveryStatus.json'
import preloadTypeEvent from './json/eventType.json'

// Entidades
import { TransactionType } from 'src/modules/transaction-type/entities/transaction-type.entity';
import { TransactionState } from 'src/modules/transaction-state/entities/transaction-state.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaymentType } from 'src/modules/payment-types/entities/payment-type.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { GroupType } from 'src/modules/group-type/entities/group-type.entity';
import { ResourcesType } from 'src/modules/resources-types/entities/resources-type.entity';
import { WithdrawAccountType } from 'src/modules/withdraw-account-type/entities/withdraw-account-type.entity';
import { Resource } from 'src/modules/resources/entities/resource.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { SuperadminConfigService } from 'src/modules/superadmin-config/superadmin-config.service';
import { RoleEnum } from 'src/modules/roles/enum/role-validate.enum';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { DeliveryStatus } from 'src/modules/delivery-status/entities/delivery-status.entity';
import { EventPassType } from 'src/modules/event-pass/entities/event-pass-type.entity';

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

  async loadResourceByUser (email: string): Promise <void> {
    const user = await this.dataSource.manager.findOne(User, {
      where: {email},
    })

    if ((user.role_name === 'USER') || !user) return;

    let count = 0;
    const resourceRepo = this.dataSource.getRepository(Resource);
    const typeRepo = this.dataSource.getRepository(ResourcesType);
    const primerasTres = email.substring(0, 3).toUpperCase();
    for (const resource of preloadResource) {
      const codeResource = resource.code+primerasTres
      const res = await resourceRepo.findOneBy({ code: codeResource });
      if (!res) {
        const resType = await typeRepo.findOneBy({ code: resource.type });
        if (resType)
          {const { type, code, ...save } = resource;
          await resourceRepo.save({ ...save, code: codeResource, resource_type_id: resType.id, user_commerce_id: user.id });
          count++;}
      }
    }
    console.log(`Se agregaron ${count} Recursos para el usuario ${email}`);
  }

  async loadResourceSuperadmin (): Promise <void> {
    const user = await this.dataSource.manager.findOne(User, {
      where: {role_name: RoleEnum.SUPERADMIN},
    })

    let count = 0;
    const resourceRepo = this.dataSource.getRepository(Resource);
    const typeRepo = this.dataSource.getRepository(ResourcesType);
    for (const resource of preloadResourceSuperAdmin) {
      const res = await resourceRepo.findOneBy({ code: resource.code });
      if (!res) {
        const resType = await typeRepo.findOneBy({ code: resource.type });
        if (resType)
          {const { type, ...save } = resource;
          await resourceRepo.save({ ...save, resource_type_id: resType.id, user_commerce_id: user.id });
          count++;}
      }
    }
    console.log(`Se agregaron ${count} Recursos para el usuario ${user.email}`);
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
      await this.preload<EventPassType>(
        preloadTypeEvent,
        EventPassType,
        'name',
        'Tipos de Eventos',
      );
      await this.preload<ResourcesType>(
        preloadResourceType,
        ResourcesType,
        'code',
        'Tipos de Recursos',
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


    async momentaneo() {
  return await this.dataSource.manager.update(
    Wallet,
    { id: "aaa410a7-9921-4d53-8af5-8ef942f88b5b" },
    {
      qr: await QRCode.toDataURL("aaa410a7-9921-4d53-8af5-8ef942f88b5b"),
    }
  );
}
}
