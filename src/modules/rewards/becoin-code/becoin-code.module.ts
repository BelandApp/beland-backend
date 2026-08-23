import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardCode } from './entities/reward-code.entity';
import { RewardRedemption } from './entities/reward-redemption.entity';
import { BecoinCodeController } from './becoin-code.controller';
import { BecoinCodeService } from './becoin-code.service';
import { BecoinOrangeModule } from '../becoin-orange/becoin-orange.module';
import { User } from '../../users/entities/users.entity';

import { ProcessPendingRewardUseCase } from './use-cases/process-pending-reward.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardCode, RewardRedemption, User]),
    BecoinOrangeModule,
  ],
  controllers: [BecoinCodeController],
  providers: [BecoinCodeService, ProcessPendingRewardUseCase],
  exports: [BecoinCodeService, ProcessPendingRewardUseCase],
})
export class BecoinCodeModule {}
