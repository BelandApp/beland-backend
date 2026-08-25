import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExperiencePurchase } from '../entities/experience-purchase.entity';
import { GenerateOrangeRewardUseCase } from '../../rewards/becoin-orange/use-cases/generate-orange-reward.use-case';

@Injectable()
export class ProcessPendingPurchasesUseCase {
  private readonly logger = new Logger(ProcessPendingPurchasesUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly generateOrangeRewardUseCase: GenerateOrangeRewardUseCase,
  ) {}

  async execute(email: string, phone: string, userId: string, walletId: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    // Normalizar teléfono si es necesario
    const normalizedPhone = phone.trim();

    await this.dataSource.transaction(async (manager) => {
      // 1. Encontrar las compras pendientes con bloqueo pesimista
      const pendingPurchases = await manager.find(ExperiencePurchase, {
        where: [
          { email: normalizedEmail, orange_reward_credited: false },
          { phone: normalizedPhone, orange_reward_credited: false }
        ],
        lock: { mode: 'pessimistic_write' },
      });

      if (!pendingPurchases || pendingPurchases.length === 0) {
        return; // No hay recompensas pendientes
      }

      this.logger.log(`Procesando ${pendingPurchases.length} compras pendientes para email: ${normalizedEmail}, phone: ${normalizedPhone}`);

      for (const purchase of pendingPurchases) {
        // Verificar que cumpla las condiciones (orange_reward_amount > 0 y status en PAGADO o ENTREGADO)
        if (purchase.orange_reward_amount > 0 && (purchase.status === 'PAGADO' || purchase.status === 'ENTREGADO')) {
          
          this.logger.log(`Acreditando ${purchase.orange_reward_amount} Orange por compra ${purchase.id}`);

          // Acreditar Orange BeCoins
          await this.generateOrangeRewardUseCase.execute(
            manager,
            walletId,
            Number(purchase.orange_reward_amount),
            `Cashback pendiente de compra/reserva Experience`,
            purchase.id
          );

          // Actualizar a acreditado
          purchase.orange_reward_credited = true;
          // Actualizar email y teléfono por si entraron por un solo match (para unificarlos al usuario registrado)
          purchase.email = normalizedEmail;
          purchase.phone = normalizedPhone;
          
          await manager.save(ExperiencePurchase, purchase);
        }
      }

      this.logger.log(`Recompensas pendientes procesadas exitosamente.`);
    });
  }
}
