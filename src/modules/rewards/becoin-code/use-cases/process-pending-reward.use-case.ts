import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RewardRedemption, RedemptionStatus } from '../entities/reward-redemption.entity';
import { GenerateOrangeRewardUseCase } from '../../becoin-orange/use-cases/generate-orange-reward.use-case';

@Injectable()
export class ProcessPendingRewardUseCase {
  private readonly logger = new Logger(ProcessPendingRewardUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly generateOrangeRewardUseCase: GenerateOrangeRewardUseCase,
  ) {}

  async execute(email: string, userId: string, walletId: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();

    // Use a new dedicated transaction to decouple from the user creation transaction
    await this.dataSource.transaction(async (manager) => {
      // 1. Encontrar la redención pendiente con bloqueo pesimista para evitar concurrencia
      const pendingRedemption = await manager.findOne(RewardRedemption, {
        where: { email: normalizedEmail, status: RedemptionStatus.PENDING },
        lock: { mode: 'pessimistic_write' },
      });

      if (!pendingRedemption) {
        return; // No hay recompensa pendiente
      }

      this.logger.log(`Procesando recompensa pendiente para el email ${normalizedEmail} (Redemption ID: ${pendingRedemption.id})`);

      // 2. Verificar que exista un claimed_amount válido
      if (pendingRedemption.claimed_amount == null || pendingRedemption.claimed_amount <= 0) {
        throw new Error('La recompensa pendiente no tiene un claimed_amount válido.');
      }

      // 3. Acreditar Orange BeCoins
      // Usamos el manager actual para garantizar atomicidad de ESTA transacción
      await this.generateOrangeRewardUseCase.execute(
        manager,
        walletId,
        Number(pendingRedemption.claimed_amount),
        `Recompensa pendiente aplicada por creación de cuenta`,
        pendingRedemption.reward_code_id
      );

      // 4. Actualizar la redención a APPLIED y asociar al nuevo usuario
      pendingRedemption.status = RedemptionStatus.APPLIED;
      pendingRedemption.user_id = userId;
      await manager.save(RewardRedemption, pendingRedemption);

      this.logger.log(`Recompensa pendiente aplicada exitosamente para ${normalizedEmail}`);
    });
  }
}
