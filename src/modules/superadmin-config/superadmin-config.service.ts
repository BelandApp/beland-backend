import { Injectable, OnModuleInit } from '@nestjs/common'; 
import { DataSource } from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';
import { RoleEnum } from '../roles/enum/role-validate.enum';

@Injectable()
export class SuperadminConfigService implements OnModuleInit {
  private superadminWalletId: string;
  private readonly priceOneBecoin = 0.05;
  private readonly priceDelivery = 2.5;


  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    // Podés cambiar el criterio de búsqueda si lo manejás con un flag en la DB
     const superadminWallet = await this.dataSource.manager.findOne(Wallet, {
           where: { user: {role: {name: RoleEnum.SUPERADMIN}} },
         });
     if (superadminWallet) {
       this.superadminWalletId = superadminWallet.id;
     }
  }

  getWalletId(): string {
    return this.superadminWalletId;
  }

  getPriceOneBecoin(): number {
    return this.priceOneBecoin;
  }

  getPriceDelivery(): number {
    return this.priceDelivery;
  }
}

