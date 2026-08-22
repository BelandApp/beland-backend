import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RewardCode } from './entities/reward-code.entity';
import { RewardRedemption, RedemptionStatus } from './entities/reward-redemption.entity';
import { User } from '../../users/entities/users.entity';
import { ClaimRewardDto } from './dto/claim-reward.dto';
import { GenerateOrangeRewardUseCase } from '../becoin-orange/use-cases/generate-orange-reward.use-case';

@Injectable()
export class BecoinCodeService {
  private readonly logger = new Logger(BecoinCodeService.name);

  constructor(
    @InjectRepository(RewardCode)
    private readonly rewardCodeRepo: Repository<RewardCode>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly generateOrangeRewardUseCase: GenerateOrangeRewardUseCase,
  ) {}

  async claimReward(dto: ClaimRewardDto) {
    const codeStr = dto.code.trim().toUpperCase();
    const emailStr = dto.gmail.trim().toLowerCase();

    // 1. Buscar el RewardCode
    const rewardCode = await this.rewardCodeRepo.findOne({
      where: { code: codeStr },
    });

    if (!rewardCode) {
      throw new BadRequestException('El código ingresado no existe.');
    }

    if (!rewardCode.is_active) {
      throw new BadRequestException('El código ingresado ya no está activo.');
    }

    // 2. Buscar si el usuario existe para asociarlo y premiarlo de inmediato
    const user = await this.userRepo.findOne({
      where: { email: emailStr },
      relations: ['wallet'],
    });

    try {
      // Usamos una transaccion para garantizar la consistencia
      return await this.dataSource.transaction(async (manager) => {
        // Validar límite global de usos del código si aplica (opcional)
        if (rewardCode.max_uses !== null) {
          const totalUses = await manager.count(RewardRedemption, {
            where: { reward_code_id: rewardCode.id },
          });
          if (totalUses >= rewardCode.max_uses) {
            throw new BadRequestException('El código ha superado su límite máximo de usos.');
          }
        }

        const redemption = manager.create(RewardRedemption, {
          email: emailStr,
          reward_code_id: rewardCode.id,
          user_id: user ? user.id : null,
          status: RedemptionStatus.PENDING,
        });

        // Al intentar guardar, si el email ya existe, PostgreSQL lanzará un error de unicidad.
        // Esto protege contra concurrencia.
        await manager.save(RewardRedemption, redemption);

        // Si el usuario existe, acreditamos el premio
        if (user) {
          if (!user.wallet) {
            this.logger.warn(`El usuario ${user.id} no tiene wallet. Se dejará la recompensa PENDING.`);
            // Si el backend espera que siempre haya wallet pero por alguna razón no hay,
            // no podemos inyectar. Lo dejamos en PENDING para que la Etapa 3 o soporte lo resuelva.
            return {
              status: RedemptionStatus.PENDING,
              message: 'Recompensa registrada. Pendiente de creación de Wallet.',
              amount: rewardCode.amount,
            };
          }

          // Utilizamos el caso de uso existente para inyectar Orange BeCoins de manera segura
          await this.generateOrangeRewardUseCase.execute(
            manager,
            user.wallet.id,
            Number(rewardCode.amount),
            `Recompensa por código promocional: ${codeStr}`,
            rewardCode.id
          );

          // Marcamos como aplicada
          redemption.status = RedemptionStatus.APPLIED;
          await manager.save(RewardRedemption, redemption);

          return {
            status: RedemptionStatus.APPLIED,
            message: 'Recompensa acreditada exitosamente en Orange BeCoins.',
            amount: rewardCode.amount,
          };
        }

        // Si no existe el usuario, se queda PENDING (para la etapa 3)
        return {
          status: RedemptionStatus.PENDING,
          message: 'Recompensa reservada. Se acreditará al crear la cuenta con este email.',
          amount: rewardCode.amount,
        };
      });
    } catch (error: any) {
      // 23505 es el código de PostgreSQL para Unique Violation
      if (error.code === '23505' || (error.message && error.message.includes('unique constraint'))) {
        throw new ConflictException('Este email ya ha reclamado una recompensa anteriormente.');
      }
      throw error;
    }
  }
}
