import { Injectable, OnModuleInit } from '@nestjs/common'; 
import { WalletsRepository } from 'src/modules/wallets/wallets.repository';

@Injectable()
export class SuperadminConfigService implements OnModuleInit {
  private superadminWalletId: string;
  private readonly priceOneBecoin = 0.05;
  private readonly priceDelivery = 2.5;


  constructor(private readonly walletRepository: WalletsRepository) {}

  async onModuleInit() {
    // Podés cambiar el criterio de búsqueda si lo manejás con un flag en la DB
     const superadminWallet = await this.walletRepository.findSuperadminWallet();
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

