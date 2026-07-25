import { Injectable, OnModuleInit } from '@nestjs/common'; 
import { DataSource } from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';
import { RoleEnum } from '../roles/enum/role-validate.enum';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';

@Injectable()
export class SuperadminConfigService implements OnModuleInit {
  private superadminWalletId: string;
  private superadminId: string;
  private superadminEmail: string;
  private readonly priceOneBecoin = 0.05;
  private readonly priceDelivery = 1.5;
  public readonly recicled_becoin = 2;
  public readonly recharge_limit = 100;
  public readonly recharge_commission_payphone = 0.06;
  public readonly recharge_commission_stripe = 0.06;
  public readonly recharge_commission_transfer = 0.03;
  
  public readonly max_orange_discount_percent = 0.15;
 

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    // Podés cambiar el criterio de búsqueda si lo manejás con un flag en la DB
     const superadminWallet = await this.dataSource.manager.findOne(Wallet, {
           where: { user: {role: {name: RoleEnum.SUPERADMIN}} },
           relations: {user:true}
         });
     if (superadminWallet) {
       this.superadminWalletId = superadminWallet.id;
       this.superadminId = superadminWallet.user_id;
       this.superadminEmail = superadminWallet.user.email;
     }
  }

  getWalletId(): string {
    return this.superadminWalletId;
  }

  getSuperadminId(): string {
    return this.superadminId;
  }

  getPriceOneBecoin(): number {
    return this.priceOneBecoin;
  }

  getPriceDelivery(): number {
    return this.priceDelivery;
  }

  getEmail(): string {
    return this.superadminEmail;
  }

  getRechargeCommission(provider: PaymentProviderEnum): number {
  switch (provider) {
    case PaymentProviderEnum.PAYPHONE:
      return Number(this.recharge_commission_payphone);

    case PaymentProviderEnum.STRIPE:
      return Number(this.recharge_commission_stripe);

    case PaymentProviderEnum.TRANSFER:
      return Number(this.recharge_commission_transfer);

    default:
      return 0;
  }
}

  getMaxOrangeDiscountPercent(): number {
    return Number(this.max_orange_discount_percent);
  }
}

