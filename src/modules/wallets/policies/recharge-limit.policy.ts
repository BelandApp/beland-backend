import { Injectable, ConflictException } from '@nestjs/common';
import { Wallet } from '../entities/wallet.entity';
import { SuperadminConfigService } from '../../superadmin-config/superadmin-config.service';

@Injectable()
export class RechargeLimitPolicy {
  constructor(private readonly superadminConfig: SuperadminConfigService) {}

  /**
   * Calculates the remaining quota a user can recharge.
   */
  getAvailableRechargeQuota(wallet: Wallet): number {
    const limit = this.superadminConfig.recharge_limit;
    const currentBalance = Number(wallet.usd_balance);
    const quota = limit - currentBalance;
    return quota > 0 ? quota : 0;
  }

  /**
   * Asserts that a recharge is within limits.
   * This should be used when the amount is fixed and must not exceed the limit.
   */
  assertRechargeWithinLimits(wallet: Wallet, amountUsd: number): void {
    const quota = this.getAvailableRechargeQuota(wallet);
    if (amountUsd > quota) {
      throw new ConflictException(
        `El monto de recarga excede el límite permitido. Saldo actual: ${wallet.usd_balance} USD. Límite máximo: ${this.superadminConfig.recharge_limit} USD.`
      );
    }
  }

  /**
   * Asserts that the wallet has at least some quota to recharge.
   * Useful for early validations (e.g. before submitting a manual transfer receipt).
   */
  assertHasRechargeQuota(wallet: Wallet): void {
    const quota = this.getAvailableRechargeQuota(wallet);
    if (quota <= 0) {
      throw new ConflictException(
        `No puedes realizar recargas. Ya has alcanzado el límite máximo de ${this.superadminConfig.recharge_limit} USD para consumos futuros.`
      );
    }
  }
}
