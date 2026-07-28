import { Module } from '@nestjs/common';
import { UserRechargeService } from './user-recharge.service';
import { UserRechargeController } from './user-recharge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeTransfer } from './entities/user-recharge.entity';
import { UserRechargeRepository } from './user-recharge.repository';
import { EmailModule } from '../email/email.module';
import { WalletsModule } from '../wallets/wallets.module';

import { RequestTransferRechargeUseCase } from './use-cases/request-transfer-recharge.use-case';
import { RejectTransferRechargeUseCase } from './use-cases/reject-transfer-recharge.use-case';
import { CompleteTransferRechargeUseCase } from './use-cases/complete-transfer-recharge.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RechargeTransfer]), EmailModule, WalletsModule],
  controllers: [UserRechargeController],
  providers: [
    UserRechargeService,
    UserRechargeRepository,
    RequestTransferRechargeUseCase,
    RejectTransferRechargeUseCase,
    CompleteTransferRechargeUseCase,
  ],
})
export class UserRechargeModule {}
